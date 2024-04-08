defmodule Elixirus.Healthcheck.Services.LibrusConnection do
  use HTTPoison.Base
  import Elixirus.Healthcheck.Healthcheck

  def check_status() do
    case get("https://synergia.librus.pl", [],
           timeout: 5_000,
           recv_timeout: 5_000
         ) do
      {:ok, _} ->
        if System.get_env("USE_PROXY") != "no" do
          System.put_env("USE_PROXY", "no")
        end

        :up

      _ ->
        case get_service_status(Elixirus.Healthcheck.Services.ProxyAlive) do
          :up ->
            if System.get_env("USE_PROXY") != "yes" do
              System.put_env("USE_PROXY", "yes")
            end

          :down ->
            if System.get_env("USE_PROXY") != "no" do
              System.put_env("USE_PROXY", "no")
            end
        end

        :down
    end
  end
end
