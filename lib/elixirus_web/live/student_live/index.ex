defmodule ElixirusWeb.StudentLive.Index do
  alias ElixirusWeb.LoginModal
  use ElixirusWeb, :live_view
  alias Phoenix.LiveView.AsyncResult
  import Heroicons
  import ElixirusWeb.Helpers
  use ElixirusWeb.LoginHandler

  def fetch_data(socket, api_token, semester) do
    socket
    |> assign(:loading_grades, AsyncResult.loading())
    |> start_async(:load_grades, fn ->
      {:ok, pid} = :python.start()

      get_grades = :python.call(pid, :overview, :handle_overview_grades, [api_token, semester])
      :python.stop(pid)
      get_grades
    end)
    |> assign(:loading_attendance, AsyncResult.loading())
    |> start_async(:load_attendance, fn ->
      {:ok, pid} = :python.start()

      get_attendance =
        :python.call(pid, :overview, :handle_overview_attendance, [api_token, semester])

      :python.stop(pid)
      get_attendance
    end)
  end

  def handle_event("retrieve_local_storage", %{"semester" => semester}, socket) do
    socket =
      socket
      |> assign(:semester, semester)
      |> fetch_data(socket.assigns.token, semester)

    {:noreply, socket}
  end

  def handle_async(:load_attendance, {:ok, attendance}, socket) do
    socket =
      case attendance do
        {:ok, attendance} ->
          socket
          |> put_flash(:info, "Loaded attendance!")
          |> assign(:loading_attendance, AsyncResult.ok(%AsyncResult{}, :ok))
          |> assign(:attendance, attendance)

        _ ->
          socket |> assign(:login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_grades, {:ok, grades}, socket) do
    socket =
      case grades do
        {:ok, grades} ->
          socket
          |> put_flash(:info, "Loaded grades!")
          |> assign(:loading_grades, AsyncResult.ok(%AsyncResult{}, :ok))
          |> assign(:grades, grades)

        _ ->
          socket |> assign(:login_required, true)
      end

    {:noreply, socket}
  end

  def mount(
        _params,
        %{"token" => api_token, "user_id" => user_id, "semester" => semester},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)

    {_, _, month} = Date.to_erl(Date.utc_today())

    semester =
      cond do
        month >= 2 and month < 9 -> "1"
        true -> "0"
      end

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:semester, semester)
      |> assign(:login_required, false)
      |> assign(:grades, [])
      |> assign(:attendance, [])
      |> assign(:page_title, "Home")
      |> fetch_data(api_token, semester)

    {:ok, socket}
  end
end
