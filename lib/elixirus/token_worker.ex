defmodule Elixirus.TokenWorker do
  @moduledoc """
  GenServer for refreshing token lifespan and retrieving notifications
  """
  use GenServer
  require Logger
  alias Timex
  import Elixirus.Python.SnakeWrapper

  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(table) do
    Logger.warning("restarted token worker")
    # Start refresh process after a minute (avoids crashing genserver)
    Process.send_after(self(), :refresh, 1_000)
    {:ok, table}
  end

  def handle_call({:add_token, username, token, ttl, notification_token}, _from, table) do
    :ets.insert(table, {username, token, ttl, notification_token, DateTime.now!("Europe/Warsaw")})
    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token, notification_token}, _from, table) do
    case :ets.match(table, {:"$1", token, :"$2", :_}) do
      [] ->
        :ok

      [[name, ttl] | _] ->
        unless(name == nil,
          do:
            :ets.insert(
              table,
              {name, token, ttl, notification_token, DateTime.now!("Europe/Warsaw")}
            )
        )
    end

    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token, notification_token, ttl}, _from, table) do
    case :ets.match(table, {:"$1", token, :_, :_}) do
      [] ->
        :ok

      [[name] | _] ->
        unless(name == nil,
          do:
            :ets.insert(
              table,
              {name, token, ttl, notification_token, DateTime.now!("Europe/Warsaw")}
            )
        )
    end

    {:reply, :ok, table}
  end

  def handle_cast({:remove_token, username, token}, table) do
    [{_username, lookup_token, _ttl, _notification_token, _last_update} | _] =
      :ets.lookup(table, username)

    if lookup_token == token do
      :ets.delete(table, username)
    end

    {:noreply, table}
  end

  def handle_continue(:init_status, table), do: execute_token_refresh(table)

  def handle_info(:refresh, table), do: execute_token_refresh(table)

  def handle_cast({:push_notifications, notifications, token}, table) do
    IO.inspect(notifications)

    notifications
    |> Enum.each(fn notification ->
      dbg(notification)

      notify =
        Pigeon.FCM.Notification.new(
          {:token, token},
          %{notification.destination => "#{notification.amount}"}
        )
        |> Elixirus.FCM.push()
        |> dbg

      if notify.response != :success do
        Logger.error("Sending notification Failed")
        notify.error |> inspect() |> Logger.error()
      end
    end)
    |> dbg

    {:noreply, table}
  end

  defp execute_token_refresh(table) do
    :ets.tab2list(table)
    |> Task.async_stream(fn token -> refresh_token(table, token) end, timeout: 120_000)
    |> Task.async_stream(
      fn {_, {notifications, notification_token}} ->
        dbg(notification_token)

        if notifications != nil and notification_token not in [nil, ""] do
          GenServer.cast(self(), {:push_notifications, notifications, notification_token})
        end
      end,
      timeout: 60_000
    )
    |> Stream.run()

    Process.send_after(self(), :refresh, 15 * 1000)
    {:noreply, table}
  end

  defp refresh_token(table, {username, token, ttl, notification_token, last_update}) do
    now = DateTime.now!("Europe/Warsaw")

    notifications =
      if DateTime.compare(now, Timex.shift(last_update, hours: ttl)) in [:lt, :eq] do
        case python(:fetchers, :keep_token_alive, [token]) do
          {:ok, notifications} ->
            :ets.insert(table, {username, token, ttl, notification_token, now})
            notifications

          # do something with notifications

          {:error, message} ->
            Logger.error(message)
            :ets.delete(table, username)
            nil

          exception ->
            Logger.error(exception |> Map.get(:error, "") |> to_string())
            nil
        end
      else
        Logger.info("Removing expired token")
        :ets.delete(table, username)
        nil
      end

    {notifications, notification_token}
  end
end
