defmodule Elixirus.Python.SnakeWrapper do
  @moduledoc """
  Wrapper for SnakeManager GenServer to run python functions.
  """
  alias Elixirus.Python.SnakeManager

  @doc """
  Call python GenServer
  """

  require Logger

  def _slay_python_worker(pid, pypid) do
    :python.stop(pypid)
    send(SnakeManager, {:sacrifice_snake, pid})
  end

  def python(module, func, args) do
    # Prevents :python processes from not exiting
    Process.flag(:trap_exit, true)

    case GenServer.call(SnakeManager, :get_ready_snake, :infinity) do
      {:error, _} ->
        receive do
          {:EXIT, _from, reason} -> Logger.warning("EXITED #{reason |> inspect}")
        after
          1500 ->
            python(module, func, args)
        end

      {pid, pypid} ->
        receive do
          {:EXIT, _from, type} ->
            _slay_python_worker(pid, pypid)
            Logger.warning("EXITED #{type |> inspect}")
        after
          150 ->
            try do
              data = :python.call(pypid, module, func, args)
              GenServer.call(SnakeManager, {:employ_snake, pid}, :infinity)
              data
            rescue
              error ->
                case error do
                  %ErlangError{original: {:python, exception, error, backtrace}} ->
                    Logger.error("#{exception}\n#{error}\nBacktrace: #{backtrace}")
                    _slay_python_worker(pid, pypid)
                    %{error: exception |> to_string}

                  exception ->
                    Logger.error(exception |> inspect)
                    _slay_python_worker(pid, pypid)
                    %{error: "Unknown error occured."}
                end
            end
        end
    end
  end
end
