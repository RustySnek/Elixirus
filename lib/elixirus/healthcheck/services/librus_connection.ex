defmodule Elixirus.Healthcheck.Services.LibrusConnection do
  @moduledoc """
  Healthcheck for librus.
    Checks the connection to librus first,
    if it fails proceeds to check and apply proxy if possible
  """
  use HTTPoison.Base
  import Elixirus.Healthcheck.Healthcheck

  defp set_proxy(:up) do
    if System.get_env("USE_PROXY") != "yes" do
      System.put_env("USE_PROXY", "yes")
    end
  end

  defp set_proxy(:down) do
    if System.get_env("USE_PROXY") != "no" do
      System.put_env("USE_PROXY", "no")
    end
  end

  defp get_librus_status() do
    Elixirus.Healthcheck.Services.ProxyAlive |> get_service_status() |> set_proxy()
  end

  def check_status() do
    case get("https://synergia.librus.pl", [],
           timeout: 5_000,
           recv_timeout: 5_000
         ) do
      {:ok,
       %HTTPoison.Response{
         status_code: 302
       }} ->
        set_proxy(:down)
        :up

      _ ->
        get_librus_status()
        :down
    end
  end
end
