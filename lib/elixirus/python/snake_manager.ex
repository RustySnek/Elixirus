defmodule Elixirus.Python.SnakeManager do
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
        {:reply, GenServer.call(pid, {:run, module, func, args}), state}

      :none_available ->
        {:ok, pid} = SnakeSupervisor.deploy_snake_worker()
        {:reply, GenServer.call(pid, {:run, module, func, args}), state}
    end
  end

  def handle_info(:clean_inactive_workers, state) do
    clean_inactive_workers()
    Process.send_after(self(), :clean_inactive_workers, 10_000 * 60)
    {:noreply, state}
  end

  defp clean_inactive_workers() do
    pids = DynamicSupervisor.which_children(SnakeSupervisor)
    now = DateTime.now!("Europe/Warsaw")

    Enum.each(pids, fn {_id, pid, _type, _modules} ->
      case GenServer.call(pid, :status) do
        {:busy, _} ->
          nil

        {_state, update} ->
          if DateTime.compare(now, Timex.shift(update, minutes: 15)) == :gt do
            GenServer.cast(pid, :kill_snake)
            DynamicSupervisor.terminate_child(SnakeSupervisor, pid)
            Logger.info("Cleared unused snake")
          end
      end
    end)
  end

  defp find_ready_worker() do
    pids = DynamicSupervisor.which_children(SnakeSupervisor)

    Enum.find_value(pids, :none_available, fn {_id, pid, _type, _modules} ->
      case GenServer.call(pid, :status) do
        {:ready, _} ->
          {:ok, pid}

        _ ->
          nil
      end
    end)
  end
end
