defmodule ElixirusWeb.Helpers do
  def stringify_value(data, charlist_key) do
    data |> Map.get(charlist_key) |> to_string()
  end

  def attendance_color(symbol) do
    case symbol do
      "nb" -> "red-500"
      "u" -> "fuchsia-600"
      "sp" -> "amber-600"
      "zw" -> "zinc-700"
      "ob" -> "cyan-500"
      _ -> "fuchsia-600"
    end
  end

  def count_average(grades) do
    if grades == [] do
      0
    else
      {avg, divisor} =
        grades
        |> Enum.reduce({0, 1}, fn grade, {acc, divisor} ->
          weight = stringify_value(grade, ~c"weight") |> String.to_integer()

          if grade |> Map.get(~c"counts") == true do
            {grade
             |> stringify_value(~c"value")
             |> String.to_float()
             |> Kernel.*(weight)
             |> Kernel.+(acc), divisor + weight}
          else
            {acc, divisor}
          end
        end)

      if divisor == 1 do
        0.0
      else
        avg
        |> Kernel./(divisor - 1)
      end
    end
  end

  def switch_integer(val) do
    case val do
      0 -> 1
      1 -> 0
      _ -> 0
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

  def inside_event_timeframe?(events, date) do
    events
    |> events_inside_timeframe(date)
    |> Kernel.!=([])
  end

  # def inside_event_timeframe?(events, date, time_from, time_to) do
  # case events |> 
  #    Enum.filter(
  #   fn key, _val -> inside_timeframe?(date, key) == true end
  # ) do
  #   [] -> false
  #   events -> Enum.filter(
  #   fn _, val -> inside_hour_timeframe?(time_from, time_to, val |> stringify_value(~c"time_from"))
  # )
  # end
  # end
  def warsaw_now() do
    timezone = "Europe/Warsaw"
    DateTime.now!(timezone)
  end

  def this_weeks_monday(date \\ warsaw_now()) do
    date |> Date.beginning_of_week()
  end

  def handle_api_token(socket, token) do
    case token |> Map.keys() do
      [] ->
        case Map.get(socket.assigns, :token) do
          nil -> ""
          token -> token
        end

      token ->
        token |> hd() |> to_charlist()
    end
  end

  def cache_and_ttl_data(user_id, cache_type, data) do
    Cachex.put(:elixirus_cache, user_id <> cache_type, data)
    Cachex.expire(:elixirus_cache, user_id <> cache_type, :timer.minutes(5))
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
end
