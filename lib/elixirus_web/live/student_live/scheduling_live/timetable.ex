defmodule ElixirusWeb.StudentLive.SchedulingLive.Timetable do
  require Logger
  alias Elixirus.Types.Event
  alias Elixirus.Types.Period
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view
  import Venomous
  alias Venomous.SnakeArgs

  alias ElixirusWeb.Modal
  import ElixirusWeb.Helpers

  use ElixirusWeb.SetSemesterLive
  import Heroicons, only: [chevron_right: 1, chevron_left: 1, information_circle: 1]
  @asyncs [:load_schedule, :load_timetable]

  defp weekday_scroll_left() do
    case get_current_weekday() do
      n when n < 5 -> n * 270
      _ -> 0
    end
  end

  defp current_next_period(timetable) do
    case Enum.at(timetable, get_current_weekday()) |> get_next_period() do
      [%Period{number: num} | _rest] ->
        num

      _ ->
        0
    end
  end

  defp exclude_empty_days(timetable) do
    timetable
    |> Enum.filter(fn weekday ->
      Enum.any?(weekday, fn period ->
        period.subject |> Kernel.!=("")
      end)
    end)
  end

  defp format_date(date) do
    date
    |> Date.to_iso8601()
    |> String.split("-")
    |> Enum.slice(0..1)
    |> Enum.join("-")
  end

  defp load_schedule(socket, date, :load), do: load_schedule(socket, date)

  defp load_schedule(socket, date, schedule) do
    schedules = socket.assigns.schedule
    assign(socket, :schedule, Map.put_new(schedules, date, schedule))
  end

  defp load_schedule(socket, month_year) do
    client = socket.assigns.client
    [year, month] = month_year |> String.split("-")

    start_async(socket, :load_schedule, fn ->
      {SnakeArgs.from_params(:elixirus, :schedule, [client, year, month])
       |> python!(python_timeout: 20_000), year, month}
    end)
  end

  defp fetch_schedule(socket, monday) do
    socket = assign(socket, :schedule, %{})
    user_id = socket.assigns.user_id

    [first, second] =
      [monday, Date.add(monday, 6)]
      |> Enum.map(&format_date/1)

    if first == second do
      schedule = handle_cache_data(user_id, "#{first}-schedule")
      load_schedule(socket, first, schedule)
    else
      [cache_first, cache_second] =
        [first, second] |> Enum.map(&handle_cache_data(user_id, "#{&1}-schedule"))

      socket
      |> load_schedule(first, cache_first)
      |> load_schedule(second, cache_second)
    end
  end

  defp get_events_inside_period(schedule, period) do
    get_events_inside_day(schedule, period.date)
    |> Enum.filter(&(&1 |> Map.get(:number) == period.number))
  end

  defp get_events_inside_day(schedule, [year, month, day]) do
    schedule
    |> Map.get(year <> month, [])
    |> Enum.at(String.to_integer(day), [])
  end

  defp get_events_inside_day(schedule, date),
    do: get_events_inside_day(schedule, String.split(date, "-"))

  defp event_inside_period?(schedule, %Period{date: date, number: number}) do
    case get_events_inside_day(schedule, date) do
      [] ->
        false

      events ->
        events |> Enum.any?(&(&1 |> Map.get(:number) |> Kernel.==(number)))
    end
  end

  defp not_within_range?(current_time, time_range) do
    [time_from, time_to] = time_range

    compare_from = DateTime.compare(current_time, time_from)
    compare_to = DateTime.compare(current_time, time_to)
    compare_from < 0 and compare_to > 0
  end

  def calculate_timeline_percentage(time_from, time_to) do
    [from_hour, from_minute] =
      time_from
      |> String.split(":")
      |> Enum.map(&String.to_integer(&1))

    [to_hour, to_minute] =
      time_to
      |> String.split(":")
      |> Enum.map(&String.to_integer(&1))

    current_time = warsaw_now()
    time_from = %DateTime{current_time | hour: from_hour, minute: from_minute, second: 0}
    time_to = %DateTime{current_time | hour: to_hour, minute: to_minute, second: 0}

    if not_within_range?(current_time, [time_from, time_to]) do
      0
    else
      total_seconds =
        DateTime.diff(time_to, time_from, :second)
        |> abs()

      elapsed_seconds =
        DateTime.diff(current_time, time_from, :second)
        |> abs()

      elapsed_seconds =
        if elapsed_seconds > total_seconds, do: total_seconds, else: elapsed_seconds

      percentage =
        (elapsed_seconds / total_seconds * 100)
        |> round()

      percentage - 0.5
    end
  end

  defp load_calendar(socket, :load), do: socket

  defp load_calendar(socket, calendar_data),
    do: assign(socket, :calendar_events, calendar_data)

  defp load_calendar(socket, load, ""), do: load_calendar(socket, load)

  defp load_calendar(socket, :load, calendar_id) do
    monday = socket.assigns.current_monday

    start_async(socket, :load_calendar_data, fn ->
      fetch_calendar_data(
        calendar_id,
        monday |> to_string(),
        monday |> Date.add(7) |> to_string()
      )
    end)
  end

  defp load_calendar(socket, data, _calendar_id), do: load_calendar(socket, data)

  defp fetch_calendar_data(cal_id, date_from, date_to) do
    SnakeArgs.from_params(
      :calendar_handler,
      :get_google_calendar_events,
      [
        cal_id,
        date_from,
        date_to
      ]
    )
    |> python!(python_timeout: 20_000)
  end

  defp load_timetable(socket, :load) do
    monday = socket.assigns.current_monday
    client = socket.assigns.client

    socket
    |> assign(:loadings, [:timetable | socket.assigns.loadings])
    |> start_async(:load_timetable, fn ->
      SnakeArgs.from_params(:elixirus, :timetable, [client, monday |> to_string()])
      |> python!(python_timeout: 20_000)
    end)
  end

  defp load_timetable(socket, timetable) do
    socket
    |> assign(:timetable, exclude_empty_days(timetable))
    |> assign_async(:indicator, fn ->
      {:ok, %{indicator: get_indicator_position(timetable)}}
    end)
  end

  def get_indicator_position([timetable | _rest]) do
    %Period{date_from: date_from} = hd(timetable)
    %Period{date_to: date_to} = List.last(timetable)

    case calculate_timeline_percentage(date_from, date_to) do
      0 -> "visibility: hidden;"
      percentage -> "top: #{percentage}%;"
    end
  end

  def calculate_minute_difference(time_from_str, time_to_str)
      when is_nil(time_from_str) or is_nil(time_to_str),
      do: 0

  def calculate_minute_difference(time_from_str, time_to_str) do
    if to_string(time_from_str) == "undefined" or to_string(time_to_str) == "undefined" do
      0
    else
      [hours_from, minutes_from] =
        time_from_str
        |> String.split(":")
        |> Enum.map(&String.to_integer/1)

      [hours_to, minutes_to] =
        time_to_str
        |> String.split(":")
        |> Enum.map(&String.to_integer/1)

      total_minutes_from = hours_from * 60 + minutes_from
      total_minutes_to = hours_to * 60 + minutes_to
      total_minutes_to - total_minutes_from
    end
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

  def handle_async(:load_calendar_data, {:ok, events}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case events do
        {:error, msg} ->
          Logger.error("calendar events: #{inspect(msg)}")
          put_flash(socket, :error, "Error in loading calendar")

        events ->
          cache_and_ttl_data(
            user_id,
            Date.to_iso8601(socket.assigns.current_monday) <> "-timetable_calendar",
            events
          )

          assign(socket, :calendar_events, events)
      end

    {:noreply, socket}
  end

  def handle_async(:load_timetable, {:ok, timetable}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, timetable, @asyncs) do
        {:ok, timetable} ->
          if socket.assigns.current_monday == socket.assigns.this_monday do
            cache_and_ttl_data(user_id, "timetable", timetable, 30)
          else
            cache_and_ttl_data(
              user_id,
              Date.to_iso8601(socket.assigns.current_monday) <> "-timetable",
              timetable
            )
          end

          socket
          |> assign(:timetable, exclude_empty_days(timetable))
          |> assign(:loadings, List.delete(socket.assigns.loadings, :timetable))
          |> assign_async(:indicator, fn ->
            {:ok, %{indicator: get_indicator_position(timetable)}}
          end)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("change_week", %{"days" => days}, socket) do
    current_monday =
      socket.assigns.current_monday
      |> Date.add(String.to_integer(days))

    user_id = socket.assigns.user_id
    calendar_id = socket.assigns.calendar_id

    timetable =
      if current_monday == socket.assigns.this_monday do
        handle_cache_data(user_id, "timetable")
      else
        handle_cache_data(
          user_id,
          Date.to_iso8601(current_monday) <> "-timetable"
        )
      end

    calendar_data =
      handle_cache_data(
        user_id,
        Date.to_iso8601(current_monday) <> "-timetable_calendar"
      )

    socket =
      socket
      |> assign(:current_monday, current_monday)
      |> assign(:timetable, [])
      |> load_calendar(calendar_data, calendar_id)
      |> load_timetable(timetable)
      |> fetch_schedule(current_monday)

    {:noreply, socket}
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
    %Client{} = client = Client.get_client(token)
    monday = this_weeks_monday()

    timetable = handle_cache_data(user_id, "timetable")

    calendar_data =
      handle_cache_data(
        user_id,
        "#{monday |> Date.to_iso8601()}-timetable_calendar"
      )

    socket =
      socket
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:this_monday, monday)
      |> assign(:current_monday, monday)
      |> assign(:client, client)
      |> assign(:indicator, "hidden")
      |> assign(:timetable, [])
      |> assign(:loadings, [])
      |> assign(:show_period_modal, false)
      |> assign(:calendar_events, %{})
      |> assign(:calendar_id, "")
      |> assign(:page_title, "Timetable")
      |> fetch_schedule(monday)
      |> load_calendar(calendar_data)
      |> load_timetable(timetable)

    {:ok, socket}
  end
end
