defmodule ElixirusWeb.StudentLive.CommunicationLive.Messages do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper

  import ElixirusWeb.Helpers
  alias Heroicons
  alias ElixirusWeb.Modal
  import ElixirusWeb.Components.Loadings

  use ElixirusWeb.SetSemesterLive
  import Earmark, only: [as_html!: 1]
  alias HtmlSanitizeEx

  def fetch_messages(token, page) do
    python(:helpers, :fetch_messages, [token, page])
  end

  def fetch_message_content(token, id) do
    python(:helpers, :fetch_message_content, [token, id])
  end

  def handle_event("write_message", %{"content" => content, "title" => title}, socket) do
    socket =
      socket
      |> assign(:compose_content, content)
      |> assign(:compose_title, title)

    {:noreply, socket}
  end

  def handle_event("send_message", _params, socket) do
    socket =
      case python(:helpers, :send_message, [
             socket.assigns.token,
             socket.assigns.compose_title,
             socket.assigns.compose_content,
             socket.assigns.selected_recipients |> Enum.map(fn {_, id} -> id end)
           ]) do
        {:ok, msg} ->
          put_flash(socket, :info, "Sent!\n#{msg}")
          |> assign(:compose_title, "")
          |> assign(:compose_content, "")
          |> assign(:selected_recipients, MapSet.new())
          |> start_async(:load_sent_messages, fn ->
            python(:helpers, :fetch_sent_messages, [socket.assigns.token, 0])
          end)

        {:send_error, msg} ->
          put_flash(socket, :error, "Error!\n#{msg}")

        {:token_error, msg} ->
          socket
          |> assign(:login_required, true)
          |> put_flash(:error, msg)
          |> push_event("require-login", %{})

        {:error, msg} ->
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
    socket =
      socket
      |> assign(:group_recipients, %{})
      |> assign(:selected_group, group)
      |> create_fetcher(:load, :group_recipients, fn ->
        python(:helpers, :get_group_recipients, [socket.assigns.token, group])
      end)

    {:noreply, socket}
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

        "sent" ->
          socket.assigns.sent_messages
      end

    socket =
      socket
      |> assign(:shown_messages, messages)
      |> assign(:visibility, visibility)

    {:noreply, socket}
  end

  def handle_async(:load_sent_messages, {:ok, messages}, socket) do
    socket =
      case messages do
        {:ok, messages} ->
          socket
          |> assign(:sent_messages, messages)
          |> assign(:loadings, socket.assigns.loadings |> List.delete(:sent_messages))

        {:token_error, msg} ->
          socket
          |> assign(:login_required, true)
          |> put_flash(:error, msg)
          |> push_event("require-login", %{})

        {:error, msg} ->
          put_flash(socket, :error, msg)
      end

    {:noreply, socket}
  end

  def handle_async(:load_group_recipients, {:ok, recipients}, socket) do
    socket =
      case recipients do
        {:ok, recipients} ->
          socket
          |> assign(
            :group_recipients,
            recipients
            |> Enum.reduce(%{}, fn {key, val}, acc ->
              Map.put(acc, key |> to_string(), val |> to_string())
            end)
          )
          |> assign(:loadings, socket.assigns.loadings |> List.delete(:recipients))

        {:token_error, msg} ->
          socket
          |> assign(:login_required, true)
          |> put_flash(:error, msg)
          |> push_event("require-login", %{})

        {:error, msg} ->
          put_flash(socket, :error, msg)
      end

    {:noreply, socket}
  end

  def handle_async(:fetch_content, {:ok, content}, socket) do
    socket =
      case content do
        {:ok, content} ->
          assign(socket, :content, content |> to_string())

        {:token_error, message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        {:error, message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_async(:load_recipient_groups, {:ok, groups}, socket) do
    socket =
      case groups do
        {:error, msg} ->
          socket |> put_flash(:error, msg)

        {:token_error, msg} ->
          socket
          |> assign(:login_required, true)
          |> push_event("require-login", %{})
          |> put_flash(:error, msg)

        {:ok, groups} ->
          socket |> assign(:recipient_groups, groups |> Enum.map(&to_string(&1)))
      end

    {:noreply, socket}
  end

  def handle_async(:load_messages, {:ok, messages}, socket) do
    socket =
      case messages do
        {:ok, messages} ->
          {unread, seen} =
            messages
            |> Enum.split_with(fn msg -> Map.get(msg, ~c"unread") == true end)

          cache_and_ttl_data(socket.assigns.user_id, "messages", messages, 15)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :messages))
          |> assign(:messages, messages)
          |> assign(:shown_messages, messages)
          |> assign(:seen_messages, seen)
          |> assign(:unread_messages, unread)

        {:token_error, message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        {:error, message} ->
          put_flash(socket, :error, message)
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
      |> assign(:content, "")
      |> assign(:title, "")
      |> assign(:compose_title, "")
      |> assign(:compose_content, "")
      |> assign(:date, "")
      |> assign(:author, "")
      |> assign(:content, "")
      |> assign(:page_title, "Messages")
      |> create_fetcher(:load, :recipient_groups, fn ->
        python(:helpers, :get_recipient_groups, [api_token])
      end)
      |> create_fetcher(sent, :sent_messages, fn ->
        python(:helpers, :fetch_sent_messages, [api_token, 0])
      end)

    socket =
      case data do
        :load ->
          socket
          |> assign(:loadings, [:messages | socket.assigns.loadings])
          |> start_async(:load_messages, fn -> fetch_messages(api_token, 0) end)

        data ->
          {unread, seen} =
            data |> Enum.split_with(fn msg -> Map.get(msg, ~c"unread") == true end)

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
