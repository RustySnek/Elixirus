defmodule ElixirusWeb.StudentLive.GradesLive.Stats do
  import ElixirusWeb.Helpers
  alias Elixirus.Types.Grade
  import Venomous
  alias Venomous.SnakeArgs
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view

  @asyncs [:load_grades]
  def handle_async(:load_grades, {:ok, grades}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, grades, @asyncs) do
        {:ok, {[first, second] = grades, semester_grades, _descriptive}} ->
          semester_grades = sort_gpas(semester_grades)
          cache_and_ttl_data(user_id, "1-grades", second, 15)
          cache_and_ttl_data(user_id, "0-grades", first, 15)
          cache_and_ttl_data(user_id, "averages", semester_grades, 15)

          socket
          |> assign(:grades, grades)
          |> assign(:semester_grades, semester_grades)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def mount(_params, %{"token" => token}, socket) when map_size(token) == 0 do
    {:ok, socket |> assign(:page_title, "Login") |> push_event("require-login", %{})}
  end

  def mount(
        _params,
        %{"token" => token, "user_id" => user_id, "semester" => _semester},
        socket
      ) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    grades =
      [handle_cache_data(user_id, "0-grades"), handle_cache_data(user_id, "1-grades")]
      |> dbg

    average = handle_cache_data(user_id, "averages")

    socket =
      socket
      |> assign(:user_id, user_id)
      |> assign(:client, client)
      |> assign(:grades, [])

    socket =
      if :load == average or :load in grades do
        start_async(socket, :load_grades, fn ->
          SnakeArgs.from_params(:elixirus, :grades, [client]) |> python!()
        end)
      else
        socket
        |> assign(:grades, grades)
        |> assign(:semester_grades, average)
      end

    {:ok, socket}
  end
end
