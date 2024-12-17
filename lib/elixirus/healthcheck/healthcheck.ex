defmodule Elixirus.Healthcheck.Healthcheck do
  @moduledoc """
  wrapper for Healthcheck genserver
  """

  def get_service_status(service), do: GenServer.call(service, {:get_status})
  def refresh_service_status(service), do: GenServer.call(service, {:refresh_status})
end
