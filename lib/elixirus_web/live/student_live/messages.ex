defmodule ElixirusWeb.StudentLive.Messages do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal
  import ElixirusWeb.Helpers
  import Heroicons
  alias ElixirusWeb.Modal
  import ElixirusWeb.Components.Loadings

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

  def handle_event("navigate_students", %{"token" => token}, socket) do
    socket =
      socket
      |> assign(:token, token)
      |> assign(:login_required, false)
      |> start_async(:load_messages, fn -> fetch_messages(token, 0) end)

    {:noreply, redirect(socket, to: "/student/messages")}
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

          socket
          |> assign(:messages, messages)
          |> assign(:shown_messages, messages)
          |> assign(:seen_messages, seen)
          |> assign(:unread_messages, unread)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(_params, %{"token" => api_token}, socket) do
    api_token =
      case api_token |> Map.keys() do
        [] -> ""
        token -> token |> hd() |> to_charlist()
      end

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:login_required, false)
      |> assign(:show_message_modal, false)
      |> assign(:messages, [])
      |> assign(:shown_messages, [])
      |> assign(:seen_messages, [])
      |> assign(:unread_messages, [])
      |> assign(:content, "")
      |> assign(:title, "")
      |> assign(:date, "")
      |> assign(:author, "")
      |> assign(:content, "")
      |> start_async(:load_messages, fn -> fetch_messages(api_token, 0) end)

    {:ok, socket}
  end
end
