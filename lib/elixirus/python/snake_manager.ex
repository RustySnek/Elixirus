defmodule Elixirus.Python.SnakeManager do
  @moduledoc """
  Manager for brave 🐍 workers
  """
  use GenServer
  require Logger
  alias Elixirus.Python.SnakeSupervisor

  def start_link(_) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    Logger.info("Initialized snake manager")
    send(self(), :clean_inactive_workers)
    {:ok, state}
  end

  def handle_call({:run, module, func, args}, _from, state) do
    case find_ready_worker() do
      {:ok, pid} ->
        {:reply, GenServer.call(pid, {:run, module, func, args}, :infinity), state}

      :none_available ->
        {:ok, pid} = SnakeSupervisor.deploy_snake_worker()
        {:reply, GenServer.call(pid, {:run, module, func, args}, :infinity), state}
    end
  end

  def handle_info(:clean_inactive_workers, state) do
    clean_inactive_workers()
    Process.send_after(self(), :clean_inactive_workers, 10_000 * 60)
    {:noreply, state}
  end

  def handle_info({:sacrifice_snake, pid}, state) do
    DynamicSupervisor.terminate_child(SnakeSupervisor, pid)
    {:noreply, state}
  end

  defp _kill_inactive_worker(pid) do
    GenServer.call(pid, :kill_snake)
    DynamicSupervisor.terminate_child(SnakeSupervisor, pid)
    Logger.info("Cleared unused snake")
  end

  defp clean_inactive_workers({:busy, _update}, _pid), do: nil
  defp clean_inactive_workers({:dead, _update}, pid), do: _kill_inactive_worker(pid)

  defp clean_inactive_workers({:ready, update}, pid) do
    now = DateTime.now!("Europe/Warsaw")

    unless DateTime.compare(now, Timex.shift(update, minutes: 15)) != :gt do
      _kill_inactive_worker(pid)
    end
  end

  defp clean_inactive_workers() do
    pids = DynamicSupervisor.which_children(SnakeSupervisor)

    Enum.each(pids, fn {_id, pid, _type, _modules} ->
      clean_inactive_workers(GenServer.call(pid, :status, :infinity), pid)
    end)
  end

  defp find_ready_worker() do
    pids = DynamicSupervisor.which_children(SnakeSupervisor)

    Enum.find_value(pids, :none_available, fn {_id, pid, _type, _modules} ->
      case GenServer.call(pid, :status, :infinity) do
        {:ready, _} ->
          {:ok, pid}

        _ ->
          nil
      end
    end)
  end
end
