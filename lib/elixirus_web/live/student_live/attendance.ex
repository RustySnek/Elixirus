defmodule ElixirusWeb.StudentLive.Attendance do
  require Logger
  use ElixirusWeb, :live_view

  alias Elixirus.Types.Client
  alias Elixirus.Types.Attendance
  import ElixirusWeb.Helpers
  import Venomous
  alias Venomous.SnakeArgs

  @asyncs [
    :load_frequency,
    :load_subject_frequency,
    :load_attendance
  ]

  def handle_async(:load_subject_frequency, {:ok, freq}, socket) do
    socket =
      case match_basic_errors(socket, freq, @asyncs) do
        {:ok, frequency} ->
          user_id = socket.assigns.user_id

          frequency =
            frequency
            |> Enum.to_list()
            |> Enum.sort_by(fn {_key, value} -> value end)

          cache_and_ttl_data(user_id, "subject_frequency", frequency, 15)

          socket
          |> assign(:subject_frequency, frequency)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :subject_frequency))

        {_err, _msg, socket} ->
          socket
      end

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

    semester =
      case semester |> Integer.parse() do
        :error -> 0
        {semester, _} -> semester
      end

    socket =
      case match_basic_errors(socket, attendance, @asyncs) do
        {:ok, [first, second] = attendance, stats} ->
          attendance = Enum.at(attendance, semester)

          cache_and_ttl_data(user_id, "0-attendance", first, 10)
          cache_and_ttl_data(user_id, "1-attendance", second, 10)
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

  def handle_event("hover_attendance", %{"data_id" => data_id}, socket) do
    {:noreply, assign(socket, :visible, data_id)}
  end

  def handle_params(%{"href" => href}, _uri, socket) do
    {:noreply, assign(socket, :selected, href)}
  end

  def handle_params(_params, _uri, socket), do: {:noreply, assign(socket, :selected, nil)}

  def mount(_params, %{"user_id" => user_id, "token" => token, "semester" => semester}, socket) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    frequency = handle_cache_data(user_id, "frequency")
    subject_frequency = handle_cache_data(user_id, "subject_frequency")

    attendance = handle_cache_data(user_id, "#{semester}-attendance")

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
      |> assign(:subject_frequency, [])
      |> assign(:loadings, [])
      |> assign(:client, client)
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:visible, nil)
      |> assign(:page_title, "Attendance")
      |> create_fetcher(user_id, frequency, :frequency, fn ->
        SnakeArgs.from_params(:elixirus, :frequency, [client])
        |> python!()
      end)
      |> create_fetcher(user_id, subject_frequency, :subject_frequency, fn ->
        SnakeArgs.from_params(:elixirus, :subject_frequency, [client])
        |> Venomous.python!(timeout: 15_000)
      end)
      |> create_fetcher(user_id, attendance, :attendance, fn ->
        {SnakeArgs.from_params(:elixirus, :attendance, [client, true])
         |> python!(), semester}
      end)

    {:ok, socket}
  end

  defp excursion(true), do: "Yes"
  defp excursion(false), do: "No"

  attr :class, :string, default: ""
  attr :absence, Attendance, required: true
  attr :selected, :boolean, required: true

  defp absence(%{selected: true} = assigns) do
    ~H"""
    <.link
      id="selected-absence"
      phx-hook="highlight_grade"
      patch={~p"/student/attendance"}
      class={"relative px-1 rounded-md bg-fg
      col-span-4 md:col-span-12 w-full brightness-150 transition duration-300 order-last h-fit #{@class}"}
    >
      <h2 class="text-xs"><%= @absence.period %></h2>
      <span class={"
      text-#{attendance_color(@absence.symbol)} 
      opacity-25
      text-xl absolute top-1/2
      left-1/2 -translate-x-1/2
      -translate-y-1/2
      "}>
        <%= @absence.symbol %>
      </span>
      <div class="flex flex-col text-sm">
        <span class={"text-#{attendance_color(@absence.symbol)}"}><%= @absence.type %></span>
        <span><%= @absence.topic %></span>
        <span>School trip: <%= excursion(@absence.excursion) %></span>
        <span class="mb-6"><%= @absence.teacher %></span>
      </div>
      <span class="
        absolute bottom-1 text-xs
      truncate w-full
      "><%= @absence.subject %></span>
    </.link>
    <.absence absence={@absence} selected={false} class="brightness-150" />
    """
  end

  defp absence(%{selected: false} = assigns) do
    ~H"""
    <.link
      patch={~p"/student/attendance/#{@absence.href}"}
      class={"
      transition duration-300
      relative px-1 h-20 min-w-20 
      w-20 rounded-md bg-fg #{@class}
      "}
    >
      <h2 class="text-xs"><%= @absence.period %></h2>
      <span class={"
      text-#{attendance_color(@absence.symbol)} 
      text-xl absolute top-1/2
      left-1/2 -translate-x-1/2
      -translate-y-1/2
      "}>
        <%= @absence.symbol %>
      </span>
      <span class="
      absolute bottom-1 text-xs
      truncate w-full
      "><%= @absence.subject %></span>
    </.link>
    """
  end

  defp colors(freq) do
    cond do
      freq == 100 -> "bg-fuchsia-600"
      freq > 70 -> "bg-green-600"
      freq <= 50 -> "bg-red-600"
      freq <= 70 -> "bg-amber-600"
    end
  end
end
