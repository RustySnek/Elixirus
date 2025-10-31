defmodule ElixirusWeb.StudentLive.StudentInfo do
  require Logger
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view

  import ElixirusWeb.Helpers
  import Venomous
  alias Venomous.SnakeArgs
  import Heroicons

  @asyncs [:load_student_info]

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_student_info, {:ok, student_info}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, student_info, @asyncs) do
        {:ok, student_info} ->
          cache_and_ttl_data(user_id, "student_info", student_info, 30)

          socket
          |> assign(:student_info, student_info)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :student_info))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

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

    student_info = handle_cache_data(user_id, "student_info")

    socket =
      socket
      |> assign(:semester, semester)
      |> assign(:page_title, "Student Information")
      |> assign(:student_info, student_info || nil)
      |> assign(:loadings, [])
      |> assign(:user_id, user_id)
      |> assign(:client, client)
      |> create_fetcher(user_id, student_info, :student_info, fn ->
        SnakeArgs.from_params(:elixirus, :student_info, [client])
        |> python!()
      end)

    {:ok, socket}
  end
end

