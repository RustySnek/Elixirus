defmodule ElixirusWeb.StudentLive.AcademicsLive.Index do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  import ElixirusWeb.Helpers
  use ElixirusWeb.SetSemesterLive
  use ElixirusWeb.LoginHandler
  alias ElixirusWeb.LoginModal
  import Heroicons, only: [scale: 1, magnifying_glass: 1]

  defp sort_grades_by_date(grades) do
    grades
    |> Enum.sort_by(
      &(&1 |> Map.get(~c"date") |> to_string() |> Date.from_iso8601!()),
      :desc
    )
  end

  def fetch_data(socket, token, semester) do
    todays_lessons = handle_cache_data(socket.assigns.user_id, "todays_completed_lessons")
    grades = handle_cache_data(socket.assigns.user_id, "#{semester}-grades-week")
    attendance = handle_cache_data(socket.assigns.user_id, "#{semester}-attendance-last_login")
    homework = handle_cache_data(socket.assigns.user_id, "homework")

    socket
    |> assign(:loadings, [])
    |> assign(:completed_lessons, [])
    |> assign(:week_grades, %{})
    |> assign(:week_attendance, [])
    |> assign(:homework, [])
    |> create_fetcher(grades, :week_grades, fn ->
      {python(:helpers, :fetch_week_grades, [token, semester]), semester}
    end)
    |> create_fetcher(todays_lessons, :completed_lessons, fn ->
      python(:helpers, :fetch_todays_completed_lessons, [token])
    end)
    |> create_fetcher(homework, :homework, fn ->
      monday = this_weeks_monday() |> Date.add(-14)
      next_monday = monday |> Date.add(14) |> Calendar.strftime("%Y-%m-%d")
      monday = monday |> Calendar.strftime("%Y-%m-%d")

      python(:helpers, :fetch_homework, [token, monday, next_monday])
    end)
    |> create_fetcher(attendance, :week_attendance, fn ->
      {python(:helpers, :fetch_week_attendance, [token, semester]), semester}
    end)
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
          |> assign(:completed_lessons, lessons)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :completed_lessons))

        {:token_error, message} ->
          assign(socket, :login_required, true) |> put_flash(:error, message)

        {:error, message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_async(:load_homework, {:ok, homework}, socket) do
    socket =
      case homework do
        {:ok, homework} ->
          cache_and_ttl_data(socket.assigns.user_id, "homework", homework, 15)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :homework))
          |> assign(:homework, homework |> Enum.reverse())

        {:token_error, message} ->
          assign(socket, :login_required, true) |> put_flash(:error, message)

        {:error, message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_async(:load_week_attendance, {:ok, {attendance, semester}}, socket) do
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
          |> assign(:loadings, List.delete(socket.assigns.loadings, :week_attendance))

        {:token_error, message} ->
          assign(socket, :login_required, true) |> put_flash(:error, message)

        {:error, message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_async(:load_week_grades, {:ok, {grades, semester}}, socket) do
    socket =
      case grades do
        {:ok, [grades, _semester_grades]} ->
          cache_and_ttl_data(socket.assigns.user_id, "#{semester}-grades-week", grades)

          socket
          |> assign(:week_grades, grades)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :week_grades))

        {:token_error, message} ->
          assign(socket, :login_required, true) |> put_flash(:error, message)

        {:error, message} ->
          put_flash(socket, :error, message)
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
