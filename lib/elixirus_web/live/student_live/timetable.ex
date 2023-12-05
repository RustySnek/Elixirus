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
      :outside_range
    else
      total_seconds = Timex.diff(time_from, time_to, :seconds)
      elapsed_seconds = Timex.diff(current_time, time_from, :seconds)
      (abs(elapsed_seconds / total_seconds) * 100) |> round()
    end
  end

  def warsaw_now() do
    timezone = "Europe/Warsaw"
    DateTime.now!(timezone)
  end

  def this_weeks_monday() do
    warsaw_now() |> Date.beginning_of_week()
  end

  def fetch_timetable(socket, monday) do
    token = socket.assigns.api_token
    python(:overview, :handle_overview_timetable, [token, monday])
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
            case calculate_timeline_percentage("12:00", date_from, date_to) do
              :outside_range -> "visible: hidden"
              percentage -> "left: #{percentage}%"
            end

          IO.inspect(indicator)

          socket
          |> assign(:timetable, t)
          |> assign(:indicator, indicator)

        _ ->
          assign(socket, :login_required, true)
      end

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
        fetch_timetable(socket, monday |> to_string())
      end)

    {:ok, socket}
  end
end
