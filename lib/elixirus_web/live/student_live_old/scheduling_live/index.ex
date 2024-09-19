defmodule ElixirusWeb.StudentLive.SchedulingLive.Index do
  use ElixirusWeb, :live_view
  # import Venomous
  # alias Venomous.SnakeArgs
  import ElixirusWeb.Helpers
  use ElixirusWeb.SetSemesterLive

  def mount(
        _params,
        %{"semester" => semester, "token" => api_token, "user_id" => user_id},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:page_title, "Scheduling")
      |> assign(:login_required, false)

    {:ok, socket}
  end
end
