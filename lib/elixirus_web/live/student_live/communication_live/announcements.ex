defmodule ElixirusWeb.StudentLive.CommunicationLive.Announcements do
  use ElixirusWeb, :live_view
  use ElixirusWeb.LoginHandler
  use ElixirusWeb.SetSemesterLive
  import ElixirusWeb.Helpers
  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal
  import Earmark, only: [as_html!: 1]

  def handle_async(:load_announcements, {:ok, announcements}, socket) do
    socket =
      case announcements do
        {:ok, announcements} ->
          cache_and_ttl_data(socket.assigns.user_id, "announcements", announcements, 15)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :announcements))
          |> assign(:announcements, announcements)

        {:token_error, _message} ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(
        _params,
        %{"user_id" => user_id, "token" => token, "semester" => semester},
        socket
      ) do
    token = handle_api_token(socket, token)
    announcements = handle_cache_data(user_id, "announcements")

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:page_title, "Announcements")
      |> assign(:announcements, [])
      |> assign(:loadings, [])
      |> assign(:login_required, false)
      |> assign(:user_id, user_id)
      |> assign(:token, token)
      |> create_fetcher(announcements, :announcements, fn ->
        python(:helpers, :fetch_announcements, [token])
      end)

    {:ok, socket}
  end
end
