defmodule ElixirusWeb.StudentLive.SchedulingLive.Schedule do
  use ElixirusWeb, :live_view
  use ElixirusWeb.LoginHandler
  use ElixirusWeb.SetSemesterLive
  import Elixirus.PythonWrapper
  alias ElixirusWeb.LoginModal
  import ElixirusWeb.Helpers
  alias ElixirusWeb.Modal
  import ElixirusWeb.Components.Loadings

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    socket =
      case schedule do
        {:ok, schedule} ->
          cache_and_ttl_data(socket.assigns.user_id, "#{year}-#{month}-schedule", schedule, 15)
          assign(socket, :schedule, schedule)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(_params, %{"token" => token, "user_id" => user_id, "semester" => semester}, socket) do
    token = handle_api_token(socket, token)

    {{year, month, _day}, _time} = :calendar.local_time()

    schedule = handle_cache_data(user_id, "#{year}-#{month}-schedule")

    socket =
      socket
      |> assign(:token, token)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:schedule, %{})
      |> assign(:loadings, [])
      |> assign(:login_required, false)
      |> assign(:year, year)
      |> assign(:month, month)
      |> assign(:page_title, "Schedule #{year}-#{month}")
      |> create_fetcher(schedule, :schedule, fn ->
        {python(:helpers, :fetch_schedule, [token, year, month]), year, month}
      end)

    {:ok, socket}
  end
end
