defmodule ElixirusWeb.StudentLive.Attendance do
  use ElixirusWeb, :live_view
  use ElixirusWeb.LoginHandler
  import ElixirusWeb.Helpers
  import Elixirus.PythonWrapper
  import ElixirusWeb.Components.Loadings
  alias ElixirusWeb.LoginModal
  import Phoenix.UI.Components.Tooltip
  import Phoenix.UI.Components.Typography

  def fetch_attendance(socket) do
    python(:helpers, :fetch_attendance, [socket.assigns.token, socket.assigns.semester])
  end

  def fetch_frequency(socket) do
    python(:helpers, :fetch_attendance_frequency, [socket.assigns.token])
  end

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

          Cachex.put(:elixirus_cache, socket.assigns.user_id <> "frequency", freq)

          Cachex.expire(
            :elixirus_cache,
            socket.assigns.user_id <> "frequency",
            :timer.minutes(5)
          )

          socket
          |> assign(:frequency, freq)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_attendance, {:ok, attendance}, socket) do
    socket =
      case attendance do
        {:ok, attendance} ->
          attendance =
            attendance
            |> Enum.chunk_by(&Map.get(&1, ~c"date"))

          Cachex.put(
            :elixirus_cache,
            socket.assigns.user_id <> "#{socket.assigns.semester}-attendance",
            attendance
          )

          Cachex.expire(
            :elixirus_cache,
            socket.assigns.user_id <> "#{socket.assigns.semester}-attendance",
            :timer.minutes(5)
          )

          socket |> assign(:attendance, attendance)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_event("change_semester", %{"semester" => semester} = _params, socket) do
    attendance = handle_cache_data(socket.assigns.user_id, "#{semester}-attendance")

    socket =
      socket
      |> assign(:semester, semester)

    socket =
      case attendance do
        :load ->
          socket
          |> assign(:attendance, [])
          |> start_async(:load_attendance, fn -> fetch_attendance(socket) end)

        attendance ->
          assign(socket, :attendance, attendance)
      end

    {:noreply, socket}
  end

  def handle_event("hover_attendance", %{"data_id" => data_id}, socket) do
    {:noreply, assign(socket, :visible, data_id)}
  end

  def mount(_params, %{"user_id" => user_id, "token" => token, "semester" => semester}, socket) do
    token = handle_api_token(socket, token)

    socket =
      socket
      |> assign(:attendance, [])
      |> assign(:frequency, [])
      |> assign(:token, token)
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:visible, nil)
      |> assign(:login_required, false)

    attendance = handle_cache_data(user_id, "#{semester}-attendance")
    frequency = handle_cache_data(user_id, "frequency")

    socket =
      case attendance do
        :load -> socket |> start_async(:load_attendance, fn -> fetch_attendance(socket) end)
        attendance -> socket |> assign(:attendance, attendance)
      end

    socket =
      case frequency do
        :load -> socket |> start_async(:load_frequency, fn -> fetch_frequency(socket) end)
        freq -> socket |> assign(:frequency, freq)
      end

    {:ok, socket}
  end

  defp attendance_color(symbol) do
    case symbol do
      "nb" -> "border-red-500"
      "u" -> "border-fuchsia-600"
      "sp" -> "border-amber-600"
      "zw" -> "border-zinc-700"
      _ -> "border-fuchsia-600"
    end
  end
end
