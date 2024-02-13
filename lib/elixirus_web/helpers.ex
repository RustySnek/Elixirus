defmodule ElixirusWeb.Helpers do
  def stringify_value(data, charlist_key) do
    data |> Map.get(charlist_key) |> to_string()
  end

  def warsaw_now() do
    timezone = "Europe/Warsaw"
    DateTime.now!(timezone)
  end

  def this_weeks_monday(date \\ warsaw_now()) do
    date |> Date.beginning_of_week()
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
end
