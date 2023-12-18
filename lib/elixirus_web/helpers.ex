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
end
