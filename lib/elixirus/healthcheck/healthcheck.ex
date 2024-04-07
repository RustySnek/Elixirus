defmodule Elixirus.Healthcheck.Healthcheck do
  def get_service_status(service) do
    GenServer.call(service, {:get_status})
  end
end
