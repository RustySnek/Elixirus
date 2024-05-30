defmodule ElixirusWeb.StudentLive.AcademicsLive.GradesLive.Subject do
  require Logger
  use ElixirusWeb, :live_view
  import ElixirusWeb.Helpers

  import Elixirus.Python.SnakeWrapper
  import ElixirusWeb.Components.Loadings

  def fetch_all_grades(token, semester) do
    {python(:fetchers, :fetch_all_grades, [token, semester]), semester}
  end

  def handle_async(:load_grades, {:ok, {grades, semester}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case grades do
        {:ok, [grades, semester_grades]} ->
          semester_grades = sort_gpas(semester_grades)
          cache_and_ttl_data(user_id, "#{semester}-grades", grades, 15)
          cache_and_ttl_data(user_id, "semester_grades", semester_grades, 15)

          socket
          |> assign(:grades, grades)

        %{:token_error => _message} ->
          assign(socket, :login_required, true)
          |> push_event("require-login", %{})

        %{:error => message} ->
          Logger.error(message)
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"semester" => semester}, socket) do
    user_id = socket.assigns.user_id
    token = socket.assigns.token
    grades = handle_cache_data(user_id, "#{semester}-grades")

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:grades, %{})
      |> create_fetcher(grades, :grades, fn ->
        {python(:fetchers, :fetch_all_grades, [token, semester]), semester}
      end)

    {:noreply, socket}
  end

  def mount(
        %{"subject" => subject, "semester" => semester} = params,
        %{"token" => api_token, "user_id" => user_id},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)
    grade_id = Map.get(params, "grade_id", nil)

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:user_id, user_id)
      |> assign(:subject, subject)
      |> assign(:grades, %{})
      |> assign(:loadings, [])
      |> assign(:shown_grade, grade_id)
      |> assign(:semester, semester)
      |> assign(:page_title, subject)
      |> assign(:login_required, false)

    {:ok, socket}
  end
end
