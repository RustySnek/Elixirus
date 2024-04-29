defmodule Elixirus.TokenWorker do
  use GenServer
  alias Timex
  import Elixirus.PythonWrapper

  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init([table_name | opts]) do
    table = :ets.new(table_name, opts)
    {:ok, table, {:continue, :init_status}}
  end

  def handle_call({:add_token, username, token, ttl}, _from, table) do
    :ets.insert(table, {username, token, ttl, DateTime.now!("Europe/Warsaw")})
    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token, ttl}, _from, table) do
    case :ets.match(table, {:"$1", token, :_, :_}) do
      [] ->
        :ok

      [name | _] ->
        name = name |> Enum.at(0)

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
    |> Task.async_stream(fn token -> refresh_token(table, token) end)

    Process.send_after(self(), :refresh, 15_000 * 60)
    {:noreply, table}
  end

  defp refresh_token(table, {username, token, ttl, last_update}) do
    now = DateTime.now!("Europe/Warsaw")

    if Timex.diff(now, last_update) > Timex.shift(last_update, hours: ttl) do
      case python(:helpers, :keep_token_alive, [token]) do
        :ok -> :ets.insert(table, {username, token, ttl, now})
        {:error, __message} -> :ets.delete(table, username)
      end
    else
      :ets.delete(table, username)
    end
  end
end
