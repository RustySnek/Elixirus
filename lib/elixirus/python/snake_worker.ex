# A.K.A. snake worker 🔨🐍
defmodule Elixirus.Python.SnakeWorker do
  use GenServer
  require Logger

  def start_link(args) do
    GenServer.start_link(__MODULE__, args)
  end

  def init(_) do
    Logger.info("Started python worker")

    case :python.start() do
      {:error, reason} ->
        Logger.error(reason)

        Process.flag(:trap_exit, true)
        {:error, :rip_python}

      {:ok, pid} ->
        {:ok, set_state(pid, :busy), {:continue, :init_data_types}}
    end
  end

  def handle_continue(:init_data_types, state) do
    :python.call(state.pid, :helpers, :setup_data_types, [])
    Process.flag(:trap_exit, true)
    {:noreply, set_state(state.pid, :ready)}
  end

  def handle_cast({:set_state, new_state}, state) do
    {:noreply, set_state(state.pid, new_state)}
  end

  def handle_call({:run, module, func, args}, _from, state) do
    GenServer.cast(self(), {:set_state, :busy})
    response = :python.call(state.pid, module, func, args)
    GenServer.cast(self(), {:set_state, :ready})
    {:reply, response, state}
  end

  def handle_call(:status, _from, state) do
    {:reply, {state.state, state.update}, state}
  end

  def handle_info({:EXIT, pid, reason}, state) do
    GenServer.cast(pid, {:set_state, :dead})
    Logger.error(reason)
    :timer.sleep(5_000)
    {:stop, reason, state}
  end

  defp set_state(pid, state) do
    update = DateTime.now!("Europe/Warsaw")
    %{pid: pid, state: state, update: update}
  end
end
