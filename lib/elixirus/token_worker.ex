defmodule Elixirus.TokenWorker do
  @moduledoc """
  GenServer for refreshing token lifespan and retrieving notifications
  """
  use GenServer
  alias Elixirus.Types.Client
  alias Elixirus.Types.NotificationIds
  require Logger
  alias Elixirus.Types.NotificationData
  alias Elixirus.Notifications.NotificationsSupervisor
  import Venomous
  alias Venomous.SnakeArgs

  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(table) do
    Logger.warning("restarted token worker")
    # Start refresh process after a 15s (avoids crashing genserver)
    Process.send_after(self(), :refresh, 15_000)
    {:ok, table}
  end

  defp load_initial_notifications(_token, nil) do
    {nil,
     %NotificationIds{
       grades: [],
       attendance: [],
       messages: [],
       announcements: [],
       schedule: [],
       homework: []
     }}
  end

  defp load_initial_notifications(token, notification_token) do
    %Client{} = client = Client.get_client(token)

    case SnakeArgs.from_params(:elixirus, :initial_notifications, [client]) |> python!() do
      {:ok, {%NotificationData{} = notifications, %NotificationIds{} = seen_ids}} ->
        notifications
        |> Map.to_list()
        |> Enum.filter(&match?({_, [_ | _]}, &1))
        |> Enum.each(&NotificationsSupervisor.push_notification(&1, notification_token))

        {notification_token, seen_ids}

      error ->
        Logger.error("Error in initial notification #{notification_token}\n#{error |> inspect()}")

        {nil,
         %NotificationIds{
           grades: [],
           attendance: [],
           messages: [],
           announcements: [],
           schedule: [],
           homework: []
         }}
    end
  end

  def handle_call({:add_token, username, token, ttl, notification_token}, _from, table) do
    {notification_token, seen_ids} = load_initial_notifications(token, notification_token)

    :ets.insert(
      table,
      {username, token, ttl, notification_token, seen_ids, DateTime.now!("Europe/Warsaw")}
    )

    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token}, _from, table) do
    case :ets.match(table, {:"$1", token, :"$2", :"$3", :"$4", :_}) do
      [] ->
        :ok

      [[name, ttl, notification_token, seen_ids] | _] ->
        unless(name == nil,
          do:
            :ets.insert(
              table,
              {name, token, ttl, notification_token, seen_ids, DateTime.now!("Europe/Warsaw")}
            )
        )
    end

    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token, notification_token}, _from, table) do
    case :ets.match(table, {:"$1", token, :"$2", :_, :"$3", :_}) do
      [] ->
        :ok

      [[name, ttl, seen_ids] | _] ->
        unless(name == nil,
          do:
            :ets.insert(
              table,
              {name, token, ttl, notification_token, seen_ids, DateTime.now!("Europe/Warsaw")}
            )
        )
    end

    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token, notification_token, ttl}, _from, table) do
    case :ets.match(table, {:"$1", token, :_, :_, :"$2", :_}) do
      [] ->
        :ok

      [[name, seen_ids] | _] ->
        unless(name == nil,
          do:
            :ets.insert(
              table,
              {name, token, ttl, notification_token, seen_ids, DateTime.now!("Europe/Warsaw")}
            )
        )
    end

    {:reply, :ok, table}
  end

  def handle_call({:remove_token, token}, _from, table) do
    case :ets.match(table, {:"$1", token, :_, :_, :_, :_}) do
      [] -> :ok
      [[username] | _] -> :ets.delete(table, username)
    end

    {:reply, :ok, table}
  end

  def handle_continue(:init_status, table), do: execute_token_refresh(table)

  def handle_info(:refresh, table), do: execute_token_refresh(table)

  defp manage_notifications({_, {_username, notifications, notification_token}}) do
    unless notification_token in [nil, ""] do
      notifications
      |> Map.from_struct()
      |> Map.to_list()
      |> Enum.filter(fn {_, notifications} -> notifications != [] end)
      |> Enum.each(fn notification ->
        NotificationsSupervisor.push_notification(notification, notification_token)
      end)
    end
  end

  defp execute_token_refresh(table) do
    tokens = :ets.tab2list(table)
    Logger.info("Refreshing #{length(tokens)} Tokens!")

    tokens
    |> Task.async_stream(&refresh_token(table, &1), timeout: 120_000)
    |> Task.async_stream(
      &manage_notifications(&1),
      timeout: 60_000
    )
    |> Stream.run()

    Process.send_after(self(), :refresh, 10 * 60 * 1000)
    {:noreply, table}
  end

  defp refresh_token(table, {username, token, ttl, nil, seen_ids, last_update}) do
    now = DateTime.now!("Europe/Warsaw")

    if DateTime.compare(
         now,
         DateTime.shift(last_update, hour: ttl)
       ) in [:lt, :eq] do
      %Client{} = client = Client.get_client(token)

      case SnakeArgs.from_params(:elixirus, :announcements, [client])
           |> python!(timeout: 10_000) do
        {:error, :timeout} ->
          Logger.info("Timed out refreshing")

        {:ok, _} ->
          :ets.insert(table, {username, token, ttl, nil, seen_ids, now})

        err ->
          Logger.info(inspect(err))
      end
    else
      Logger.info("Removing expired token")
      :ets.delete(table, username)
    end

    {username, nil, nil}
  end

  defp refresh_token(table, {username, token, ttl, notification_token, seen_ids, last_update}) do
    now = DateTime.now!("Europe/Warsaw")

    %Client{} = client = Client.get_client(token)

    notifications =
      if DateTime.compare(
           now,
           DateTime.shift(last_update, hour: ttl)
         ) in [:lt, :eq] do
        case SnakeArgs.from_params(:elixirus, :notifications, [client, seen_ids])
             |> python!() do
          {:ok, {%NotificationData{} = notifications, %NotificationIds{} = seen_ids}} ->
            :ets.insert(table, {username, token, ttl, notification_token, seen_ids, now})
            notifications

          {:error, message} ->
            Logger.error(message |> inspect)
            :ets.delete(table, username)
            nil

          exception ->
            Logger.error(exception |> inspect)
            nil
        end
      else
        Logger.info("Removing expired token")
        :ets.delete(table, username)
        nil
      end

    {username, notifications, notification_token}
  end
end
