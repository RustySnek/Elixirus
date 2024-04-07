defmodule Elixirus.Healthcheck.HealthSupervisor do
  alias Elixirus.Healthcheck.HealthWorker
  alias Elixirus.Healthcheck.Services.LibrusConnection
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  def init(_args) do
    children = [
      Supervisor.child_spec({HealthWorker, [LibrusConnection, 10_000]}, id: LibrusConnection)
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
