defmodule Elixirus.Notifications.NotificationsSupervisor do
  @moduledoc """
  DynamicSupervisor for Notifications
  """
  require Logger
  alias Elixirus.Notifications.NotificationWorker
  use DynamicSupervisor

  def start_link(_) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one, max_restarts: 0)
  end

  def push_notification(notification, token) do
    spec = {NotificationWorker, [notification, token]}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end

  def terminate_child(pid) do
    DynamicSupervisor.terminate_child(__MODULE__, pid)
  end
end
