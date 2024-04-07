defmodule Elixirus.Healthcheck.HealthWorker do
  use GenServer

  def start_link([service | _] = args) do
    GenServer.start_link(__MODULE__, args, name: service)
  end

  def init([service, interval]) do
    state = %{
      service: service,
      interval: interval
    }

    {:ok, state, {:continue, :init_status}}
  end

  def handle_call({:get_status}, _from, state), do: execute_check_status(state)

  def handle_continue(:init_status, state), do: execute_check_status(state)

  def handle_info(:check, state), do: execute_check_status(state)

  defp execute_check_status(%{service: service, interval: interval} = state) do
    new_service_status = apply(service, :check_status, [])
    new_state = Map.put(state, :status, new_service_status)
    Process.send_after(service, :check, interval)
    {:noreply, new_state}
  end
end
