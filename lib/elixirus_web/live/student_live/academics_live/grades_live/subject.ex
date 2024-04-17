defmodule ElixirusWeb.StudentLive.AcademicsLive.GradesLive.Subject do
  use ElixirusWeb, :live_view
  import ElixirusWeb.Helpers
  use ElixirusWeb.LoginHandler
  import Elixirus.PythonWrapper
  import ElixirusWeb.Components.Loadings
  alias ElixirusWeb.LoginModal

  def fetch_all_grades(token, semester) do
    {python(:helpers, :fetch_all_grades, [token, semester]), semester}
  end

  def handle_async(:load_grades, {:ok, {grades, semester}}, socket) do
    socket =
      case grades do
        {:ok, [grades, semester_grades]} ->
          cache_and_ttl_data(socket.assigns.user_id, "#{semester}-grades", grades, 15)
          cache_and_ttl_data(socket.assigns.user_id, "semester_grades", semester_grades, 15)

          socket
          |> assign(:grades, grades)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"semester" => semester}, socket) do
    grades = handle_cache_data(socket.assigns.user_id, "#{semester}-grades")

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:grades, %{})
      |> create_fetcher(grades, :grades, fn ->
        {python(:helpers, :fetch_all_grades, [socket.assigns.token, semester]), semester}
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
