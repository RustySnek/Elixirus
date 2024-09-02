defmodule ElixirusWeb.StudentLive.CommunicationLive.Messages do
  require Logger
  use ElixirusWeb, :live_view
  import Venomous
  alias Venomous.SnakeArgs

  import ElixirusWeb.Helpers
  alias Heroicons
  alias ElixirusWeb.Modal
  import ElixirusWeb.Components.Loadings

  use ElixirusWeb.SetSemesterLive
  import Earmark, only: [as_html!: 1]
  alias HtmlSanitizeEx
  @asyncs [:load_messages, :load_sent_messages, :load_group_recipients, :load_recipient_groups]

  def find_group(group_name, author, token) do
    {:ok, group} = SnakeArgs.from_params(:fetchers, :get_group_recipients, [token, group_name]) |> python!(python_timeout: :infinity)
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

  def fetch_messages(token, page) do
    SnakeArgs.from_params(:fetchers, :fetch_messages, [token, page]) |> python!(python_timeout: :infinity)
  end

  def fetch_message_content(token, id) do
    SnakeArgs.from_params(:fetchers, :fetch_message_content, [token, id]) |> python!(python_timeout: :infinity)
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
    token = socket.assigns.token
    title = socket.assigns.compose_title
    content = socket.assigns.compose_content
    selected_recipients = socket.assigns.selected_recipients

    socket =
      case SnakeArgs.from_params(:fetchers, :send_message, [
             token,
             title,
             content,
             selected_recipients |> Enum.map(fn {_, id} -> id end)
           ]) |> python!() do
        {:ok, msg} ->
          put_flash(socket, :info, "Sent!\n#{msg}")
          |> assign(:compose_title, "")
          |> assign(:compose_content, "")
          |> assign(:selected_recipients, MapSet.new())
          |> start_async(:load_sent_messages, fn ->
            SnakeArgs.from_params(:fetchers, :fetch_sent_messages, [token, 0]) |> python!(python_timeout: :infinity)
          end)

        %{:send_error => msg} ->
          put_flash(socket, :error, "Error!\n#{msg}")

        %{:token_error => _msg} ->
          socket
          |> assign(:login_required, true)
          |> push_event("require-login", %{})

        %{:error => msg} ->
          Logger.error(msg)
          put_flash(socket, :error, msg)
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
    token = socket.assigns.token

    socket =
      socket
      |> assign(:group_recipients, %{})
      |> assign(:selected_group, group)
      |> create_fetcher(:load, :group_recipients, fn ->
        SnakeArgs.from_params(:fetchers, :get_group_recipients, [token, group]) |> python!(python_timeout: :infinity)
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
          socket |> assign(:recipient_groups, groups)
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

  def mount(
        _params,
        %{"token" => api_token, "user_id" => user_id, "semester" => semester},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)
    data = handle_cache_data(user_id, "messages")
    sent = handle_cache_data(user_id, "sent_messages")

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:loadings, [])
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:login_required, false)
      |> assign(:show_message_modal, false)
      |> assign(:messages, [])
      |> assign(:shown_messages, [])
      |> assign(:seen_messages, [])
      |> assign(:sent_messages, [])
      |> assign(:unread_messages, [])
      |> assign(:visibility, "all")
      |> assign(:selected_recipients, MapSet.new())
      |> assign(:selected_group, "")
      |> assign(:group_recipients, %{})
      |> assign(:recipient_groups, [])
      |> assign(:message_content, nil)
      |> assign(:compose_title, "")
      |> assign(:compose_content, "")
      |> assign(:page_title, "Messages")
      |> create_fetcher(:load, :recipient_groups, fn ->
        SnakeArgs.from_params(:fetchers, :get_recipient_groups, [api_token]) |> python!(python_timeout: :infinity)
      end)
      |> create_fetcher(sent, :sent_messages, fn ->
        SnakeArgs.from_params(:fetchers, :fetch_sent_messages, [api_token, 0]) |> python!(python_timeout: :infinity)
      end)

    socket =
      case data do
        :load ->
          socket
          |> assign(:loadings, [:messages | socket.assigns.loadings])
          |> start_async(:load_messages, fn -> fetch_messages(api_token, 0) end)

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
end
