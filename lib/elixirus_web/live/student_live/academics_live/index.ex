defmodule ElixirusWeb.StudentLive.AcademicsLive.Index do
  require Logger
  use ElixirusWeb, :live_view
  import Venomous
  alias Venomous.SnakeArgs
  import ElixirusWeb.Helpers
  use ElixirusWeb.SetSemesterLive

  import Heroicons, only: [scale: 1, magnifying_glass: 1]

  @asyncs [
    :load_week_grades,
    :load_week_attendance,
    :load_completed_lessons,
    :load_homework
  ]

  defp sort_grades_by_date(grades) do
    grades
    |> Enum.sort_by(
      &(&1 |> Map.get(:date) |> Date.from_iso8601!()),
      :desc
    )
  end

  def fetch_data(socket, token, semester) do
    user_id = socket.assigns.user_id
    todays_lessons = handle_cache_data(user_id, "todays_completed_lessons")
    grades = handle_cache_data(user_id, "#{semester}-grades-week")
    attendance = handle_cache_data(user_id, "#{semester}-attendance-last_login")
    homework = handle_cache_data(user_id, "homework")

    socket
    |> assign(:loadings, [])
    |> assign(:completed_lessons, [])
    |> assign(:week_grades, %{})
    |> assign(:week_attendance, [])
    |> assign(:homework, [])
    |> create_fetcher(grades, :week_grades, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_week_grades, [token, semester]) |> python!(:infinity), semester}
    end)
    |> create_fetcher(todays_lessons, :completed_lessons, fn ->
      SnakeArgs.from_params(:fetchers, :fetch_todays_completed_lessons, [token]) |> python!(:infinity)
    end)
    |> create_fetcher(homework, :homework, fn ->
      monday = this_weeks_monday() |> Date.add(-14)
      next_monday = monday |> Date.add(14) |> Calendar.strftime("%Y-%m-%d")
      monday = monday |> Calendar.strftime("%Y-%m-%d")

      SnakeArgs.from_params(:fetchers, :fetch_homework, [token, monday, next_monday]) |> python!(:infinity)
    end)
    |> create_fetcher(attendance, :week_attendance, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_week_attendance, [token, semester]) |> python!(:infinity), semester}
    end)
  end

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_completed_lessons, {:ok, completed_lessons}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, completed_lessons, @asyncs) do
        {:ok, lessons} ->
          cache_and_ttl_data(
            user_id,
            "todays_completed_lessons",
            lessons
          )

          socket
          |> assign(:completed_lessons, lessons)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :completed_lessons))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_homework, {:ok, homework}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, homework, @asyncs) do
        {:ok, homework} ->
          cache_and_ttl_data(user_id, "homework", homework, 15)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :homework))
          |> assign(:homework, homework |> Enum.reverse())

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_week_attendance, {:ok, {attendance, semester}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, attendance, @asyncs) do
        {:ok, attendance} ->
          cache_and_ttl_data(
            user_id,
            "#{semester}-attendance-last_login",
            attendance
          )

          socket
          |> assign(:week_attendance, attendance)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :week_attendance))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_week_grades, {:ok, {grades, semester}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, grades, @asyncs) do
        {:ok, [grades, _semester_grades]} ->
          cache_and_ttl_data(user_id, "#{semester}-grades-week", grades)

          socket
          |> assign(:week_grades, grades)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :week_grades))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
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
