defmodule Elixirus.Python.SnakeSupervisor do
  @moduledoc """
  DynamicSupervisor for Snakes
  """
  alias Elixirus.Python.SnakeWorker
  use DynamicSupervisor

  def start_link(_) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one, max_restarts: 0, max_children: 500)
  end

  def deploy_snake_worker do
    spec = {SnakeWorker, []}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end
end
