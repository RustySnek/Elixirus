defmodule ElixirusWeb.StudentLive.Homework do
  require Logger
  use ElixirusWeb, :live_view
  use ElixirusWeb.SetSemesterLive
  import Venomous
  alias Venomous.SnakeArgs
  import ElixirusWeb.Helpers

  alias Elixirus.Types.Client
  import Heroicons, only: [window: 1, check: 1]
  alias ElixirusWeb.Modal

  import ElixirusWeb.Components.Loadings
  @asyncs [:load_details, :load_homework]

  def fetch_homework_details(client, id) do
    SnakeArgs.from_params(:elixirus, :homework_details, [client, id])
    |> python!()
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
    {:noreply, push_patch(socket, to: ~p"/student/homework") |> assign(:details, nil)}
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

  def handle_params(%{"href" => id}, _uri, socket) do
    client = socket.assigns.client

    socket =
      socket
      |> start_async(:load_details, fn -> fetch_homework_details(client, id) end)

    {:noreply, socket}
  end

  def handle_params(_params, _uri, socket) do
    {:noreply, socket}
  end

  def mount(
        _params,
        %{"user_id" => user_id, "token" => token, "semester" => semester},
        socket
      ) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    monday = this_weeks_monday()
    start_date = monday |> Date.add(-14) |> Calendar.strftime("%Y-%m-%d")
    end_date = monday |> Date.add(14) |> Calendar.strftime("%Y-%m-%d")

    homework = handle_cache_data(user_id, "homework")

    socket =
      socket
      |> assign(:client, client)
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:homework, [])
      |> assign(:loadings, [])
      |> assign(:details, nil)
      |> assign(:page_title, "Homework")
      |> create_fetcher(user_id, homework, :homework, fn ->
        SnakeArgs.from_params(:elixirus, :homework, [client, start_date, end_date])
        |> python!()
        |> dbg
      end)

    {:ok, socket}
  end
end
