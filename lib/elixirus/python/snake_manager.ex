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

  def init(_) do
    Logger.info("Initialized snake manager")

    state = []

    {:ok, state, {:continue, :clean_inactive}}
  end

  def handle_continue(:clean_inactive, state) do
    send(self(), :clean_inactive_workers)
    {:noreply, state}
  end

  def handle_cast({:reply_ready_snake, task}, _state) do
    state = Task.await(task)

    {:noreply, state}
  end

  def handle_call(:get_ready_snake, from, state) do
    task =
      Task.async(fn ->
        case state |> List.first() do
          nil ->
            result = _deploy_new_snake()

            GenServer.reply(from, result)
            state

          pid ->
            {pypid, _update} = GenServer.call(pid, :status)
            GenServer.reply(from, {pid, pypid})
            List.delete(state, pid)
        end
      end)

    GenServer.cast(self(), {:reply_ready_snake, task})
    {:noreply, state}
  end

  def handle_call({:employ_snake, pid}, _from, state) do
    {:reply, :ok, [pid | state]}
  end

  def handle_info(:clean_inactive_workers, state) do
    state = clean_inactive_workers(state)
    Process.send_after(self(), :clean_inactive_workers, 10_000 * 60)
    {:noreply, state}
  end

  def handle_info({:sacrifice_snake, pid}, state) do
    DynamicSupervisor.terminate_child(SnakeSupervisor, pid)
    {:noreply, state}
  end

  defp _deploy_new_snake() do
    case SnakeSupervisor.deploy_snake_worker() do
      {:ok, pid} ->
        {pypid, _update} = GenServer.call(pid, :status)
        {pid, pypid}

      {:error, message} ->
        Logger.error("Error while creating new snake: #{message}")
        {:error, message}
    end
  end

  defp _kill_inactive_worker(pid, pypid) do
    :python.stop(pypid)
    DynamicSupervisor.terminate_child(SnakeSupervisor, pid)
    Logger.info("Cleared unused snake")
  end

  defp clean_inactive_workers(state) do
    {perpetual_workers, rest} = state |> Enum.split(10)

    Enum.filter(rest, fn pid ->
      {pypid, update} = GenServer.call(pid, :status)
      now = DateTime.now!("Europe/Warsaw")
      active = DateTime.compare(now, Timex.shift(update, minutes: 15)) != :gt

      unless active do
        _kill_inactive_worker(pid, pypid)
      end

      active
    end)
    |> Kernel.++(perpetual_workers)
  end
end
