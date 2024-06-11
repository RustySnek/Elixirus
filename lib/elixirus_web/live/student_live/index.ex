defmodule ElixirusWeb.StudentLive.Index do
  require Logger
  use ElixirusWeb, :live_view
  import Heroicons
  import ElixirusWeb.Helpers

  import Venomous
  alias Venomous.SnakeArgs
  import Heroicons, only: [chevron_right: 1, inbox: 1]

  @asyncs [
    :load_frequency,
    :load_timetable,
    :load_schedule,
    :load_student_data,
    :load_new_grades,
    :load_new_attendance,
    :load_unread_messages,
    :load_semester_grades
  ]

  defp clean_period_name(period) do
    case period do
      -1 -> "Today"
      period -> period
    end
  end

  defp averages_color(final_gpa) do
    case final_gpa do
      "-" ->
        "bg-gray-900/80"

      gpa ->
        gpa = String.to_float(gpa)

        cond do
          Kernel.<(gpa, 3.0) and Kernel.>(gpa, 2.0) ->
            "bg-amber-700"

          Kernel.<=(gpa, 2.0) ->
            "bg-red-700"

          true ->
            "bg-purple-900/90"
        end
    end
  end

  defp handle_timetable_events(timetable, schedule, _calendar, day) do
    now = warsaw_now()

    weekday =
      now
      |> Date.day_of_week()
      |> Kernel.-(1)

    todays_lessons =
      timetable
      |> Enum.at(weekday)
      |> Enum.filter(&(&1 |> Map.get(:subject) != ""))
      |> Enum.reduce(%{}, fn event, acc ->
        number = event.number

        event_map = %{
          title: event.subject,
          subject: event.teacher_and_classroom,
          timeframe:
            event.date_from
            |> Kernel.<>("-")
            |> Kernel.<>(event.date_to),
          data: event.info
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
      number = event.number

      number =
        case number |> to_string() |> Integer.parse() do
          {number, _} -> number
          _ -> -1
        end

      event_map = %{
        title: event.title,
        subject: event.subject,
        timeframe: event.hour,
        data: event.data
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
      |> Enum.map(fn {_, avgs} -> avgs |> List.last() end)
      |> Enum.filter(&(&1 != "-"))

    sum
    |> Enum.reduce(0, fn avg, acc -> avg |> String.to_float() |> Kernel.+(acc) end)
    |> Kernel./(length(sum) |> max(1))
  end

  def fetch_data(socket, token, semester) do
    user_id = socket.assigns.user_id
    attendance = handle_cache_data(user_id, "#{semester}-new_attendance")
    student_data = handle_cache_data(user_id, "student_data")
    new_grades = handle_cache_data(user_id, "#{semester}-new_grades")
    averages = handle_cache_data(user_id, "semester_grades")
    unread_messages = handle_cache_data(user_id, "unread_messages")
    timetable = handle_cache_data(user_id, "timetable")
    frequency = handle_cache_data(user_id, "frequency")
    year = socket.assigns.year
    month = socket.assigns.month

    schedule =
      handle_cache_data(
        user_id,
        "#{year}-#{month}-schedule"
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
    |> assign(:semester_grades, [])
    |> create_fetcher(averages, :semester_grades, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_all_grades, [token, semester]) |> python!(:infinity), semester}
    end)
    |> create_fetcher(unread_messages, :unread_messages, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_all_messages, [token]) |> python!(:infinity), nil}
    end)
    |> create_fetcher(attendance, :new_attendance, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_new_attendance, [token, semester]) |> python!(:infinity), semester}
    end)
    |> create_fetcher(new_grades, :new_grades, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_new_grades, [token, semester]) |> python!(:infinity), semester}
    end)
    |> create_fetcher(
      student_data,
      :student_data,
      fn ->
        {SnakeArgs.from_params(:fetchers, :fetch_student_data, [token])|>python!(:infinity), nil}
      end
    )
    |> create_fetcher(schedule, :schedule, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_schedule, [token, year, month]) |> python!(:infinity), year, month}
    end)
    |> create_fetcher(timetable, :timetable, fn ->
      {SnakeArgs.from_params(:overview, :handle_overview_timetable, [token, this_weeks_monday() |> to_string]) |> python!(:infinity),
       nil}
    end)
    |> create_fetcher(frequency, :frequency, fn ->
      SnakeArgs.from_params(:fetchers, :fetch_attendance_frequency, [token])|>python!(:infinity)
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
        {SnakeArgs.from_params(:calendar_handler, :get_google_calendar_events, [
           calendar_id,
           this_weeks_monday(),
           end_of_week
         ]) |> python!(:infinity), nil}
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

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_semester_grades, {:ok, {data, semester}}, socket) do
    socket =
      case match_basic_errors(socket, data, @asyncs) do
        {:ok, [grades, gpas]} ->
          gpas = sort_gpas(gpas)

          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "semester_grades", gpas, 15)
          cache_and_ttl_data(user_id, "#{semester}-grades", grades, 15)

          socket
          |> assign(:semester_grades, gpas)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :semester_grades))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_new_grades, {:ok, {{:ok, [grades, _]}, semester}}, socket) do
    user_id = socket.assigns.user_id
    cache_and_ttl_data(user_id, "#{semester}-new_grades", grades)

    socket =
      socket
      |> assign(:loadings, List.delete(socket.assigns.loadings, :new_grades))
      |> assign(:new_grades, grades)

    {:noreply, socket}
  end

  def handle_async(:load_frequency, {:ok, freq}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, freq, @asyncs) do
        {:ok, frequency} ->
          frequency =
            frequency
            |> Tuple.to_list()
            |> Enum.map(
              &((&1 * 1000)
                |> round()
                |> Kernel./(10))
            )

          cache_and_ttl_data(user_id, "frequency", frequency, 10)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))
          |> assign(:frequency, frequency)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, schedule, @asyncs) do
        {:ok, schedule} ->
          cache_and_ttl_data(user_id, "#{year}-#{month}-schedule", schedule, 10)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :schedule))
          |> assign(:schedule, schedule)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_unread_messages, {:ok, {{:ok, unread_messages}, _}}, socket) do
    user_id = socket.assigns.user_id
    cache_and_ttl_data(user_id, "messages", unread_messages |> Enum.take(50), 10)

    unread =
      unread_messages |> Enum.filter(fn msg -> msg |> Map.get(:unread) |> Kernel.==(true) end)

    cache_and_ttl_data(user_id, "unread_messages", unread, 15)

    socket =
      socket
      |> assign(:loadings, List.delete(socket.assigns.loadings, :unread_messages))
      |> assign(:unread_messages, unread)

    {:noreply, socket}
  end

  def handle_async(task_name, {:ok, {data, semester}}, socket)
      when task_name in [
             :load_new_attendance,
             :load_student_data,
             :load_timetable,
             :load_unread_messages,
             :load_new_grades
           ] do
    user_id = socket.assigns.user_id

    name =
      task_name
      |> Atom.to_string()
      |> String.replace_prefix("load_", "")
      |> String.to_existing_atom()

    socket =
      case match_basic_errors(socket, data, @asyncs) do
        {:ok, data} ->
          cache_name =
            case semester do
              nil -> name |> Atom.to_string()
              sem -> "#{sem}-#{Atom.to_string(name)}"
            end

          cache_and_ttl_data(user_id, cache_name, data)

          socket
          |> assign(name, data)
          |> assign(:loadings, List.delete(socket.assigns.loadings, name))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
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
