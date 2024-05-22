defmodule Elixirus.Python.SnakeSupervisor do
  alias Elixirus.Python.SnakeWorker
  use DynamicSupervisor

  def start_link(_) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def deploy_snake_worker do
    spec = {SnakeWorker, []}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end
end
