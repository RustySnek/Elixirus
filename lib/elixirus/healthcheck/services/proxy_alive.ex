defmodule Elixirus.Healthcheck.Services.ProxyAlive do
  @moduledoc """
  Healthcheck for proxy status
  """
  use HTTPoison.Base

  def check_status() do
    proxy = System.get_env("ELIXIRUS_PROXY")

    if proxy != nil do
      case get(proxy) do
        {:ok, _} ->
          :up

        _ ->
          :down
      end
    else
      :down
    end
  end
end
