defmodule ElixirusWeb.StudentLive.Index do
  alias ElixirusWeb.LoginModal
  use ElixirusWeb, :live_view
  import Heroicons
  import ElixirusWeb.Helpers
  use ElixirusWeb.LoginHandler
  import Elixirus.PythonWrapper
  import Heroicons, only: [chevron_right: 1, inbox: 1]

  defp handle_timetable_events(timetable, schedule, _calendar, day) do
    now = warsaw_now()

    weekday =
      now
      |> Date.day_of_week()
      |> Kernel.-(1)

    todays_lessons =
      timetable
      |> Enum.at(weekday)
      |> Enum.filter(&(&1 |> Map.get(~c"subject") != []))
      |> Enum.reduce(%{}, fn event, acc ->
        number = event |> stringify_value(~c"number")

        event_map = %{
          title: event |> stringify_value(~c"subject"),
          subject: event |> stringify_value(~c"teacher_and_classroom"),
          timeframe:
            event
            |> stringify_value(~c"date_from")
            |> Kernel.<>("-")
            |> Kernel.<>(event |> stringify_value(~c"date_to")),
          data: event |> Map.get(~c"info")
        }

        update_events =
          case acc |> Map.get(number) do
            nil -> [event_map]
            events -> [event_map | events]
          end

        acc |> Map.put(number, update_events)
      end)

    schedule[day]
    |> Enum.reduce(todays_lessons, fn event, acc ->
      number = event |> stringify_value(~c"number")

      event_map = %{
        title: event |> stringify_value(~c"title"),
        subject: event |> stringify_value(~c"subject"),
        timeframe: event |> stringify_value(~c"hour"),
        data: event |> Map.get(~c"data")
      }

      update_events =
        case acc |> Map.get(number) do
          nil -> [event_map]
          events -> [event_map | events]
        end

      acc |> Map.put(number, update_events)
    end)
  end

  def calculate_gpa_from_averages(averages) do
    sum =
      averages
      |> Map.values()
      |> Enum.map(fn avgs -> avgs |> List.last() end)
      |> Enum.filter(&(&1 != ~c"-"))

    sum
    |> Enum.reduce(0, fn avg, acc -> avg |> List.to_float() |> Kernel.+(acc) end)
    |> Kernel./(length(sum) |> max(1))
  end

  def fetch_data(socket, token, semester) do
    attendance = handle_cache_data(socket.assigns.user_id, "#{semester}-new_attendance")
    student_data = handle_cache_data(socket.assigns.user_id, "student_data")
    new_grades = handle_cache_data(socket.assigns.user_id, "#{semester}-new_grades")
    averages = handle_cache_data(socket.assigns.user_id, "semester_grades")
    unread_messages = handle_cache_data(socket.assigns.user_id, "unread_messages")
    timetable = handle_cache_data(socket.assigns.user_id, "timetable")
    frequency = handle_cache_data(socket.assigns.user_id, "frequency")

    schedule =
      handle_cache_data(
        socket.assigns.user_id,
        "#{socket.assigns.year}-#{socket.assigns.month}-schedule"
      )

    socket
    |> assign(:loadings, [])
    |> assign(:new_grades, %{})
    |> assign(:timetable, [])
    |> assign(:frequency, [])
    |> assign(:schedule, [])
    |> assign(:new_attendance, [])
    |> assign(:student_data, %{})
    |> assign(:events, [])
    |> assign(:unread_messages, [])
    |> assign(:semester_grades, %{})
    |> create_fetcher(averages, :semester_grades, fn ->
      {python(:helpers, :fetch_all_grades, [token, semester]), semester}
    end)
    |> create_fetcher(unread_messages, :unread_messages, fn ->
      {python(:helpers, :fetch_all_messages, [token]), nil}
    end)
    |> create_fetcher(attendance, :new_attendance, fn ->
      {python(:helpers, :fetch_new_attendance, [token, semester]), semester}
    end)
    |> create_fetcher(new_grades, :new_grades, fn ->
      {python(:helpers, :fetch_new_grades, [token, semester]), semester}
    end)
    |> create_fetcher(student_data, :student_data, fn ->
      {python(:helpers, :fetch_student_data, [token]), nil}
    end)
    |> create_fetcher(schedule, :schedule, fn ->
      {python(:helpers, :fetch_schedule, [token, socket.assigns.year, socket.assigns.month]),
       socket.assigns.year, socket.assigns.month}
    end)
    |> create_fetcher(timetable, :timetable, fn ->
      {python(:overview, :handle_overview_timetable, [token, this_weeks_monday() |> to_string]),
       nil}
    end)
    |> create_fetcher(frequency, :frequency, fn ->
      python(:helpers, :fetch_attendance_frequency, [socket.assigns.token])
    end)
  end

  def handle_event(
        "connect_calendar",
        %{"calendar_id" => calendar_id},
        socket
      ) do
    end_of_week = Date.add(this_weeks_monday(), 7)

    socket =
      socket
      |> assign(:calendar_id, calendar_id)
      |> start_async(:load_timetable_calendar, fn ->
        {python(:calendar_handler, :get_google_calendar_events, [
           calendar_id,
           this_weeks_monday(),
           end_of_week |> to_string
         ]), nil}
      end)

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"calendar_id" => calendar_id}, socket) do
    socket =
      socket
      |> assign(:calendar_id, calendar_id)

    handle_event("connect_calendar", %{"calendar_id" => calendar_id}, socket)
  end

  def handle_event("retrieve_local_storage", %{"semester" => semester}, socket) do
    socket =
      socket
      |> assign(:semester, semester)

    {:noreply, socket}
  end

  def handle_async(:load_semester_grades, {:ok, {{:ok, [grades, averages]}, semester}}, socket) do
    cache_and_ttl_data(socket.assigns.user_id, "semester_grades", averages)
    cache_and_ttl_data(socket.assigns.user_id, "#{semester}-grades", grades)

    socket =
      socket
      |> assign(:loadings, List.delete(socket.assigns.loadings, :semester_grades))
      |> assign(:semester_grades, averages)

    {:noreply, socket}
  end

  def handle_async(:load_new_grades, {:ok, {{:ok, [grades, _]}, semester}}, socket) do
    cache_and_ttl_data(socket.assigns.user_id, "#{semester}-new_grades", grades)

    socket =
      socket
      |> assign(:loadings, List.delete(socket.assigns.loadings, :new_grades))
      |> assign(:new_grades, grades)

    {:noreply, socket}
  end

  def handle_async(:load_frequency, {:ok, freq}, socket) do
    socket =
      case freq do
        {:ok, frequency} ->
          frequency =
            frequency
            |> Tuple.to_list()
            |> Enum.map(
              &((&1 * 1000)
                |> round()
                |> Kernel./(10))
            )

          cache_and_ttl_data(socket.assigns.user_id, "frequency", frequency)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))
          |> assign(:frequency, frequency)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    socket =
      case schedule do
        {:ok, schedule} ->
          cache_and_ttl_data(socket.assigns.user_id, "#{year}-#{month}-schedule", schedule)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :schedule))
          |> assign(:schedule, schedule)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_unread_messages, {:ok, {{:ok, unread_messages}, _}}, socket) do
    cache_and_ttl_data(socket.assigns.user_id, "messages", unread_messages |> Enum.take(50))

    unread =
      unread_messages |> Enum.filter(fn msg -> msg |> Map.get(~c"unread") |> Kernel.==(true) end)

    cache_and_ttl_data(socket.assigns.user_id, "unread_messages", unread)

    socket =
      socket
      |> assign(:loadings, List.delete(socket.assigns.loadings, :unread_messages))
      |> assign(:unread_messages, unread)

    {:noreply, socket}
  end

  def handle_async(task_name, {:ok, {data, semester}}, socket) do
    name =
      task_name
      |> Atom.to_string()
      |> String.replace_prefix("load_", "")
      |> String.to_existing_atom()

    socket =
      case data do
        {:ok, data} ->
          cache_name =
            case semester do
              nil -> name |> Atom.to_string()
              sem -> "#{sem}-#{Atom.to_string(name)}"
            end

          cache_and_ttl_data(socket.assigns.user_id, cache_name, data)

          socket
          |> assign(name, data)
          |> assign(:loadings, List.delete(socket.assigns.loadings, name))

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(
        _params,
        %{"token" => api_token, "user_id" => user_id, "semester" => semester},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)

    calendar_data = handle_cache_data(user_id, "timetable_calendar")

    {{year, month, day}, _} = :calendar.local_time()

    socket =
      case calendar_data do
        :load -> assign(socket, :timetable_calendar, [])
        cal_data -> assign(socket, :timetable_calendar, cal_data)
      end

    socket =
      socket
      |> assign(:day, day)
      |> assign(:month, month)
      |> assign(:year, year)
      |> assign(:token, api_token)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:login_required, false)
      |> assign(:page_title, "Home")
      |> fetch_data(api_token, semester)

    {:ok, socket}
  end
end
