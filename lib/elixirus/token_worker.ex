defmodule Elixirus.TokenWorker do
  use GenServer
  require Logger
  alias Timex
  import Elixirus.Python.SnakeWrapper

  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(table) do
    Logger.warning("restarted token worker")
    {:ok, table, {:continue, :init_status}}
  end

  def handle_call({:add_token, username, token, ttl}, _from, table) do
    :ets.insert(table, {username, token, ttl, DateTime.now!("Europe/Warsaw")})
    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token}, _from, table) do
    case :ets.match(table, {:"$1", token, :"$2", :_}) do
      [] ->
        :ok

      [[name, ttl] | _] ->
        unless(name == nil,
          do: :ets.insert(table, {name, token, ttl, DateTime.now!("Europe/Warsaw")})
        )
    end

    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token, ttl}, _from, table) do
    case :ets.match(table, {:"$1", token, :_, :_}) do
      [] ->
        :ok

      [[name] | _] ->
        unless(name == nil,
          do: :ets.insert(table, {name, token, ttl, DateTime.now!("Europe/Warsaw")})
        )
    end

    {:reply, :ok, table}
  end

  def handle_cast({:remove_token, username, token}, table) do
    [{_username, lookup_token, _ttl, _last_update} | _] = :ets.lookup(table, username)

    if lookup_token == token do
      :ets.delete(table, username)
    end

    {:noreply, table}
  end

  def handle_continue(:init_status, table), do: execute_token_refresh(table)

  def handle_info(:refresh, table), do: execute_token_refresh(table)

  defp execute_token_refresh(table) do
    :ets.tab2list(table)
    |> Task.async_stream(fn token -> refresh_token(table, token) end, timeout: 30 * 1000)
    |> Enum.to_list()

    Process.send_after(self(), :refresh, 15 * 60 * 1000)
    {:noreply, table}
  end

  defp refresh_token(table, {username, token, ttl, last_update}) do
    now = DateTime.now!("Europe/Warsaw")

    if DateTime.compare(now, Timex.shift(last_update, hours: ttl)) in [:lt, :eq] do
      case python(:fetchers, :keep_token_alive, [token]) do
        {:ok, notifications} ->
          :ets.insert(table, {username, token, ttl, now})

        # do something with notifications

        {:error, __message} ->
          :ets.delete(table, username)
      end
    else
      :ets.delete(table, username)
    end
  end
end
