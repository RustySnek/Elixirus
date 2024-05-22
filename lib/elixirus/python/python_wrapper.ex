defmodule Elixirus.Python.PythonWrapper do
  alias Elixirus.Python.PythonWorker

  @doc """
  Call python GenServer
  """

  def python(module, func, args) do
    GenServer.call(PythonWorker, {:run, module, func, args})
  end
end
