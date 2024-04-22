defmodule ElixirusWeb.LoginHandler do
  defmacro __using__(_opts) do
    quote do
      def handle_event(
            "navigate_students",
            %{
              "return_url" => return_url,
              "token" => token,
              "user_id" => user_id
            } = _params,
            socket
          ) do
        socket =
          socket
          |> assign(:token, token)
          |> assign(:user_id, user_id)
          |> assign(:login_required, false)

        {:noreply, redirect(socket, to: return_url)}
      end
    end
  end
end
