defmodule ElixirusWeb.LoginForm do
  @moduledoc false
  use ElixirusWeb, :live_component
  import Heroicons

  def mount(socket) do
    socket =
      socket
      |> assign(:token, "")
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
          socket |> assign(:token, token |> to_string())

        {:error, error_message} ->
          assign(socket, :error_message, error_message |> to_string())
      end

    {:noreply, socket}
  end
end
