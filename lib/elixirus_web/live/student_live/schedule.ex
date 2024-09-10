defmodule ElixirusWeb.StudentLive.Schedule do
  require Logger
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view

  use ElixirusWeb.SetSemesterLive
  import Venomous
  alias Venomous.SnakeArgs

  import ElixirusWeb.Helpers
  alias ElixirusWeb.Modal

  @asyncs [:load_schedule]

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

  def handle_params(%{"href" => href}, _uri, socket) do
    {:noreply, assign(socket, :event_href, href)}
  end

  def handle_params(_params, _uri, socket), do: {:noreply, socket}

  def mount(_params, %{"token" => token, "user_id" => user_id, "semester" => semester}, socket) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    {{year, month, _day}, _time} = :calendar.local_time()

    schedule = handle_cache_data(user_id, "#{year}-#{month}-schedule")

    socket =
      socket
      |> assign(:client, client)
      |> assign(:event_href, nil)
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:schedule, %{})
      |> assign(:loadings, [])
      |> assign(:year, year)
      |> assign(:month, month)
      |> assign(:page_title, "Schedule #{year}-#{month}")
      |> create_fetcher(user_id, schedule, :schedule, fn ->
        {SnakeArgs.from_params(:elixirus, :schedule, [client, year, month, true])
         |> python!(), year, month}
      end)

    {:ok, socket}
  end
end
