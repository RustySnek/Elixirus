defmodule ElixirusWeb.StudentLive.Index do
  use ElixirusWeb, :live_view

  def mount(_params, %{"api_token" => api_token}, socket) do
    if api_token do
      {:ok, socket}
    else
      {:noreply, push_navigate(socket, to: "/")}
    end
  end
end
