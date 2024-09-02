defmodule ElixirusWeb.StudentLive.AcademicsLive.Homework do
  require Logger
  use ElixirusWeb, :live_view
  use ElixirusWeb.SetSemesterLive
  import Venomous
  alias Venomous.SnakeArgs
  import ElixirusWeb.Helpers

  import Heroicons
  alias ElixirusWeb.Modal

  import ElixirusWeb.Components.Loadings
  @asyncs [:load_details, :load_homework]

  def fetch_homework_details(token, id) do
    SnakeArgs.from_params(:fetchers, :fetch_homework_details, [token, id])|>python!(python_timeout: :infinity)
  end

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_details, {:ok, details}, socket) do
    socket =
      case match_basic_errors(socket, details, @asyncs) do
        {:ok, details} ->
          assign(socket, :details, details)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_homework, {:ok, homework}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, homework, @asyncs) do
        {:ok, homework} ->
          cache_and_ttl_data(user_id, "homework", homework, 15)
          assign(socket, :homework, homework |> Enum.reverse())

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("wipe_details", _params, socket) do
    {:noreply, assign(socket, :details, %{})}
  end

  def handle_event("view_homework", %{"homework_id" => hw_id}, socket) do
    token = socket.assigns.token

    socket =
      socket
      |> start_async(:load_details, fn -> fetch_homework_details(token, hw_id) end)

    {:noreply, socket}
  end

  defp days_to_color(days) do
    cond do
      days < 0 -> "text-red-600"
      days > 0 -> "text-green-600"
      true -> "text-yellow-600"
    end
  end

  defp stringify_days(days_left) do
    cond do
      days_left < 0 -> "Late by #{abs(days_left)} days!"
      days_left > 0 -> "Days left: #{days_left}"
      true -> "Due to Today!"
    end
  end

  defp due_to_diff_in_days(due_to) do
    today = warsaw_now() |> DateTime.to_date()
    date = due_to |> String.split(" ") |> hd() |> Date.from_iso8601!()
    Date.diff(date, today)
  end

  def mount(
        _params,
        %{"user_id" => user_id, "token" => api_token, "semester" => semester},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)

    monday = this_weeks_monday() |> Date.add(-14)
    next_monday = monday |> Date.add(14) |> Calendar.strftime("%Y-%m-%d")
    monday = monday |> Calendar.strftime("%Y-%m-%d")

    homework = handle_cache_data(user_id, "homework")

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:login_required, false)
      |> assign(:homework, [])
      |> assign(:loadings, [])
      |> assign(:details, %{})
      |> assign(:page_title, "Homework")
      |> create_fetcher(homework, :homework, fn ->
        SnakeArgs.from_params(:fetchers, :fetch_homework, [api_token, monday, next_monday])|>python!(python_timeout: :infinity)
      end)

    {:ok, socket}
  end
end
