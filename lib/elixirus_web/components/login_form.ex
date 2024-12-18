defmodule ElixirusWeb.LoginForm do
  @moduledoc false
  alias Elixirus.Types.Token
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_component
  require Logger
  alias GenServer
  alias Elixirus.TokenWorker
  alias UUID

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

  def require_login(socket) do
    if Application.get_env(:elixirus, :elixirus_test, false) == "true" do
      socket
    else
      push_event(socket, "require-login", %{})
    end
  end

  def handle_event("generate_notification_uuid", _params, socket) do
    socket =
      if socket.assigns.notification_token == nil do
        assign(socket, :notification_token, "elixirus_#{UUID.uuid4()}")
      else
        assign(socket, :notification_token, nil)
      end

    {:noreply, socket}
  end

  def handle_event("save_token", _params, socket) do
    {:noreply, assign(socket, :keep_alive, !socket.assigns.keep_alive)}
  end

  def handle_event("retrieve_local_storage", %{"username" => uname}, socket),
    do: {:noreply, assign(socket, :username, uname)}

  def handle_event("retrieve_local_storage", %{"ntfy" => ntfy}, socket) do
    case ntfy do
      "true" -> handle_event("generate_notification_uuid", %{}, socket)
      true -> handle_event("generate_notification_uuid", %{}, socket)
      _ -> {:noreply, socket}
    end
  end

  def handle_event("retrieve_local_storage", %{"save_token" => keep_alive}, socket) do
    keep_alive =
      case keep_alive do
        "true" -> true
        true -> true
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

    client = Client.get_client(username, password)

    socket =
      case client do
        {:ok, %Client{token: %Token{API_Key: token}}} ->
          notification_token = socket.assigns.notification_token

          token_ttl =
            case token_ttl |> to_string |> Integer.parse() do
              :error -> 2
              {ttl, _} -> ttl
            end

          unless keep_alive? == false do
            GenServer.call(
              TokenWorker,
              {:add_token, username, token, token_ttl, notification_token}
            )
          end

          socket
          |> assign(:token, token |> to_string())
          |> assign(:username, username)

        {:error, error_message} ->
          socket
          |> assign(:error_message, error_message)
          |> assign(:username, username)

        %Venomous.SnakeError{exception: exception, error: error, backtrace: backtrace} ->
          Logger.error("#{exception}\n#{error}\nBacktrace: #{backtrace}")

          socket
          |> assign(:error_message, "Internal server error. Please try again later.")
          |> assign(:username, username)

        err ->
          Logger.error("Unknown error occured while authenticating: #{inspect(err)}")
      end

    {:noreply, socket}
  end

  defp ttl_options(), do: ["2h": 2, "4h": 4, "6h": 6, "8h": 8, "10h": 10, "12h": 12]
end
