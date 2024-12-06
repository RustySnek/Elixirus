defmodule ElixirusWeb.Helpers do
  @moduledoc """
  Miscellanous functions to help parse data
  """
  alias Elixirus.Types.Grade
  alias ElixirusWeb.LoginForm
  alias Elixirus.Types.Period
  alias Elixirus.Healthcheck.Healthcheck
  alias Elixirus.Healthcheck.Services

  use Phoenix.LiveView
  require Logger

  def iso_date_to_dayname(date_str) do
    {:ok, date} = Date.from_iso8601(date_str)

    day_of_week = Date.day_of_week(date)

    case day_of_week do
      1 -> "Monday"
      2 -> "Tuesday"
      3 -> "Wednesday"
      4 -> "Thursday"
      5 -> "Friday"
      6 -> "Saturday"
      7 -> "Sunday"
      _ -> nil
    end
  end

  def get_current_weekday(date \\ Date.utc_today()) do
    date
    |> Date.day_of_week()
    |> Kernel.-(1)
  end

  def get_next_period(periods, now \\ warsaw_now())
  def get_next_period(nil, _now), do: 0

  def get_next_period(periods, %DateTime{} = now) do
    Enum.filter(periods, fn %Period{date_from: date_from} ->
      [hour, minute] = String.split(date_from, ":")

      period_datetime_from =
        %{
          now
          | hour: String.to_integer(hour),
            minute: String.to_integer(minute)
        }

      DateTime.compare(period_datetime_from, now) == :gt
    end)
  end

  def next_timetable_events_today(timetable, %DateTime{} = now \\ warsaw_now()) do
    timetable
    |> Enum.at(get_current_weekday(now))
    |> get_next_period(now)
  end

  def nonempty_periods(periods) do
    Enum.reject(periods, fn %Period{subject: subject} -> subject == "" end)
  end

  def match_basic_errors(socket, {:token_error, message}, asyncs) do
    socket =
      Enum.reduce(asyncs, socket, fn loading, socket_acc ->
        cancel_async(socket_acc, loading, :error)
      end)
      |> LoginForm.require_login()

    {:token_error, message, socket}
  end

  def match_basic_errors(socket, {:error, :timeout}, _asyncs) do
    status = Healthcheck.get_service_status(Services.LibrusConnection)
    proxy = System.get_env("USE_PROXY", "no")
    Logger.error("Librus connection on timing out: #{status} | proxy after refresh: #{proxy}")

    {:error, "Timed out. Librus status: #{status}. Try refreshing...",
     put_flash(socket, :error, "Timed out. Librus status: #{status}. Try refreshing...")}
  end

  def match_basic_errors(socket, {:error, message}, _asyncs) do
    Logger.error(message)
    {:error, message, put_flash(socket, :error, message)}
  end

  def match_basic_errors(socket, %Venomous.SnakeError{} = err, _asyncs) do
    Logger.error(inspect(err))
    {:error, err, put_flash(socket, :error, "Internal Server Error")}
  end

  def match_basic_errors(socket, {:killed, reason}, _asyncs), do: {:error, reason, socket}

  def match_basic_errors(_socket, any, _asyncs) do
    any
  end

  def sort_gpas(gpas) do
    Enum.sort_by(gpas, fn {_, [_, _, gpa]} ->
      if gpa == "-", do: 99.0, else: gpa
    end)
  end

  def attendance_color(symbol) do
    case symbol do
      "nb" -> "red-500"
      "u" -> "lime-600"
      "sp" -> "amber-600"
      "zw" -> "zinc-700"
      "ob" -> "cyan-500"
      _ -> "fuchsia-600"
    end
  end

  defp _average_divisor_of_grades(grades) do
    grades
    |> Enum.reduce({0, 1}, fn %Grade{weight: weight, counts: counts, value: value},
                              {acc, divisor} ->
      if counts == true do
        {
          value
          |> Kernel.*(weight)
          |> Kernel.+(acc),
          divisor + weight
        }
      else
        {acc, divisor}
      end
    end)
  end

  def count_average(grades) do
    if grades == [] do
      0
    else
      {avg, divisor} = _average_divisor_of_grades(grades)

      if divisor == 1 do
        0.0
      else
        avg
        |> Kernel./(divisor - 1)
      end
    end
  end

  defp inside_timeframe?(date, event_timeframe) do
    [event_from, event_to] =
      String.split(event_timeframe |> to_string(), "|")
      |> Enum.map(fn frame -> Date.from_iso8601!(frame) end)

    date = Date.from_iso8601!(date)

    case Date.compare(date, event_from) do
      :lt ->
        false

      _ ->
        case Date.compare(date, event_to) do
          :gt -> false
          _ -> true
        end
    end
  end

  def events_inside_timeframe(events, date) do
    events
    |> Map.filter(fn {key, _val} ->
      inside_timeframe?(date, key) == true
    end)
    |> Map.values()
    |> List.flatten()
  end

  def warsaw_now() do
    timezone = "Europe/Warsaw"
    DateTime.now!(timezone)
  end

  defdelegate this_weeks_monday(date \\ warsaw_now()), to: Date, as: :beginning_of_week

  def handle_api_token(socket, token) do
    case token |> Map.keys() do
      [] ->
        case Map.get(socket.assigns, :token) do
          nil -> ""
          token -> token
        end

      token ->
        token |> hd() |> to_string()
    end
  end

  def cache_and_ttl_data(user_id, cache_type, data, expiry_time \\ 5) do
    Cachex.put(:elixirus_cache, user_id <> cache_type, data)
    Cachex.expire(:elixirus_cache, user_id <> cache_type, :timer.minutes(expiry_time))
  end

  def handle_cache_data(user_id, cache_type) do
    Cachex.purge(:elixirus_cache)

    case Cachex.ttl(:elixirus_cache, user_id <> cache_type) do
      {:ok, nil} ->
        :load

      {:ok, _} ->
        case Cachex.get(:elixirus_cache, user_id <> cache_type) do
          {:ok, nil} -> :load
          {:ok, data} -> data
          _ -> :load
        end

      _ ->
        :load
    end
  end

  def percentage_to_deg(percentage) do
    "#{percentage * 3.6}deg"
  end

  def create_fetcher(socket, user_id, cache_data, name, load_func) do
    case cache_data do
      :load ->
        case Hammer.check_rate("#{name}:#{user_id}", 60_000, 10) do
          {:allow, _count} ->
            socket
            |> assign(:loadings, [name | socket.assigns.loadings])
            |> start_async(:"load_#{name}", load_func)

          {:deny, _limit} ->
            socket |> put_flash(:error, "Rate limit exceeded!")
        end

      data ->
        assign(socket, name, data)
    end
  end

  def date_to_shorthand(date) do
    [_year, month, day] = String.split(date, "-")

    "#{day} #{month_to_shorthand(String.to_integer(month))}"
  end

  def month_to_shorthand(month) do
    case month do
      1 -> "Jan"
      2 -> "Feb"
      3 -> "Mar"
      4 -> "Apr"
      5 -> "May"
      6 -> "Jun"
      7 -> "Jul"
      8 -> "Aug"
      9 -> "Sep"
      10 -> "Oct"
      11 -> "Nov"
      12 -> "Dec"
    end
  end
end
