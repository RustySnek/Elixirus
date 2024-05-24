defmodule ElixirusWeb.StudentLive.AcademicsLive.Attendance do
  use ElixirusWeb, :live_view

  import ElixirusWeb.Helpers
  import Elixirus.Python.SnakeWrapper

  import Phoenix.UI.Components.Tooltip
  import Phoenix.UI.Components.Typography

  def handle_async(:load_frequency, {:ok, frequency}, socket) do
    socket =
      case frequency do
        {:ok, freq} ->
          freq =
            freq
            |> Tuple.to_list()
            |> Enum.map(
              &((&1 * 1000)
                |> round()
                |> Kernel./(10))
            )

          cache_and_ttl_data(socket.assigns.user_id, "frequency", freq, 10)

          socket
          |> assign(:frequency, freq)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))

        %{:token_error => message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        %{:error => message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_async(:load_attendance, {:ok, {attendance, semester}}, socket) do
    socket =
      case attendance do
        {:ok, attendance, stats} ->
          attendance =
            attendance
            |> Enum.chunk_by(&Map.get(&1, ~c"date"))

          cache_and_ttl_data(socket.assigns.user_id, "#{semester}-attendance", attendance, 10)
          cache_and_ttl_data(socket.assigns.user_id, "attendance-stats", stats, 10)

          socket
          |> assign(:attendance, attendance)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :attendance))
          |> assign(:stats, stats)

        %{:token_error => message} ->
          assign(socket, :login_required, true)
          |> put_flash(:error, message)
          |> push_event("require-login", %{})

        %{:error => message} ->
          put_flash(socket, :error, message)
      end

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"semester" => semester} = _params, socket) do
    attendance = handle_cache_data(socket.assigns.user_id, "#{semester}-attendance")

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:attendance, [])
      |> create_fetcher(attendance, :attendance, fn ->
        {python(:helpers, :fetch_all_attendance, [socket.assigns.token, semester, true]),
         semester}
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
      |> create_fetcher(frequency, :frequency, fn ->
        python(:helpers, :fetch_attendance_frequency, [token])
      end)

    {:ok, socket}
  end
end
