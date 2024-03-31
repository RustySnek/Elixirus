defmodule ElixirusWeb.StudentLive.Grades.Subject do
  use ElixirusWeb, :live_view
  import ElixirusWeb.Helpers
  use ElixirusWeb.LoginHandler
  import Elixirus.PythonWrapper
  import ElixirusWeb.Components.Loadings

  def fetch_all_grades(token, semester) do
    python(:helpers, :fetch_all_grades, [token, semester])
  end

  def handle_async(:load_grades, {:ok, grades}, socket) do
    socket =
      case grades do
        {:ok, [grades, _]} ->
          Cachex.put(
            :elixirus_cache,
            socket.assigns.user_id <> "#{socket.assigns.semester}-grades",
            grades
          )

          Cachex.expire(
            :elixirus_cache,
            socket.assigns.user_id <> "#{socket.assigns.semester}-grades",
            :timer.minutes(5)
          )

          socket
          |> assign(:grades, grades)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"semester" => semester}, socket) do
    grades = handle_cache_data(socket.assigns.user_id, "#{semester}-grades")
    socket = socket |> assign(:semester, semester) |> assign(:grades, %{})

    socket =
      case grades do
        :load ->
          socket
          |> start_async(:load_grades, fn -> fetch_all_grades(socket.assigns.token, semester) end)

        _ ->
          socket
          |> assign(:grades, grades)
      end

    {:noreply, socket}
  end

  def mount(
        %{"subject" => subject, "semester" => semester} = params,
        %{"token" => api_token, "user_id" => user_id},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)
    grade_id = Map.get(params, "grade_id", nil)
    grades = handle_cache_data(user_id, "#{semester}-grades")

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:user_id, user_id)
      |> assign(:subject, subject)
      |> assign(:grades, %{})
      |> assign(:shown_grade, grade_id)
      |> assign(:semester, semester)

    socket =
      case grades do
        :load ->
          socket |> start_async(:load_grades, fn -> fetch_all_grades(api_token, semester) end)

        _ ->
          socket
          |> assign(:grades, grades)
      end

    {:ok, socket}
  end
end
