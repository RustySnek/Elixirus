defmodule Elixirus.PythonWrapper do
  def python(module, func, args) do
    {:ok, pid} = :python.start()

    run =
      :python.call(pid, module, func, args)

    :python.stop(pid)
    run
  end
end
