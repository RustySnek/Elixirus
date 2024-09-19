defmodule ElixirusWeb.StudentLive.Announcements do
  require Logger
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view

  import ElixirusWeb.Helpers
  import Venomous
  alias Venomous.SnakeArgs

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
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    announcements = handle_cache_data(user_id, "announcements")

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:page_title, "Announcements")
      |> assign(:announcements, [])
      |> assign(:loadings, [])
      |> assign(:user_id, user_id)
      |> assign(:client, client)
      |> create_fetcher(user_id, announcements, :announcements, fn ->
        SnakeArgs.from_params(:elixirus, :announcements, [client])
        |> python!()
      end)

    {:ok, socket}
  end
end
