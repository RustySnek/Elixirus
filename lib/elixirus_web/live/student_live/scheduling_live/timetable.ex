defmodule ElixirusWeb.StudentLive.SchedulingLive.Timetable do
  require Logger
  use ElixirusWeb, :live_view
  import Venomous
  alias Venomous.SnakeArgs

  alias ElixirusWeb.Modal
  import ElixirusWeb.Helpers

  use ElixirusWeb.SetSemesterLive
  import Heroicons, only: [chevron_right: 1, chevron_left: 1, information_circle: 1]
  @asyncs [:load_schedule, :load_timetable]

  defp exclude_empty_days(timetable) do
    timetable
    |> Enum.filter(fn weekday ->
      Enum.any?(weekday, fn period ->
        period.subject |> Kernel.!=("")
      end)
    end)
  end

  defp load_schedule(socket, month_year) do
    token = socket.assigns.token
    [year, month] = month_year |> String.split("-")

    start_async(socket, :load_schedule, fn ->
      {SnakeArgs.from_params(:fetchers, :fetch_schedule, [token, year, month]) |> python!(:infinity), year, month}
    end)
  end

  defp fetch_schedule(socket, monday) do
    socket = assign(socket, :schedule, %{})
    user_id = socket.assigns.user_id

    [first, second] =
      [monday, monday |> Date.add(6)]
      |> Enum.map(
        &(&1
          |> Date.to_iso8601()
          |> String.split("-")
          |> Enum.slice(0..1)
          |> Enum.join("-"))
      )

    if first == second do
      schedule = handle_cache_data(user_id, "#{first}-schedule")

      case schedule do
        :load -> load_schedule(socket, first)
        schedule -> assign(socket, :schedule, Map.put(socket.assigns.schedule, first, schedule))
      end
    else
      [cache_first, cache_second] =
        [first, second] |> Enum.map(&handle_cache_data(user_id, "#{&1}-schedule"))

      socket =
        case cache_first do
          :load ->
            load_schedule(socket, first)

          schedule ->
            assign(socket, :schedule, socket.assigns.schedule |> Map.put_new(first, schedule))
        end

      case cache_second do
        :load ->
          load_schedule(socket, second)

        schedule ->
          assign(
            socket,
            :schedule,
            socket.assigns.schedule |> Map.put_new(second, schedule)
          )
      end
    end
  end

  defp get_events_inside_period(schedule, period) do
    get_events_inside_day(schedule, period.date)
    |> Enum.filter(&(&1 |> Map.get(:number) == period.number))
  end

  defp get_events_inside_day(schedule, date) do
    [year, month, day] = date |> String.split("-")

    case schedule[
           "#{year}-#{month}"
         ][
           "#{day}" |> String.to_integer()
         ] do
      nil ->
        []

      events ->
        events
    end
  end

  defp event_inside_period?(schedule, period) do
    [year, month, day] = period.date |> String.split("-")
    period_number = period.number

    case schedule["#{year}-#{month}"][day |> String.to_integer()] do
      nil ->
        false

      events ->
        events |> Enum.any?(&(&1 |> Map.get(:number) |> Kernel.==(period_number)))
    end
  end

  defp not_within_range?(current_time, time_range) do
    [time_from, time_to] = time_range

    compare_from = Timex.compare(current_time, time_from)
    compare_to = Timex.compare(current_time, time_to)
    compare_from < 0 and compare_to > 0
  end

  def calculate_timeline_percentage(current_time, time_from, time_to) do
    time_from = Timex.parse!(time_from, "{h24}:{m}")
    time_to = Timex.parse!(time_to, "{h24}:{m}")
    current_time = Timex.parse!(current_time, "{h24}:{m}")

    if not_within_range?(current_time, [time_from, time_to]) do
      0
    else
      total_seconds = Timex.diff(time_from, time_to, :seconds)
      elapsed_seconds = Timex.diff(current_time, time_from, :seconds)

      percentage =
        (abs(elapsed_seconds / total_seconds) * 100 * 100)
        |> round()

      percentage / 100 - 0.5
    end
  end

  def fetch_calendar_data(cal_id, date_from, date_to) do
    SnakeArgs.from_params(:calendar_handler, :get_google_calendar_events, [cal_id, date_from, date_to])|>python!(:infinity)
  end

  def fetch_timetable(token, monday) do
    SnakeArgs.from_params(:overview, :handle_overview_timetable, [token, monday])|>python!(:infinity)
  end

  def get_indicator_position(timetable) do
    current_time = warsaw_now() |> Calendar.strftime("%H:%M")
    last = timetable |> hd() |> List.last()
    date_from = timetable |> List.flatten() |> Enum.at(0, %{}) |> Map.get(:date_from)
    date_to = last.date_to

    case calculate_timeline_percentage(current_time, date_from, date_to) do
      0 -> "visibility: hidden;"
      percentage -> "top: #{percentage}%;"
    end
  end

  def calculate_minute_difference(time_from_str, time_to_str) do
    if time_to_str == nil or time_from_str == nil or time_from_str == :undefined or
         time_to_str == "undefined" do
      0
    else
      [hours_from, minutes_from] =
        String.split(time_from_str, ":") |> Enum.map(&String.to_integer/1)

      [hours_to, minutes_to] = String.split(time_to_str, ":") |> Enum.map(&String.to_integer/1)

      total_minutes_from = hours_from * 60 + minutes_from
      total_minutes_to = hours_to * 60 + minutes_to
      total_minutes_to - total_minutes_from
    end
  end

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, schedule, @asyncs) do
        {:ok, schedule} ->
          cache_and_ttl_data(user_id, "#{year}-#{month}-schedule", schedule, 15)

          assign(
            socket,
            :schedule,
            Map.put(socket.assigns.schedule, "#{year}-#{month}", schedule)
          )

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:get_indicator, {:ok, indicator}, socket) do
    {:noreply, assign(socket, :indicator, indicator)}
  end

  def handle_async(:load_calendar_data, {:ok, events}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case events do
        %{:error => msg} ->
          Logger.error("calendar events: #{msg}")
          socket

        events ->
          cache_and_ttl_data(
            user_id,
            "#{socket.assigns.current_monday}-timetable_calendar",
            events
          )

          socket |> assign(:calendar_events, events)
      end

    {:noreply, socket}
  end

  def handle_async(:load_timetable, {:ok, timetable}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, timetable, @asyncs) do
        {:ok, t} ->
          if socket.assigns.current_monday == socket.assigns.this_monday do
            cache_and_ttl_data(user_id, "timetable", t, 30)
          else
            cache_and_ttl_data(
              user_id,
              "#{socket.assigns.current_monday |> Date.to_iso8601()}-timetable",
              t
            )
          end

          socket
          |> assign(:timetable, exclude_empty_days(t))
          |> assign(:loadings, socket.assigns.loadings |> List.delete(:timetable))
          |> start_async(:get_indicator, fn -> get_indicator_position(t) end)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("change_week", %{"days" => days}, socket) do
    current_monday = socket.assigns.current_monday |> Date.add(days |> String.to_integer())
    user_id = socket.assigns.user_id
    calendar_id = socket.assigns.calendar_id
    token = socket.assigns.token
    socket = socket |> assign(:current_monday, current_monday) |> assign(:timetable, [])

    timetable =
      if current_monday == socket.assigns.this_monday do
        handle_cache_data(user_id, "timetable")
      else
        handle_cache_data(
          user_id,
          "#{current_monday |> Date.to_iso8601()}-timetable"
        )
      end

    calendar_data =
      handle_cache_data(
        user_id,
        "#{current_monday |> Date.to_iso8601()}-timetable_calendar"
      )

    socket =
      cond do
        calendar_data == :load and calendar_id != "" ->
          start_async(socket, :load_calendar_data, fn ->
            fetch_calendar_data(
              calendar_id,
              current_monday |> to_string(),
              current_monday |> Date.add(7) |> to_string()
            )
          end)

        calendar_data == :load ->
          socket

        true ->
          assign(socket, :calendar_events, calendar_data)
      end

    socket =
      case timetable do
        :load ->
          socket
          |> assign(:loadings, [:timetable | socket.assigns.loadings])
          |> start_async(:load_timetable, fn ->
            fetch_timetable(token, current_monday |> to_string())
          end)

        timetable ->
          assign(socket, :timetable, exclude_empty_days(timetable))
          |> start_async(:get_indicator, fn -> get_indicator_position(timetable) end)
      end

    {:noreply, socket |> fetch_schedule(current_monday)}
  end

  def handle_event(
        "connect_calendar",
        %{"calendar_id" => calendar_id},
        socket
      ) do
    current_monday = socket.assigns.current_monday
    end_of_week = Date.add(current_monday, 7)

    socket =
      socket
      |> assign(:calendar_id, calendar_id)
      |> start_async(:load_calendar_data, fn ->
        fetch_calendar_data(
          calendar_id,
          current_monday |> to_string(),
          end_of_week |> to_string()
        )
      end)

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"calendar_id" => calendar_id}, socket) do
    socket =
      socket
      |> assign(:calendar_id, calendar_id)

    handle_event("connect_calendar", %{"calendar_id" => calendar_id}, socket)
  end

  def mount(
        _params,
        %{"semester" => semester, "token" => token, "user_id" => user_id},
        socket
      ) do
    token = handle_api_token(socket, token)
    monday = this_weeks_monday()

    socket =
      socket
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:token, token)
      |> assign(:this_monday, monday)
      |> assign(:current_monday, monday)
      |> assign(:indicator, "hidden")
      |> assign(:timetable, [])
      |> assign(:loadings, [])
      |> assign(:show_period_modal, false)
      |> assign(:calendar_events, %{})
      |> assign(:calendar_id, "")
      |> assign(:page_title, "Timetable")
      |> fetch_schedule(monday)

    timetable = handle_cache_data(user_id, "timetable")

    calendar_data =
      handle_cache_data(
        user_id,
        "#{monday |> Date.to_iso8601()}-timetable_calendar"
      )

    socket =
      case calendar_data do
        :load ->
          socket

        cal_data ->
          assign(socket, :calendar_events, cal_data)
      end

    socket =
      case timetable do
        :load ->
          socket
          |> assign(:loadings, [:timetable | socket.assigns.loadings])
          |> start_async(:load_timetable, fn ->
            fetch_timetable(token, monday |> to_string())
          end)

        tt ->
          socket
          |> assign(:timetable, exclude_empty_days(tt))
          |> start_async(:get_indicator, fn -> get_indicator_position(tt) end)
      end

    {:ok, socket}
  end
end
