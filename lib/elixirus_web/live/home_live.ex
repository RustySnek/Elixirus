defmodule ElixirusWeb.HomeLive do
  use ElixirusWeb, :live_view
  import Phoenix.LiveView

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:token, "")
      |> assign(:error_message, "")

    {:ok, socket}
  end

  def handle_event("login", %{"username" => username, "password" => password}, socket) do
    {:ok, pid} = :python.start()

    socket =
      case :python.call(pid, :handle_classes, :handle_token, [username, password]) do
        {:ok, token} -> assign(socket, :token, token |> to_string())
        {:error, error_message} -> assign(socket, :error_message, error_message |> to_string())
      end

    :python.stop(pid)

    {:noreply, socket}
  end
end
