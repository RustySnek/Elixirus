defmodule Elixirus.TokenWorker do
  @moduledoc """
  GenServer for refreshing token lifespan and retrieving notifications
  """
  use GenServer
  require Logger
  alias Elixirus.Notifications.NotificationsSupervisor
  alias Timex
  import Elixirus.Python.SnakeWrapper

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
     %{
       grades: [],
       attendance: [],
       messages: [],
       announcements: [],
       schedule: [],
       homework: []
     }}
  end

  defp load_initial_notifications(token, notification_token) do
    case python(:notifications, :fetch_initial_notifications, [token]) do
      {:ok, [notifications, seen_ids]} ->
        notifications
        |> Map.to_list()
        |> Enum.filter(&match?({_, [_ | _]}, &1))
        |> Enum.each(&NotificationsSupervisor.push_notification(&1, notification_token))

        {notification_token, seen_ids}

      error ->
        Logger.error("Error in initial notification #{notification_token}\n#{error |> inspect()}")

        {nil,
         %{
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
      |> Map.to_list()
      |> Enum.filter(fn {_, notifications} -> notifications != [] end)
      |> Enum.each(fn notification ->
        NotificationsSupervisor.push_notification(notification, notification_token)
      end)
    end
  end

  defp execute_token_refresh(table) do
    :ets.tab2list(table)
    |> Task.async_stream(&refresh_token(table, &1), timeout: 120_000)
    |> Task.async_stream(
      &manage_notifications(&1),
      timeout: 60_000
    )
    |> Stream.run()

    Process.send_after(self(), :refresh, 10 * 60 * 1000)
    {:noreply, table}
  end

  defp refresh_token(table, {username, token, ttl, notification_token, seen_ids, last_update}) do
    now = DateTime.now!("Europe/Warsaw")

    notifications =
      if DateTime.compare(now, Timex.shift(last_update, hours: ttl)) in [:lt, :eq] do
        case python(:notifications, :fetch_new_notifications, [token, seen_ids]) do
          {:ok, [notifications, seen_ids]} ->
            :ets.insert(table, {username, token, ttl, notification_token, seen_ids, now})
            notifications

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

    {username, notifications, notification_token}
  end
end
