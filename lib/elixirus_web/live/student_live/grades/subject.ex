defmodule ElixirusWeb.StudentLive.Grades.Subject do
  use ElixirusWeb, :live_view

  def mount(%{"subject" => subject}, %{"semester" => semester, "token" => api_token}, socket) do
    dbg(socket.assigns)

    api_token =
      case api_token |> Map.keys() do
        [] ->
          case Map.get(socket.assigns, :token) do
            nil -> ""
            token -> token
          end

        token ->
          token |> hd() |> to_charlist()
      end

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:subject, subject)
      |> assign(:semester, semester)

    {:ok, socket}
  end
end
