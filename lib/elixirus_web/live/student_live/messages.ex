defmodule ElixirusWeb.StudentLive.Messages do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal
  import ElixirusWeb.Helpers

  def fetch_messages(token, page) do
    python(:helpers, :fetch_messages, [token, page])
  end

  def handle_async(:load_messages, {:ok, messages}, socket) do
    socket =
      case messages do
        {:ok, messages} -> assign(socket, :messages, messages)
        _ -> assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(_params, %{"api_token" => api_token}, socket) do
    api_token =
      case api_token |> Map.keys() do
        [] -> ""
        token -> token |> hd() |> to_charlist()
      end

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:login_required, false)
      |> assign(:messages, [])
      |> start_async(:load_messages, fn -> fetch_messages(api_token, 0) end)

    {:ok, socket}
  end
end
