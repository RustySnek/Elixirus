defmodule ElixirusWeb.StudentLive.Messages do
  require Logger
  use ElixirusWeb, :live_view
  alias Elixirus.Types.Message
  alias Elixirus.Types.MessageData
  alias Venomous.SnakeArgs
  import Venomous
  alias Elixirus.Types.Client
  import ElixirusWeb.Helpers
  alias Heroicons

  import Earmark, only: [as_html!: 1]
  alias HtmlSanitizeEx
  @asyncs [:load_messages, :load_sent_messages, :load_group_recipients, :load_recipient_groups]

  def find_group(group_name, author, token) do
    {:ok, group} =
      SnakeArgs.from_params(:fetchers, :get_group_recipients, [token, group_name])
      |> python!(python_timeout: :infinity)

    {group[author], group_name}
  end

  def find_group_and_recipient(socket, author) do
    author = Regex.replace(~r/\(.*?\)*\[.*?\]/, author, "", global: true) |> String.trim()
    recipient_groups = socket.assigns.recipient_groups
    token = socket.assigns.token

    {_, {name, group}} =
      Task.async_stream(recipient_groups, fn group ->
        find_group(group, author, token)
      end)
      |> Enum.filter(fn {:ok, {id, _group}} ->
        id != nil
      end)
      |> Enum.at(0)

    case name do
      nil ->
        put_flash(socket, :error, "Error while finding recipient's id")

      name ->
        socket
        |> assign(:selected_recipients, MapSet.new() |> MapSet.put({author, name}))
        |> assign(:selected_group, group)
    end
  end

  def fetch_messages(client, page) do
    SnakeArgs.from_params(:elixirus, :received, [client, page])
    |> python!()
  end

  def fetch_message_content(token, id) do
    SnakeArgs.from_params(:fetchers, :fetch_message_content, [token, id])
    |> python!(python_timeout: :infinity)
  end

  def handle_event("search_message", %{"query" => query}, socket) do
    {:noreply, push_patch(socket, to: ~p"/student/messages?search=#{query}")}
  end

  def handle_event("write_message", %{"content" => content, "title" => title}, socket) do
    socket =
      socket
      |> assign(:compose_content, content)
      |> assign(:compose_title, title)

    {:noreply, socket}
  end

  def handle_event("reply", _params, socket) do
    socket =
      socket
      |> assign(
        :compose_content,
        "\n\n====================================\n#{socket.assigns.message_content.content}"
      )
      |> assign(:compose_title, "Re: #{socket.assigns.message_content.title}")
      |> find_group_and_recipient(socket.assigns.message_content.author)

    handle_event("wipe_content", %{}, socket)
  end

  def handle_event("send_message", _params, socket) do
    client = socket.assigns.client
    title = socket.assigns.compose_title
    content = socket.assigns.compose_content
    selected_recipients = socket.assigns.selected_recipients

    socket =
      case SnakeArgs.from_params(:elixirus, :send, [
             client,
             title,
             content,
             selected_recipients |> Enum.map(fn {_, id} -> id end)
           ])
           |> python!() do
        {:ok, msg} ->
          put_flash(socket, :info, "Sent!\n#{msg}")
          |> assign(:compose_title, "")
          |> assign(:compose_content, "")
          |> assign(:selected_recipients, MapSet.new())
          |> start_async(:load_sent_messages, fn ->
            SnakeArgs.from_params(:elixirus, :sent, [client, 0])
            |> python!()
          end)

        {:send_error, msg} ->
          put_flash(socket, :error, "Error!\n#{msg}")

        {:token_error, _msg} ->
          socket
          |> push_event("require-login", %{})

        {:error, msg} ->
          Logger.error(msg)
          put_flash(socket, :error, "Couldn't send the message")
      end

    {:noreply, socket}
  end

  def handle_event("remove_recipient", %{"recipient" => recipient, "recipient_id" => id}, socket) do
    {:noreply,
     assign(
       socket,
       :selected_recipients,
       MapSet.delete(socket.assigns.selected_recipients, {recipient, id})
     )}
  end

  def handle_event("pick_recipient", %{"name" => name}, socket) do
    socket =
      case socket.assigns.group_recipients[name] do
        nil ->
          socket

        id ->
          socket
          |> assign(
            :selected_recipients,
            socket.assigns.selected_recipients |> MapSet.put({name, id})
          )
      end

    {:noreply, socket}
  end

  def handle_event("select_recipient_group", %{"recipient_group" => group}, socket) do
    client = socket.assigns.client
    user_id = socket.assigns.user_id

    socket =
      socket
      |> assign(:group_recipients, %{})
      |> assign(:selected_group, group)
      |> create_fetcher(user_id, :load, :group_recipients, fn ->
        SnakeArgs.from_params(:elixirus, :group_recipients, [client, group]) |> python!()
      end)

    {:noreply, socket}
  end

  def handle_event("wipe_content", _params, socket) do
    socket =
      socket |> assign(:message_content, nil)

    {:noreply, socket}
  end

  def handle_event(
        "view_message",
        %{"msg_id" => id},
        socket
      ) do
    token = socket.assigns.token

    socket =
      socket
      |> start_async(:fetch_content, fn -> fetch_message_content(token, id) end)

    {:noreply, socket}
  end

  def handle_event("toggle_visibility", %{"visibility" => visibility}, socket) do
    messages =
      case visibility do
        "all" ->
          socket.assigns.messages

        "seen" ->
          socket.assigns.seen_messages

        "unread" ->
          socket.assigns.unread_messages

        "sent" ->
          socket.assigns.sent_messages
      end

    socket =
      socket
      |> assign(:shown_messages, messages)
      |> assign(:visibility, visibility)

    {:noreply, socket}
  end

  def handle_async(:load_content, {:ok, {content, href}}, socket) do
    socket =
      case match_basic_errors(socket, content, []) do
        {:ok, content} ->
          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "message-#{href}", content)
          assign(socket, :content, content)

        {:token_error, _, socket} ->
          socket

        {:error, err, socket} ->
          Logger.error(inspect(err))
          put_flash(socket, :error, "Error while loading the message")
      end

    {:noreply, socket}
  end

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_sent_messages, {:ok, messages}, socket) do
    socket =
      case match_basic_errors(socket, messages, @asyncs) do
        {:ok, messages} ->
          socket
          |> assign(:sent_messages, messages)
          |> assign(:loadings, socket.assigns.loadings |> List.delete(:sent_messages))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_group_recipients, {:ok, recipients}, socket) do
    socket =
      case match_basic_errors(socket, recipients, @asyncs) do
        {:ok, recipients} ->
          socket
          |> assign(
            :group_recipients,
            recipients
            |> Enum.reduce(%{}, fn {key, val}, acc ->
              Map.put(acc, key, val)
            end)
          )
          |> assign(:loadings, socket.assigns.loadings |> List.delete(:recipients))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:fetch_content, {:ok, content}, socket) do
    socket =
      case match_basic_errors(socket, content, @asyncs) do
        {:ok, content} ->
          assign(socket, :message_content, content)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_recipient_groups, {:ok, groups}, socket) do
    socket =
      case match_basic_errors(socket, groups, @asyncs) do
        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket

        {:ok, groups} ->
          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "message-groups", groups)
          assign(socket, :recipient_groups, groups)
      end

    {:noreply, socket}
  end

  def handle_async(:load_messages, {:ok, messages}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, messages, @asyncs) do
        {:ok, messages} ->
          {unread, seen} =
            messages
            |> Enum.split_with(fn msg -> msg.unread == true end)

          cache_and_ttl_data(user_id, "messages", messages, 15)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :messages))
          |> assign(:messages, messages)
          |> assign(:shown_messages, messages)
          |> assign(:seen_messages, seen)
          |> assign(:unread_messages, unread)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_params(
        %{"message_id" => msg_id},
        _uri,
        %{assigns: %{live_action: :view, client: client}} = socket
      ) do
    user_id = socket.assigns.user_id
    content = handle_cache_data(user_id, "message-#{msg_id}")

    socket =
      case content do
        :load ->
          socket
          |> assign(:content, nil)
          |> start_async(:load_content, fn ->
            {SnakeArgs.from_params(:elixirus, :msg_content, [client, msg_id])
             |> Venomous.python!(), msg_id}
          end)

        %MessageData{} = content ->
          assign(socket, :content, content)
      end

    {:noreply, socket}
  end

  def handle_params(%{"search" => ""}, _uri, socket),
    do:
      {:noreply,
       socket |> assign(:search, "") |> assign(:shown_messages, socket.assigns.messages)}

  def handle_params(%{"search" => query}, _uri, socket) do
    query = String.downcase(query)

    messages =
      socket.assigns.messages
      |> Enum.reduce(
        [[], [], []],
        fn %Message{title: title, author: author, date: date} = message,
           [title_match, author_match, date_match] = acc ->
          cond do
            title |> String.downcase() |> String.contains?(query) ->
              [[message | title_match], author_match, date_match]

            author |> String.downcase() |> String.contains?(query) ->
              [title_match, [message | author_match], date_match]

            date |> String.downcase() |> String.contains?(query) ->
              [title_match, author_match, [message | date_match]]

            true ->
              acc
          end
        end
      )
      |> List.flatten()

    {:noreply, socket |> assign(:search, query) |> assign(:shown_messages, messages)}
  end

  def handle_params(
        _params,
        _uri,
        %{assigns: %{live_action: :send_message, user_id: user_id, client: client}} = socket
      ) do
    groups = handle_cache_data(user_id, "message-groups")

    socket =
      socket
      |> assign(:selected_group, "")
      |> assign(:selected_recipients, MapSet.new())
      |> assign(:group_recipients, %{})
      |> assign(:recipient_groups, [])
      |> assign(:compose_title, "")
      |> assign(:compose_content, "")
      |> create_fetcher(user_id, groups, :recipient_groups, fn ->
        SnakeArgs.from_params(:elixirus, :message_groups, [client]) |> python!()
      end)

    {:noreply, socket}
  end

  def handle_params(_params, _uri, socket) do
    {:noreply, socket}
  end

  def mount(
        _params,
        %{"token" => token, "user_id" => user_id, "semester" => semester},
        socket
      ) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    messages = handle_cache_data(user_id, "messages")
    sent = handle_cache_data(user_id, "sent_messages")

    socket =
      socket
      |> assign(:client, client)
      |> assign(:loadings, [])
      |> assign(:messages, [])
      |> assign(:shown_messages, [])
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:visibility, "all")
      |> assign(:page_title, "Messages")
      |> assign(:search, "")
      |> create_fetcher(user_id, sent, :sent_messages, fn ->
        SnakeArgs.from_params(:elixirus, :sent, [client])
        |> python!()
      end)

    socket =
      case messages do
        :load ->
          socket
          |> assign(:loadings, [:messages | socket.assigns.loadings])
          |> start_async(:load_messages, fn -> fetch_messages(client, 0) end)

        data ->
          {unread, seen} =
            data |> Enum.split_with(fn msg -> msg.unread == true end)

          socket
          |> assign(:messages, data)
          |> assign(:shown_messages, data)
          |> assign(:unread_messages, unread)
          |> assign(:seen_messages, seen)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :messages))
      end

    {:ok, socket}
  end

  defp visibility_opts(assigns) do
    ~H"""
    <div class="justify-evenly flex flex-row w-full self-center order-last z-40 fixed bottom-2 mx-auto md:hidden">
      <button phx-value-visibility="all" phx-click="toggle_visibility">
        <Heroicons.inbox
          mini
          class={"w-10 #{@visibility |> Kernel.==("all") && "!text-fuchsia-400"}"}
        />
      </button>
      <button phx-value-visibility="seen" phx-click="toggle_visibility">
        <Heroicons.eye mini class={"w-10 #{@visibility |> Kernel.==("seen") && "!text-fuchsia-400"}"} />
      </button>
      <button phx-value-visibility="unread" phx-click="toggle_visibility">
        <Heroicons.eye_slash
          mini
          class={"w-10 #{@visibility |> Kernel.==("unread") && "!text-fuchsia-400"}"}
        />
      </button>
      <button phx-value-visibility="sent" phx-click="toggle_visibility">
        <div class="flex flex-row">
          <Heroicons.envelope
            mini
            class={"w-10 #{@visibility |> Kernel.==("sent") && "!text-fuchsia-400"}"}
          />
          <Heroicons.chevron_up
            mini
            class={"w-10 #{@visibility |> Kernel.==("sent") && "!text-fuchsia-400"}"}
          />
        </div>
      </button>
    </div>
    <div class="px-10 flex-row gap-y-5 justify-start gap-x-10 flex-grow hidden md:flex items-center rounded-2xl pb-4 text-sm">
      <.link patch={~p"/student/messages/send"}>
        <div class="flex flex-col items-center">
          <div class="flex flex-row">
            <Heroicons.envelope class="w-10" />
            <Heroicons.arrow_up class="w-10" />
          </div>
          <span>Send Message</span>
        </div>
      </.link>

      <button phx-value-visibility="all" phx-click="toggle_visibility">
        <div class="flex flex-col items-center">
          <Heroicons.inbox class={"w-10 #{@visibility |> Kernel.==("all") && "!text-fuchsia-400"}"} />
          <span>Inbox</span>
        </div>
      </button>
      <button phx-value-visibility="seen" phx-click="toggle_visibility">
        <div class="flex flex-col items-center">
          <Heroicons.envelope_open class={"w-10 #{@visibility |> Kernel.==("seen") && "!text-fuchsia-400"}"} />
          <span>Seen</span>
        </div>
      </button>
      <button phx-value-visibility="unread" phx-click="toggle_visibility">
        <div class="flex flex-col items-center">
          <Heroicons.envelope class={"w-10 #{@visibility |> Kernel.==("unread") && "!text-fuchsia-400"}"} />
          <span>Unread</span>
        </div>
      </button>
      <button phx-value-visibility="sent" phx-click="toggle_visibility">
        <div class="flex flex-col items-center">
          <div class="flex flex-row">
            <Heroicons.envelope class={"w-10 #{@visibility |> Kernel.==("sent") && "!text-fuchsia-400"}"} />
            <Heroicons.chevron_up class={"w-10 #{@visibility |> Kernel.==("sent") && "!text-fuchsia-400"}"} />
          </div>
          <span>Sent</span>
        </div>
      </button>
    </div>
    """
  end

  defp message(assigns) do
    ~H"""
    <div class={
    "hover:opacity-90 rotate-0 w-full
    rounded bg-fuchsia-800/25
    #{@message.unread == true && "!bg-red-700/25"}
    "}>
      <.link
        class=" px-4 py-2 gap-x-2 flex flex-col xl:flex-row w-full text-lg justify-between h-24"
        patch={~p"/student/messages/#{@message.href}"}
      >
        <div class="truncate xl:w-1/2 xl:text-justify w-full">
          <%= @message.title %>
        </div>
        <div class="text-base justify-between flex flex-col xl:w-1/3 w-full text-gray-400">
          <p class="truncate text-end"><%= @message.author %></p>
          <p class="truncate text-end"><%= @message.date %></p>
        </div>
      </.link>
    </div>
    """
  end
end
