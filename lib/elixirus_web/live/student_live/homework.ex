defmodule ElixirusWeb.StudentLive.Homework do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  import ElixirusWeb.Helpers
  alias ElixirusWeb.LoginModal
  import Heroicons
  alias ElixirusWeb.Modal
  import ElixirusWeb.Components.Loadings

  def fetch_homework(token, start_date, end_date) do
    python(:helpers, :fetch_homework, [token, start_date, end_date])
  end

  def fetch_homework_details(token, id) do
    python(:helpers, :fetch_homework_details, [token, id])
  end

  def handle_async(:load_details, {:ok, details}, socket) do
    socket =
      case details do
        {:ok, details} -> assign(socket, :details, details)
        _ -> assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_async(:load_homework, {:ok, homework}, socket) do
    socket =
      case homework do
        {:ok, homework} ->
          Cachex.put(:elixirus_cache, socket.assigns.user_id <> "homework", homework)
          Cachex.expire(:elixirus_cache, socket.assigns.user_id <> "homework", :timer.minutes(5))
          assign(socket, :homework, homework |> Enum.reverse())

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def handle_event("wipe_details", _params, socket) do
    {:noreply, assign(socket, :details, %{})}
  end

  def handle_event("view_homework", %{"homework_id" => hw_id}, socket) do
    socket =
      socket
      |> start_async(:load_details, fn -> fetch_homework_details(socket.assigns.token, hw_id) end)

    {:noreply, socket}
  end

  def handle_event("navigate_students", %{"token" => token}, socket) do
    socket =
      socket
      |> assign(:token, token)
      |> assign(:login_required, false)

    {:noreply, redirect(socket, to: "/student/homework")}
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

  def mount(_params, %{"user_id" => user_id, "token" => api_token}, socket) do
    api_token =
      case api_token |> Map.keys() do
        [] -> ""
        token -> token |> hd() |> to_charlist()
      end

    monday = this_weeks_monday() |> Date.add(-14)
    next_monday = monday |> Date.add(14) |> Calendar.strftime("%Y-%m-%d")
    monday = monday |> Calendar.strftime("%Y-%m-%d")

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:user_id, user_id)
      |> assign(:login_required, false)
      |> assign(:homework, [])
      |> assign(:details, %{})

    homework = handle_cache_data(user_id, "homework")

    socket =
      case homework do
        :load ->
          socket
          |> start_async(:load_homework, fn -> fetch_homework(api_token, monday, next_monday) end)

        homework ->
          socket |> assign(:homework, homework)
      end

    {:ok, socket}
  end
end
