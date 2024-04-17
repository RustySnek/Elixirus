defmodule ElixirusWeb.StudentLive.SchedulingLive.Timetable do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal
  alias ElixirusWeb.Modal
  import ElixirusWeb.Helpers
  use ElixirusWeb.LoginHandler
  use ElixirusWeb.SetSemesterLive
  import Heroicons, only: [chevron_right: 1, chevron_left: 1]

  defp is_within_range?(current_time, time_range) do
    [time_from, time_to] = time_range

    compare_from = Timex.compare(current_time, time_from)
    compare_to = Timex.compare(current_time, time_to)
    compare_from >= 0 and compare_to <= 0
  end

  def calculate_timeline_percentage(current_time, time_from, time_to) do
    time_from = Timex.parse!(time_from, "{h24}:{m}")
    time_to = Timex.parse!(time_to, "{h24}:{m}")
    current_time = Timex.parse!(current_time, "{h24}:{m}")

    if !is_within_range?(current_time, [time_from, time_to]) do
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
    python(:calendar_handler, :get_google_calendar_events, [cal_id, date_from, date_to])
  end

  def fetch_timetable(token, monday) do
    python(:overview, :handle_overview_timetable, [token, monday])
  end

  def get_indicator_position(timetable) do
    current_time = warsaw_now() |> Calendar.strftime("%H:%M")
    last = timetable |> hd() |> List.last()
    date_from = Map.get(timetable |> hd() |> hd(), ~c"date_from") |> to_string()
    date_to = Map.get(last, ~c"date_to") |> to_string()

    case calculate_timeline_percentage(current_time, date_from, date_to) do
      0 -> "visibility: hidden;"
      percentage -> "top: #{percentage}%;"
    end
  end

  def calculate_minute_difference(time_from_str, time_to_str) do
    if time_to_str == nil or time_from_str == nil or time_from_str == "undefined" or
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

  def handle_async(:get_indicator, {:ok, indicator}, socket) do
    {:noreply, assign(socket, :indicator, indicator)}
  end

  def handle_async(:load_calendar_data, {:ok, events}, socket) do
    cache_and_ttl_data(
      socket.assigns.user_id,
      "#{socket.assigns.current_monday}-timetable_calendar",
      events
    )

    socket = socket |> assign(:calendar_events, events)
    {:noreply, socket}
  end

  def handle_async(:load_timetable, {:ok, timetable}, socket) do
    socket =
      case timetable do
        {:ok, t} ->
          if socket.assigns.current_monday == socket.assigns.this_monday do
            cache_and_ttl_data(socket.assigns.user_id, "timetable", t, 30)
          else
            cache_and_ttl_data(
              socket.assigns.user_id,
              "#{socket.assigns.current_monday |> Date.to_iso8601()}-timetable",
              t
            )
          end

          socket
          |> assign(:timetable, t)
          |> assign(:loadings, socket.assigns.loadings |> List.delete(:timetable))
          |> start_async(:get_indicator, fn -> get_indicator_position(t) end)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_event("change_week", %{"days" => days}, socket) do
    current_monday = socket.assigns.current_monday |> Date.add(days |> String.to_integer())
    socket = socket |> assign(:current_monday, current_monday) |> assign(:timetable, [])

    timetable =
      if current_monday == socket.assigns.this_monday do
        handle_cache_data(socket.assigns.user_id, "timetable")
      else
        handle_cache_data(
          socket.assigns.user_id,
          "#{current_monday |> Date.to_iso8601()}-timetable"
        )
      end

    calendar_data =
      handle_cache_data(
        socket.assigns.user_id,
        "#{socket.assigns.current_monday |> Date.to_iso8601()}-timetable_calendar"
      )

    socket =
      if calendar_data == :load do
        if socket.assigns.calendar_id != "" do
          start_async(socket, :load_calendar_data, fn ->
            fetch_calendar_data(
              socket.assigns.calendar_id,
              current_monday |> to_string(),
              current_monday |> Date.add(7) |> to_string()
            )
          end)
        else
          socket
        end
      else
        assign(socket, :calendar_events, calendar_data)
      end

    socket =
      case timetable do
        :load ->
          socket
          |> assign(:loadings, [:timetable | socket.assigns.loadings])
          |> start_async(:load_timetable, fn ->
            fetch_timetable(socket.assigns.api_token, current_monday |> to_string())
          end)

        timetable ->
          assign(socket, :timetable, timetable)
          |> start_async(:get_indicator, fn -> get_indicator_position(timetable) end)
      end

    {:noreply, socket}
  end

  def handle_event(
        "connect_calendar",
        %{"calendar_id" => calendar_id},
        socket
      ) do
    end_of_week = Date.add(socket.assigns.current_monday, 7)

    socket =
      socket
      |> assign(:calendar_id, calendar_id)
      |> start_async(:load_calendar_data, fn ->
        fetch_calendar_data(
          calendar_id,
          socket.assigns.current_monday |> to_string(),
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
        %{"semester" => semester, "token" => api_token, "user_id" => user_id},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)
    monday = this_weeks_monday()

    socket =
      socket
      |> assign(:login_required, false)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:api_token, api_token)
      |> assign(:this_monday, monday)
      |> assign(:current_monday, monday)
      |> assign(:indicator, "hidden")
      |> assign(:timetable, [])
      |> assign(:loadings, [])
      |> assign(:show_period_modal, false)
      |> assign(:calendar_events, %{})
      |> assign(:calendar_id, "")
      |> assign(:page_title, "Timetable")

    timetable = handle_cache_data(user_id, "timetable")

    calendar_data =
      handle_cache_data(
        user_id,
        "#{socket.assigns.current_monday |> Date.to_iso8601()}-timetable_calendar"
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
            fetch_timetable(api_token, monday |> to_string())
          end)

        tt ->
          socket
          |> assign(:timetable, tt)
          |> start_async(:get_indicator, fn -> get_indicator_position(tt) end)
      end

    {:ok, socket}
  end
end
