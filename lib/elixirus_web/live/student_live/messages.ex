defmodule ElixirusWeb.StudentLive.Messages do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal
  import ElixirusWeb.Helpers
  import Heroicons
  alias ElixirusWeb.Modal
  import ElixirusWeb.Components.Loadings
  use ElixirusWeb.LoginHandler
  use ElixirusWeb.SetSemesterLive

  def fetch_messages(token, page) do
    python(:helpers, :fetch_messages, [token, page])
  end

  def fetch_message_content(token, id) do
    python(:helpers, :fetch_message_content, [token, id])
  end

  def handle_event("wipe_content", _params, socket) do
    socket =
      socket
      |> assign(:title, "")
      |> assign(:date, "")
      |> assign(:author, "")
      |> assign(:content, "")

    {:noreply, socket}
  end

  def handle_event(
        "view_message",
        %{"msg_id" => id, "author" => author, "title" => title, "date" => date},
        socket
      ) do
    socket =
      socket
      |> start_async(:fetch_content, fn -> fetch_message_content(socket.assigns.token, id) end)
      |> assign(:title, title)
      |> assign(:date, date)
      |> assign(:author, author)

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
      end

    socket =
      socket
      |> assign(:shown_messages, messages)

    {:noreply, socket}
  end

  def handle_async(:fetch_content, {:ok, content}, socket) do
    socket =
      case content do
        {:ok, content} -> assign(socket, :content, content |> to_string())
        _ -> assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_messages, {:ok, messages}, socket) do
    socket =
      case messages do
        {:ok, messages} ->
          {unread, seen} =
            messages |> Enum.partition(fn msg -> msg |> Map.get(~c"unread") == true end)

          Cachex.put(:elixirus_cache, socket.assigns.user_id <> "messages", messages)
          Cachex.expire(:elixirus_cache, socket.assigns.user_id <> "messages", :timer.minutes(5))

          socket
          |> assign(:loaded, true)
          |> assign(:messages, messages)
          |> assign(:shown_messages, messages)
          |> assign(:seen_messages, seen)
          |> assign(:unread_messages, unread)

        _ ->
          assign(socket, :login_required, true)
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

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:login_required, false)
      |> assign(:show_message_modal, false)
      |> assign(:loaded, false)
      |> assign(:messages, [])
      |> assign(:shown_messages, [])
      |> assign(:seen_messages, [])
      |> assign(:unread_messages, [])
      |> assign(:content, "")
      |> assign(:title, "")
      |> assign(:date, "")
      |> assign(:author, "")
      |> assign(:content, "")

    socket =
      case data do
        :load ->
          socket |> start_async(:load_messages, fn -> fetch_messages(api_token, 0) end)

        data ->
          {unread, seen} =
            data |> Enum.partition(fn msg -> msg |> Map.get(~c"unread") == true end)

          socket
          |> assign(:messages, data)
          |> assign(:shown_messages, data)
          |> assign(:unread_messages, unread)
          |> assign(:seen_messages, seen)
          |> assign(:loaded, true)
      end

    {:ok, socket}
  end
end
