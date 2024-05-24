defmodule ElixirusWeb.StudentLive.Index do
  use ElixirusWeb, :live_view
  import Heroicons
  import ElixirusWeb.Helpers

  import Elixirus.Python.SnakeWrapper
  import Heroicons, only: [chevron_right: 1, inbox: 1]

  defp clean_period_name(period) do
    case period do
      -1 -> "Today"
      period -> period
    end
  end

  defp averages_color(final_gpa) do
    case to_string(final_gpa) do
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
        case number |> Integer.parse() do
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
    |> assign(:semester_grades, [])
    |> create_fetcher(averages, :semester_grades, fn ->
      {python(:fetchers, :fetch_all_grades, [token, semester]), semester}
    end)
    |> create_fetcher(unread_messages, :unread_messages, fn ->
      {python(:fetchers, :fetch_all_messages, [token]), nil}
    end)
    |> create_fetcher(attendance, :new_attendance, fn ->
      {python(:fetchers, :fetch_new_attendance, [token, semester]), semester}
    end)
    |> create_fetcher(new_grades, :new_grades, fn ->
      {python(:fetchers, :fetch_new_grades, [token, semester]), semester}
    end)
    |> create_fetcher(
      student_data,
      :student_data,
      fn ->
        {python(:fetchers, :fetch_student_data, [token]), nil}
      end
    )
    |> create_fetcher(schedule, :schedule, fn ->
      {python(:fetchers, :fetch_schedule, [token, socket.assigns.year, socket.assigns.month]),
       socket.assigns.year, socket.assigns.month}
    end)
    |> create_fetcher(timetable, :timetable, fn ->
      {python(:overview, :handle_overview_timetable, [token, this_weeks_monday() |> to_string]),
       nil}
    end)
    |> create_fetcher(frequency, :frequency, fn ->
      python(:fetchers, :fetch_attendance_frequency, [socket.assigns.token])
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

  def handle_async(:load_semester_grades, {:ok, {data, semester}}, socket) do
    socket =
      case data do
        {:ok, [grades, gpas]} ->
          gpas =
            gpas
            |> Enum.sort_by(fn {_, [_, _, gpa]} ->
              case to_string(gpa) do
                "-" -> 99.0
                gpa -> gpa |> String.to_float()
              end
            end)

          cache_and_ttl_data(socket.assigns.user_id, "semester_grades", gpas, 15)
          cache_and_ttl_data(socket.assigns.user_id, "#{semester}-grades", grades, 15)

          socket
          |> assign(:semester_grades, gpas)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :semester_grades))

        %{:token_error => message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        %{:error => message} ->
          put_flash(socket, :error, message)
      end

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

          cache_and_ttl_data(socket.assigns.user_id, "frequency", frequency, 10)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))
          |> assign(:frequency, frequency)

        %{:token_error => message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        %{:error => message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    socket =
      case schedule do
        {:ok, schedule} ->
          cache_and_ttl_data(socket.assigns.user_id, "#{year}-#{month}-schedule", schedule, 10)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :schedule))
          |> assign(:schedule, schedule)

        %{:token_error => message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        %{:error => message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_async(:load_unread_messages, {:ok, {{:ok, unread_messages}, _}}, socket) do
    cache_and_ttl_data(socket.assigns.user_id, "messages", unread_messages |> Enum.take(50), 10)

    unread =
      unread_messages |> Enum.filter(fn msg -> msg |> Map.get(:unread) |> Kernel.==(true) end)

    cache_and_ttl_data(socket.assigns.user_id, "unread_messages", unread, 15)

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

        %{:token_error => message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        %{:error => message} ->
          put_flash(socket, :error, message)
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
