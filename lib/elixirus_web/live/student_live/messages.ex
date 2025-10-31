defmodule ElixirusWeb.StudentLive.Messages do
  require Logger
  use ElixirusWeb, :live_view
  alias Elixirus.Types.Message
  alias Elixirus.Types.MessageData
  alias ElixirusWeb.LoginForm
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
          |> LoginForm.require_login()

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
          class={"w-10 #{@visibility |> Kernel.==("all") && "!text-purple-400"}"}
        />
      </button>
      <button phx-value-visibility="seen" phx-click="toggle_visibility">
        <Heroicons.eye mini class={"w-10 #{@visibility |> Kernel.==("seen") && "!text-purple-400"}"} />
      </button>
      <button phx-value-visibility="unread" phx-click="toggle_visibility">
        <Heroicons.eye_slash
          mini
          class={"w-10 #{@visibility |> Kernel.==("unread") && "!text-purple-400"}"}
        />
      </button>
      <button phx-value-visibility="sent" phx-click="toggle_visibility">
        <div class="flex flex-row">
          <Heroicons.envelope
            mini
            class={"w-10 #{@visibility |> Kernel.==("sent") && "!text-purple-400"}"}
          />
          <Heroicons.chevron_up
            mini
            class={"w-10 #{@visibility |> Kernel.==("sent") && "!text-purple-400"}"}
          />
        </div>
      </button>
    </div>
    <div class="flex flex-row gap-3 flex-wrap justify-center lg:justify-start items-center pb-6 hidden md:flex">
      <.link 
        patch={~p"/student/messages/send"}
        class="glass-card backdrop-blur-xl rounded-lg px-4 py-3 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 group"
      >
        <Heroicons.envelope class="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
        <Heroicons.arrow_up class="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
        <span class="text-sm font-medium text-purple-200">Send Message</span>
      </.link>

      <button 
        phx-value-visibility="all" 
        phx-click="toggle_visibility"
        class={
          "glass-card backdrop-blur-xl rounded-lg px-4 py-3 border transition-all duration-200 flex items-center gap-2 " <>
          if(@visibility == "all", 
            do: "border-purple-400/50 bg-purple-500/20 shadow-lg shadow-purple-500/20",
            else: "border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
          )
        }
      >
        <Heroicons.inbox class={"w-5 h-5 transition-colors #{if(@visibility == "all", do: "text-purple-200", else: "text-purple-300")}"} />
        <span class={["text-sm font-medium transition-colors", if(@visibility == "all", do: "text-purple-200", else: "text-purple-300/70")]}>Inbox</span>
      </button>

      <button 
        phx-value-visibility="seen" 
        phx-click="toggle_visibility"
        class={
          "glass-card backdrop-blur-xl rounded-lg px-4 py-3 border transition-all duration-200 flex items-center gap-2 " <>
          if(@visibility == "seen", 
            do: "border-purple-400/50 bg-purple-500/20 shadow-lg shadow-purple-500/20",
            else: "border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
          )
        }
      >
        <Heroicons.envelope_open class={"w-5 h-5 transition-colors #{if(@visibility == "seen", do: "text-purple-200", else: "text-purple-300")}"} />
        <span class={["text-sm font-medium transition-colors", if(@visibility == "seen", do: "text-purple-200", else: "text-purple-300/70")]}>Seen</span>
      </button>

      <button 
        phx-value-visibility="unread" 
        phx-click="toggle_visibility"
        class={
          "glass-card backdrop-blur-xl rounded-lg px-4 py-3 border transition-all duration-200 flex items-center gap-2 " <>
          if(@visibility == "unread", 
            do: "border-purple-400/50 bg-purple-500/20 shadow-lg shadow-purple-500/20",
            else: "border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
          )
        }
      >
        <Heroicons.envelope class={"w-5 h-5 transition-colors #{if(@visibility == "unread", do: "text-purple-200", else: "text-purple-300")}"} />
        <span class={["text-sm font-medium transition-colors", if(@visibility == "unread", do: "text-purple-200", else: "text-purple-300/70")]}>Unread</span>
      </button>

      <button 
        phx-value-visibility="sent" 
        phx-click="toggle_visibility"
        class={
          "glass-card backdrop-blur-xl rounded-lg px-4 py-3 border transition-all duration-200 flex items-center gap-2 " <>
          if(@visibility == "sent", 
            do: "border-purple-400/50 bg-purple-500/20 shadow-lg shadow-purple-500/20",
            else: "border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
          )
        }
      >
        <div class="flex items-center gap-1">
          <Heroicons.envelope class={"w-5 h-5 transition-colors #{if(@visibility == "sent", do: "text-purple-200", else: "text-purple-300")}"} />
          <Heroicons.chevron_up class={"w-4 h-4 transition-colors #{if(@visibility == "sent", do: "text-purple-200", else: "text-purple-300")}"} />
        </div>
        <span class={["text-sm font-medium transition-colors", if(@visibility == "sent", do: "text-purple-200", else: "text-purple-300/70")]}>Sent</span>
      </button>
    </div>
    """
  end

  defp message(assigns) do
    ~H"""
    <.link
      patch={~p"/student/messages/#{@message.href}"}
      class={
        "group relative w-full glass-card backdrop-blur-xl rounded-lg p-4 border transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 " <>
        if(@message.unread == true, do: "border-red-500/40 bg-red-500/5", else: "border-purple-500/20")
      }
    >
      <div class="flex flex-col gap-3">
        <!-- Title Section -->
        <div class="flex items-start justify-between gap-4">
          <h3 class={[
            "font-semibold text-lg line-clamp-2 flex-1 transition-colors",
            @message.unread == true && "text-red-300 group-hover:text-red-200",
            @message.unread != true && "text-purple-200 group-hover:text-purple-100"
          ]}>
            <%= @message.title %>
          </h3>
          <div :if={@message.unread == true} class="flex-shrink-0">
            <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
          </div>
        </div>
        
        <!-- Metadata Section -->
        <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 text-sm">
          <div class="flex items-center gap-2 text-purple-300/70">
            <Heroicons.user_circle class="w-4 h-4" />
            <span class="truncate"><%= @message.author %></span>
          </div>
          <div class="flex items-center gap-2 text-purple-300/60">
            <Heroicons.clock class="w-4 h-4" />
            <span><%= @message.date %></span>
          </div>
        </div>
      </div>
      
      <!-- Hover effect overlay -->
      <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </.link>
    """
  end
end
