defmodule ElixirusWeb.StudentLive.Homework do
  use ElixirusWeb, :live_view

  alias ElixirusWeb.LoginModal

  def handle_event("navigate_students", %{"token" => token}, socket) do
    socket =
      socket
      |> assign(:token, token)
      |> assign(:login_required, false)

    {:noreply, redirect(socket, to: "/student/homework")}
  end

  def mount(_params, %{"token" => api_token}, socket) do
    api_token =
      case api_token |> Map.keys() do
        [] -> ""
        token -> token |> hd() |> to_charlist()
      end

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:login_required, false)

    {:ok, socket}
  end
end
