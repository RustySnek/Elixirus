defmodule ElixirusWeb.StudentLive.AcademicsLive.Index do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  import ElixirusWeb.Helpers
  use ElixirusWeb.SetSemesterLive
  use ElixirusWeb.LoginHandler
  alias ElixirusWeb.LoginModal
  import Heroicons, only: [scale: 1, magnifying_glass: 1]

  def fetch_data(socket, token, semester) do
    todays_lessons = handle_cache_data(socket.assigns.user_id, "todays_completed_lessons")
    grades = handle_cache_data(socket.assigns.user_id, "#{semester}-grades-last_login")
    attendance = handle_cache_data(socket.assigns.user_id, "#{semester}-attendance-last_login")

    socket =
      socket
      |> assign(:completed_lessons, [])
      |> assign(:week_grades, %{})
      |> assign(:week_attendance, [])

    socket =
      case grades do
        :load ->
          socket
          |> assign(:loading_grades, true)
          |> start_async(:load_grades, fn ->
            {python(:helpers, :fetch_week_grades, [token, semester]), semester}
          end)

        grades ->
          assign(socket, :week_grades, grades)
      end

    socket =
      case todays_lessons do
        :load ->
          socket
          |> assign(:loading_completed_lessons, true)
          |> start_async(:load_completed_lessons, fn ->
            python(:helpers, :fetch_todays_completed_lessons, [token])
          end)

        lessons ->
          assign(socket, :completed_lessons, lessons)
      end

    socket =
      case attendance do
        :load ->
          socket
          |> assign(:loading_attendance, true)
          |> start_async(:load_attendance, fn ->
            {python(:helpers, :fetch_week_attendance, [token, semester]), semester}
          end)

        attendance ->
          assign(socket, :week_attendance, attendance)
      end

    socket
  end

  def handle_async(:load_completed_lessons, {:ok, completed_lessons}, socket) do
    socket =
      case completed_lessons do
        {:ok, lessons} ->
          cache_and_ttl_data(
            socket.assigns.user_id,
            "todays_completed_lessons",
            lessons
          )

          socket
          |> assign(:completed_lessons, completed_lessons)
          |> assign(:loading_completed_lessons, false)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_attendance, {:ok, {attendance, semester}}, socket) do
    socket =
      case attendance do
        {:ok, attendance} ->
          cache_and_ttl_data(
            socket.assigns.user_id,
            "#{semester}-attendance-last_login",
            attendance
          )

          socket
          |> assign(:week_attendance, attendance)
          |> assign(:loading_attendance, false)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_grades, {:ok, {grades, semester}}, socket) do
    socket =
      case grades do
        {:ok, [grades, _semester_grades]} ->
          cache_and_ttl_data(socket.assigns.user_id, "#{semester}-grades-last_login", grades)

          socket
          |> assign(:week_grades, grades)
          |> assign(:loading_grades, false)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(
        _params,
        %{"semester" => semester, "token" => token, "user_id" => user_id},
        socket
      ) do
    token = handle_api_token(socket, token)

    socket =
      socket
      |> assign(:token, token)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> fetch_data(token, semester)
      |> assign(:page_title, "Academics")
      |> assign(:login_required, false)

    {:ok, socket}
  end
end
