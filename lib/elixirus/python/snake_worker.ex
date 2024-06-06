defmodule Elixirus.Python.SnakeWorker do
  @moduledoc """
  🔨🐍
  A brave snake worker slithering across...
  """
  use GenServer
  require Logger

  def start_link(args) do
    GenServer.start_link(__MODULE__, args)
  end

  def init(_) do
    case :python.start() do
      {:error, reason} ->
        Logger.error(reason |> inspect)

        {:error, :rip_python}

      {:ok, pid} ->
        {:ok, set_state(pid), {:continue, :init_data_types}}
    end
  end

  def handle_continue(:init_data_types, state) do
    :python.call(state.pid, :helpers, :setup_data_types, [])
    {:noreply, set_state(state.pid)}
  end

  def handle_call(:status, _from, state) do
    {:reply, {state.pid, state.update}, state}
  end

  defp set_state(pid) do
    update = DateTime.now!("Europe/Warsaw")
    %{pid: pid, update: update}
  end
end
