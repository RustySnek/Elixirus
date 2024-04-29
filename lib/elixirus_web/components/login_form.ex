defmodule ElixirusWeb.LoginForm do
  @moduledoc false
  use ElixirusWeb, :live_component
  import Heroicons
  alias GenServer
  alias Elixirus.TokenWorker

  def mount(socket) do
    socket =
      socket
      |> assign(:token, "")
      |> assign(:username, "")
      |> assign(:error_message, "")

    {:ok, socket}
  end

  def handle_event("login", %{"username" => username, "password" => password} = params, socket) do
    keep_alive? = "save_token" |> Kernel.in(params |> Map.keys())
    {:ok, pid} = :python.start()

    get_token = :python.call(pid, :handle_classes, :handle_token, [username, password])
    :python.stop(pid)

    socket =
      case get_token do
        {:ok, token} ->
          unless(keep_alive? == false,
            do: GenServer.call(TokenWorker, {:add_token, username, token, 6})
          )

          socket |> assign(:token, token |> to_string()) |> assign(:username, username)

        {:error, error_message} ->
          socket
          |> assign(:error_message, error_message |> to_string())
          |> assign(:username, username)
      end

    {:noreply, socket}
  end
end
