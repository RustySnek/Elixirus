# A.K.A. snake worker 🔨🐍
defmodule Elixirus.Python.PythonWorker do
  use GenServer
  require Logger

  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_) do
    Logger.warning("Started python worker")

    case :python.start() do
      {:error, reason} ->
        Logger.error(reason)
        :timer.sleep(10_000)
        {:error, :rip_python}

      {:ok, pid} ->
        {:ok, pid, {:continue, :init_data_types}}
    end
  end

  def handle_continue(:init_data_types, pid) do
    :python.call(pid, :helpers, :setup_data_types, [])
    {:noreply, pid}
  end

  def handle_call({:run, module, func, args}, _from, pid) do
    response = :python.call(pid, module, func, args)
    {:reply, response, pid}
  end
end
