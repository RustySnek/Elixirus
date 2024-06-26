defmodule ElixirusWeb.Helpers do
  @moduledoc """
  Miscellanous functions to help parse data
  """
  use Phoenix.LiveView
  require Logger

  def match_basic_errors(socket, %{:token_error => message}, asyncs) do
    socket =
      Enum.reduce(asyncs, socket, fn loading, socket_acc ->
        cancel_async(socket_acc, loading, :error)
      end)
      |> assign(:login_required, true)
      |> push_event("require-login", %{})

    {:token_error, message, socket}
  end

  def match_basic_errors(socket, %{:error => message}, _asyncs) do
    Logger.error(message)
    put_flash(socket, :error, message)

    {:error, message, socket}
  end

  def match_basic_errors(_socket, any, _asyncs) do
    any
  end

  def sort_gpas(gpas) do
    Enum.sort_by(gpas, fn {_, [_, _, gpa]} ->
      if gpa == "-", do: 99.0, else: gpa |> String.to_float()
    end)
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

  defp _average_divisor_of_grades(grades) do
    grades
    |> Enum.reduce({0, 1}, fn grade, {acc, divisor} ->
      weight = grade.weight

      if grade.counts == true do
        {grade
         |> Map.get(:value)
         |> Kernel.*(weight)
         |> Kernel.+(acc), divisor + weight}
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

  def create_fetcher(socket, cache_data, name, load_func) do
    case cache_data do
      :load ->
        socket
        |> assign(:loadings, [name | socket.assigns.loadings])
        |> start_async(:"load_#{name}", load_func)

      data ->
        assign(socket, name, data)
    end
  end
end
