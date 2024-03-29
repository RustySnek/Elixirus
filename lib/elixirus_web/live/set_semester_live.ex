defmodule ElixirusWeb.SetSemesterLive do
  defmacro __using__(_opts) do
    quote do
      def handle_event("change_semester", %{"semester" => semester} = _params, socket) do
        {:noreply, assign(socket, :semester, semester)}
      end
    end
  end
end
