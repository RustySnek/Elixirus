defmodule Elixirus.Healthcheck.Services.LibrusConnection do
  use HTTPoison.Base

  def check_status() do
    case get("https://synergia.librus.plx") do
      {:ok, _} ->
        if System.get_env("USE_PROXY") != "no" do
          System.put_env("USE_PROXY", "no")
        end

        :up

      _ ->
        if System.get_env("USE_PROXY") != "yes" do
          System.put_env("USE_PROXY", "yes")
        end

        :down
    end
  end
end
