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
      |> assign(:keep_alive, false)
      |> assign(:ttl, "12")
      |> assign(:notification_token, nil)

    {:ok, socket}
  end

  def handle_event("notification_loading", _params, socket) do
    {:noreply, assign(socket, :notification_token, :loading)}
  end

  def handle_event("set_notifications_token", %{"token" => notification_token}, socket) do
    {:noreply, assign(socket, :notification_token, notification_token)}
  end

  def handle_event("save_token", _params, socket) do
    {:noreply, assign(socket, :keep_alive, !socket.assigns.keep_alive)}
  end

  def handle_event("retrieve_local_storage", %{"save_token" => keep_alive}, socket) do
    keep_alive =
      case keep_alive do
        "true" -> true
        _ -> false
      end

    {:noreply, assign(socket, :keep_alive, keep_alive)}
  end

  def handle_event(task, %{"ttl" => ttl}, socket)
      when task in ["retrieve_local_storage", "change_ttl"] do
    {:noreply, assign(socket, :ttl, ttl)}
  end

  def handle_event(
        "login",
        %{"username" => username, "password" => password} = _params,
        socket
      ) do
    keep_alive? = socket.assigns.keep_alive
    token_ttl = socket.assigns.ttl

    get_token = Elixirus.Python.SnakeWrapper.python(:helpers, :create_token, [username, password])

    socket =
      case get_token do
        %{:ok => token} ->
          unless(keep_alive? == false,
            do:
              GenServer.call(
                TokenWorker,
                {:add_token, username, token, token_ttl |> String.to_integer(),
                 socket.assigns.notification_token}
              )
          )

          socket
          |> assign(:token, token |> to_string())
          |> assign(:username, username)

        %{:error => error_message} ->
          socket
          |> assign(:error_message, error_message |> to_string())
          |> assign(:username, username)
      end

    {:noreply, socket}
  end

  defp ttl_options(), do: ["2h": 2, "4h": 4, "6h": 6, "8h": 8, "10h": 10, "12h": 12]
end
