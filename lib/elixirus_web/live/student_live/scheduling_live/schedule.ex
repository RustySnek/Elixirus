defmodule ElixirusWeb.StudentLive.SchedulingLive.Schedule do
  use ElixirusWeb, :live_view
  use ElixirusWeb.LoginHandler
  use ElixirusWeb.SetSemesterLive
  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal

  def mount(_params, %{"token" => token, "user_id" => user_id, "semester" => semester}, socket) do
    socket =
      socket
      |> assign(:token, token)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:login_required, false)

    {:ok, socket}
  end
end
