defmodule ElixirusWeb.StudentLive.SchedulingLive.Schedule do
  require Logger
  use ElixirusWeb, :live_view

  use ElixirusWeb.SetSemesterLive
  import Elixirus.Python.SnakeWrapper

  import ElixirusWeb.Helpers
  alias ElixirusWeb.Modal

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case schedule do
        {:ok, schedule} ->
          cache_and_ttl_data(user_id, "#{year}-#{month}-schedule", schedule, 15)
          assign(socket, :schedule, schedule)

        %{:token_error => _message} ->
          assign(socket, :login_required, true)
          |> push_event("require-login", %{})

        %{:error => message} ->
          Logger.error(message)
          put_flash(socket, :error, message)
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
        {python(:fetchers, :fetch_schedule, [token, year, month]), year, month}
      end)

    {:ok, socket}
  end
end
