defmodule ElixirusWeb.StudentLive.SchedulingLive.Schedule do
  require Logger
  use ElixirusWeb, :live_view

  use ElixirusWeb.SetSemesterLive
  import Venomous
  alias Venomous.SnakeArgs

  import ElixirusWeb.Helpers
  alias ElixirusWeb.Modal

  @asyncs [:load_schedule]

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, schedule, @asyncs) do
        {:ok, schedule} ->
          cache_and_ttl_data(user_id, "#{year}-#{month}-schedule", schedule, 15)
          assign(socket, :schedule, schedule)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
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
        {SnakeArgs.from_params(:fetchers, :fetch_schedule, [token, year, month]) |> python!(:infinity), year, month}
      end)

    {:ok, socket}
  end
end
