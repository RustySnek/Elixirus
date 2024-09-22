defmodule Elixirus.Healthcheck.Healthcheck do
  @moduledoc """
  wrapper for Healthcheck genserver
  """
  def get_service_status(service),
    do: get_service_status(service, Cachex.get(:elixirus_cache, "services-#{service}"))

  def get_service_status(service, {:ok, nil}) do
    status = GenServer.call(service, {:get_status})
    Cachex.put(:elixirus_cache, "services-#{service}", status)
    Cachex.expire(:elixirus_cache, "services-#{service}", :timer.minutes(1))
  end

  def get_service_status(_service, {:ok, status}), do: status

  def get_service_status(service, _), do: get_service_status(service, {:ok, nil})
end
