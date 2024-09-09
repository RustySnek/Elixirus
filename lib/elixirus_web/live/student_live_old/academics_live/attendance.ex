defmodule ElixirusWeb.StudentLive.AcademicsLive.Attendance do
  require Logger
  use ElixirusWeb, :live_view

  import ElixirusWeb.Helpers
  import Venomous
  alias Venomous.SnakeArgs

  import Phoenix.UI.Components.Tooltip
  import Phoenix.UI.Components.Typography

  @asyncs [
    :load_frequency,
    :load_attendance
  ]

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_frequency, {:ok, frequency}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, frequency, @asyncs) do
        {:ok, freq} ->
          freq =
            freq
            |> Tuple.to_list()
            |> Enum.map(
              &((&1 * 1000)
                |> round()
                |> Kernel./(10))
            )

          cache_and_ttl_data(user_id, "frequency", freq, 10)

          socket
          |> assign(:frequency, freq)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_attendance, {:ok, {attendance, semester}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, attendance, @asyncs) do
        {:ok, attendance, stats} ->
          attendance =
            attendance
            |> Enum.chunk_by(&Map.get(&1, :date))

          cache_and_ttl_data(user_id, "#{semester}-attendance", attendance, 10)
          cache_and_ttl_data(user_id, "attendance-stats", stats, 10)

          socket
          |> assign(:attendance, attendance)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :attendance))
          |> assign(:stats, stats)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"semester" => semester} = _params, socket) do
    user_id = socket.assigns.user_id
    token = socket.assigns.token
    attendance = handle_cache_data(user_id, "#{semester}-attendance")

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:attendance, [])
      |> create_fetcher(user_id, attendance, :attendance, fn ->
        {SnakeArgs.from_params(:fetchers, :fetch_all_attendance, [token, semester, true])
         |> python!(python_timeout: :infinity), semester}
      end)

    {:noreply, socket}
  end

  def handle_event("hover_attendance", %{"data_id" => data_id}, socket) do
    {:noreply, assign(socket, :visible, data_id)}
  end

  def mount(_params, %{"user_id" => user_id, "token" => token, "semester" => semester}, socket) do
    token = handle_api_token(socket, token)

    frequency = handle_cache_data(user_id, "frequency")

    stats =
      case handle_cache_data(user_id, "attendance-stats") do
        :load -> []
        stats -> stats
      end

    socket =
      socket
      |> assign(:attendance, [])
      |> assign(:stats, stats)
      |> assign(:frequency, [])
      |> assign(:loadings, [])
      |> assign(:token, token)
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:visible, nil)
      |> assign(:login_required, false)
      |> assign(:page_title, "Attendance")
      |> create_fetcher(user_id, frequency, :frequency, fn ->
        SnakeArgs.from_params(:fetchers, :fetch_attendance_frequency, [token])
        |> python!(python_timeout: :infinity)
      end)

    {:ok, socket}
  end
end
