defmodule Elixirus.Healthcheck.HealthSupervisor do
  @moduledoc """
  supervisor for healthcheck workers
  """
  alias Elixirus.Healthcheck.HealthWorker
  alias Elixirus.Healthcheck.Services.LibrusConnection
  alias Elixirus.Healthcheck.Services.ProxyAlive
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  def init(_args) do
    children = [
      Supervisor.child_spec({HealthWorker, [LibrusConnection, 10_000]},
        id: LibrusConnection,
        restart: :permanent
      ),
      Supervisor.child_spec({HealthWorker, [ProxyAlive, 10_000]},
        id: ProxyAlive,
        restart: :permanent
      )
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
