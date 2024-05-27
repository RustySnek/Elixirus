defmodule Elixirus.Notifications.NotificationWorker do
  @moduledoc false
  alias Elixirus.Notifications.NotificationsSupervisor
  alias Pigeon.FCM.Notification

  use GenServer
  require Logger

  def start_link(args) do
    GenServer.start_link(__MODULE__, args)
  end

  def init([notification, token]) do
    state = {notification, token}
    {:ok, state, {:continue, :push_notification}}
  end

  def handle_continue(:push_notification, state) do
    {notification, token} = state

    notify =
      Notification.new(
        {:token, token},
        %{"body" => "#{notification.amount}", "title" => notification.destination}
      )
      |> Elixirus.FCM.push()

    Logger.info("Pushed notification")

    if notify.response != :success do
      Logger.error("Sending notification Failed")
      notify.error |> inspect() |> Logger.error()
    end

    NotificationsSupervisor.terminate_child(self())
    {:stop, :terminate, state}
  end
end
