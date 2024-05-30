defmodule ElixirusWeb.StudentLive.CommunicationLive.Announcements do
  require Logger
  use ElixirusWeb, :live_view

  use ElixirusWeb.SetSemesterLive
  import ElixirusWeb.Helpers
  import Elixirus.Python.SnakeWrapper

  alias HtmlSanitizeEx
  import Earmark, only: [as_html!: 1]
  @asyncs [:load_announcements]

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_announcements, {:ok, announcements}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, announcements, @asyncs) do
        {:ok, announcements} ->
          cache_and_ttl_data(user_id, "announcements", announcements, 15)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :announcements))
          |> assign(:announcements, announcements)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
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
        python(:fetchers, :fetch_announcements, [token])
      end)

    {:ok, socket}
  end
end
