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

  def handle_event("login", %{"username" => username, "password" => password}, socket) do
    {:ok, pid} = :python.start()

    get_token = :python.call(pid, :handle_classes, :handle_token, [username, password])
    :python.stop(pid)

    socket =
      case get_token do
        {:ok, token} ->
          GenServer.call(TokenWorker, {:add_token, token, 6})
          socket |> assign(:token, token |> to_string()) |> assign(:username, username)

        {:error, error_message} ->
          socket
          |> assign(:error_message, error_message |> to_string())
          |> assign(:username, username)
      end

    {:noreply, socket}
  end
end
