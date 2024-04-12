defmodule ElixirusWeb.StudentLive.Index do
  alias ElixirusWeb.LoginModal
  use ElixirusWeb, :live_view
  alias Phoenix.LiveView.AsyncResult
  import Heroicons
  import ElixirusWeb.Helpers
  use ElixirusWeb.LoginHandler
  import Elixirus.PythonWrapper

  def fetch_data(socket, api_token, semester) do
    socket
    |> start_async(:load_grades, fn ->
      python(:overview, :handle_overview_grades, [api_token, semester])
    end)
    |> start_async(:load_attendance, fn ->
      python(:overview, :handle_overview_attendance, [api_token, semester])
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

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:login_required, false)
      |> assign(:grades, [])
      |> assign(:attendance, [])
      |> assign(:page_title, "Home")
      |> fetch_data(api_token, semester)

    {:ok, socket}
  end
end
