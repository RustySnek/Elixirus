defmodule ElixirusWeb.StudentLive.GradesLive.Subject do
  require Logger
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view
  import ElixirusWeb.Helpers

  import Venomous
  alias Venomous.SnakeArgs
  import ElixirusWeb.Components.Loadings

  @asyncs [:load_grades]

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_grades, {:ok, {grades, semester}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, grades, @asyncs) do
        {:ok, {[first, second] = grades, semester_grades, _descriptive}} ->
          semester_grades = sort_gpas(semester_grades)
          cache_and_ttl_data(user_id, "1-grades", second, 15)
          cache_and_ttl_data(user_id, "0-grades", first, 15)
          cache_and_ttl_data(user_id, "averages", semester_grades, 15)

          semester =
            case Integer.parse(semester) do
              :error -> 0
              {int, _} -> int
            end

          socket
          |> assign(:grades, Enum.at(grades, semester, %{}))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def mount(
        %{"subject" => subject} = params,
        %{"token" => token, "user_id" => user_id, "semester" => semester},
        socket
      ) do
    grade_id = Map.get(params, "grade_id", nil)

    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    grades = handle_cache_data(user_id, "#{semester}-grades")

    socket =
      socket
      |> assign(:client, client)
      |> assign(:user_id, user_id)
      |> assign(:subject, subject)
      |> assign(:grades, %{})
      |> assign(:loadings, [])
      |> assign(:shown_grade, grade_id)
      |> assign(:semester, semester)
      |> assign(:page_title, subject)

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:grades, %{})
      |> create_fetcher(user_id, grades, :grades, fn ->
        {SnakeArgs.from_params(:elixirus, :grades, [client]) |> python!(), semester}
      end)

    {:ok, socket}
  end
end
