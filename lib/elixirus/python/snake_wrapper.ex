defmodule Elixirus.Python.SnakeWrapper do
  @moduledoc """
  Wrapper for SnakeManager GenServer to run python functions.
  """
  alias Elixirus.Python.SnakeManager

  @doc """
  Call python GenServer
  """

  def python(module, func, args, timeout \\ 120_000) do
    GenServer.call(SnakeManager, {:run, module, func, args}, timeout)
  end
end
