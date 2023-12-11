defmodule ElixirusWeb.Helpers do
  def stringify_value(data, charlist_key) do
    data |> Map.get(charlist_key) |> to_string()
  end
end
