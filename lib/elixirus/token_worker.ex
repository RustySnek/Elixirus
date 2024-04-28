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

  def handle_call({:add_token, token, ttl}, _from, table) do
    :ets.insert(table, {token, ttl, DateTime.now("Europe/Warsaw")})
    {:reply, :ok, table}
  end

  def handle_call({:extend_lifetime, token, ttl}, _from, table) do
    unless(:ets.lookup(table, token) == [],
      do: :ets.insert(table, {token, ttl, DateTime.now("Europe/Warsaw")})
    )

    {:reply, :ok, table}
  end

  def handle_cast({:remove_token, token}, table) do
    :ets.delete(table, token)
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

  defp refresh_token(table, {token, ttl, last_update}) do
    now = DateTime.now("Europe/Warsaw")

    if Timex.diff(now, last_update) > Timex.shift(last_update, hours: ttl) do
      case python(:helpers, :refresh_oauth, [token]) do
        :ok -> :ets.insert(table, {token, ttl, now})
        {:error, _message} -> :ets.delete(table, token)
      end
    else
      :ets.delete(table, token)
    end
  end
end
