defmodule Elixirus.Python.SnakeWrapper do
  alias Elixirus.Python.SnakeManager

  @doc """
  Call python GenServer
  """

  def python(module, func, args) do
    GenServer.call(SnakeManager, {:run, module, func, args})
  end
end
