defmodule Elixirus.Notifications.NotificationWorker do
  @moduledoc false
  alias Elixirus.Notifications.NotificationsSupervisor
  use HTTPoison.Base

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
      post(
        "https://ntfy.sh/#{token}",
        "*#{notification.amount}* #{notification.destination}",
        [
          {"Click", "https://elixirus.rustysnek.xyz"},
          {"Icon", "https://elixirus.rustysnek.xyz/images/cool_snake.ico"},
          {"Title", "#{notification.destination}"},
          {"Tags", "skull"},
          {"Markdown", "yes"},
          {"Actions",
           Enum.join(
             [
               "view, View in Elixirus, https://elixirus.rustysnek.xyz, clear=true"
             ],
             "; "
           )}
        ]
      )

    case notify do
      {:ok, %HTTPoison.Response{status_code: 200, body: _body}} ->
        Logger.info("Pushed notification")

      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        Logger.warning("Status code: #{status_code}\n #{body |> inspect}")

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error("Failed to send notification")
        reason |> inspect() |> Logger.error()
    end

    NotificationsSupervisor.terminate_child(self())
    {:stop, :terminate, state}
  end
end
