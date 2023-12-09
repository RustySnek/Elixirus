defmodule ElixirusWeb.StudentLive.Timetable do
  use ElixirusWeb, :live_view

  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal

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

  def warsaw_now() do
    timezone = "Europe/Warsaw"
    DateTime.now!(timezone)
  end

  def this_weeks_monday() do
    warsaw_now() |> Date.beginning_of_week()
  end

  def fetch_timetable(token, monday) do
    python(:overview, :handle_overview_timetable, [token, monday])
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

  def handle_async(:load_timetable, {:ok, timetable}, socket) do
    socket =
      case timetable do
        {:ok, t} ->
          current_time = warsaw_now() |> Calendar.strftime("%H:%M")
          last = t |> hd() |> List.last()
          date_from = Map.get(t |> hd() |> hd(), ~c"date_from") |> to_string()
          date_to = Map.get(last, ~c"date_to") |> to_string()

          indicator =
            case calculate_timeline_percentage(current_time, date_from, date_to) do
              0 -> "visibility: hidden;"
              percentage -> "top: #{percentage}%;"
            end

          # do an async for indicator
          socket
          |> assign(:timetable, t)
          |> assign(:indicator, indicator)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_event("navigate_students", %{"token" => token}, socket) do
    socket =
      socket
      |> assign(:token, token)
      |> assign(:login_required, false)

    socket =
      socket
      |> start_async(:load_timetable, fn ->
        fetch_timetable(token, this_weeks_monday() |> to_string())
      end)

    {:noreply, socket}
  end

  def mount(_params, %{"semester" => semester, "api_token" => api_token}, socket) do
    api_token =
      case api_token |> Map.keys() do
        [] -> ""
        token -> token |> hd() |> to_charlist()
      end

    monday = this_weeks_monday()

    socket =
      socket
      |> assign(:login_required, false)
      |> assign(:semester, semester)
      |> assign(:api_token, api_token)
      |> assign(:this_monday, monday)
      |> assign(:indicator, "hidden")
      |> assign(:timetable, [])

    socket =
      socket
      |> start_async(:load_timetable, fn ->
        fetch_timetable(api_token, monday |> to_string())
      end)

    {:ok, socket}
  end
end
