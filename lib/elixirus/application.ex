defmodule Elixirus.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  alias Elixirus.Python.PythonWorker
  alias Elixirus.TokenWorker

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      ElixirusWeb.Telemetry,
      Elixirus.Healthcheck.HealthSupervisor,
      Supervisor.child_spec({PythonWorker, []}, id: PythonWorker, restart: :permanent),
      Supervisor.child_spec({TokenWorker, :ets.new(:token_storage, [:set, :public])},
        id: TokenWorker,
        restart: :permanent
      ),
      {DNSCluster, query: Application.get_env(:elixirus, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Elixirus.PubSub},
      # Start a worker by calling: Elixirus.Worker.start_link(arg)
      # {Elixirus.Worker, arg},
      # Start to serve requests, typically the last entry
      ElixirusWeb.Endpoint,
      {Cachex, name: :elixirus_cache}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Elixirus.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ElixirusWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
