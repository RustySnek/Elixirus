defmodule Elixirus.Python.SnakeWorker do
  @moduledoc """
  🔨🐍
  A brave snake worker slithering across...
  """
  alias Elixirus.Python.SnakeManager
  use GenServer
  require Logger

  def start_link(args) do
    GenServer.start_link(__MODULE__, args)
  end

  def init(_) do
    case :python.start() do
      {:error, reason} ->
        Logger.error(reason)

        {:error, :rip_python}

      {:ok, pid} ->
        {:ok, set_state(pid, :busy), {:continue, :init_data_types}}
    end
  end

  def handle_continue(:init_data_types, state) do
    :python.call(state.pid, :helpers, :setup_data_types, [])
    {:noreply, set_state(state.pid, :ready)}
  end

  def handle_cast({:set_state, new_state}, state) do
    {:noreply, set_state(state.pid, new_state)}
  end

  def handle_call(:kill_snake, _from, state) do
    stop = :python.stop(state.pid)
    {:noreply, stop, %{pid: state.pid, state: :dead, update: state.update}}
  end

  def handle_call({:run, module, func, args}, _from, state) do
    GenServer.cast(self(), {:set_state, :busy})

    response =
      try do
        data = :python.call(state.pid, module, func, args)
        GenServer.cast(self(), {:set_state, :ready})
        data
      rescue
        error ->
          case error do
            %ErlangError{original: {:python, exception, error, backtrace}} ->
              Logger.error(exception |> to_string)
              Logger.error(error |> to_string)
              Logger.error(backtrace |> to_string)
              GenServer.call(self(), :kill_snake)
              Process.send_after(SnakeManager, {:sacrifice_snake, self()}, 200)
              %{error: exception}

            exception ->
              Logger.error(exception)
              %{error: "Unknown error occured."}
          end
      end

    {:reply, response, state}
  end

  def handle_call(:status, _from, state) do
    {:reply, {state.state, state.update}, state}
  end

  defp set_state(pid, state) do
    update = DateTime.now!("Europe/Warsaw")
    %{pid: pid, state: state, update: update}
  end
end
