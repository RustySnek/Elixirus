defmodule ElixirusWeb.StudentLive.Subjects do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper

  import ElixirusWeb.Helpers
  alias ElixirusWeb.LoginModal

  def handle_params(params, _uri, socket) do
    hide_empty =
      case params |> Map.get("hide_empty", false) do
        "true" -> true
        "false" -> false
        _ -> false
      end

    query = params |> Map.get("query", "")
    grades = socket.assigns.grades
    keys = grades |> Map.keys()

    keys =
      case hide_empty do
        false -> keys
        _ -> remove_empty(keys, grades)
      end
      |> search_grades(query)

    shown = grades |> Map.take(keys)

    socket =
      socket
      |> assign(:query, query)
      |> assign(:hide_empty, hide_empty)
      |> assign(:shown_grades, shown)

    {:noreply, socket}
  end

  defp remove_empty(keys, grades) do
    keys |> Enum.filter(fn subject -> Map.get(grades, subject) != [] end)
  end

  defp search_grades(keys, query) do
    if query == "" do
      keys
    end

    keys
    |> Enum.filter(fn subject ->
      subject
      |> to_string()
      |> String.downcase()
      |> String.contains?(String.downcase(query))
    end)
  end

  def handle_event("search_grades", %{"query" => query} = params, socket) do
    grades = socket.assigns.grades
    keys = grades |> Map.keys()

    hide_empty =
      case Map.get(params, "hide_empty", false) do
        "on" -> true
        _ -> false
      end

    keys =
      case hide_empty do
        false -> keys
        _ -> remove_empty(keys, grades)
      end
      |> search_grades(query)

    shown = grades |> Map.take(keys)

    socket =
      socket
      |> assign(:query, query)
      |> assign(:hide_empty, hide_empty)
      |> assign(:shown_grades, shown)

    query_params = %{query: query, hide_empty: hide_empty}

    socket =
      push_patch(socket, to: ~p"/student/grades?#{query_params}")

    {:noreply, socket}
  end

  def fetch_all_grades(token, semester) do
    python(:helpers, :fetch_all_grades, [token, semester])
  end

  def handle_async(:load_grades, {:ok, grades}, socket) do
    socket =
      case grades do
        {:ok, grades} ->
          keys = grades |> Map.keys()

          keys =
            case socket.assigns.hide_empty do
              true -> remove_empty(keys, grades)
              _ -> keys
            end
            |> search_grades(socket.assigns.query)

          shown = grades |> Map.take(keys)

          socket
          |> assign(:grades, grades)
          |> assign(:shown_grades, shown)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(_params, %{"semester" => semester, "token" => api_token}, socket) do
    api_token =
      case api_token |> Map.keys() do
        [] ->
          case Map.get(socket.assigns, :token) do
            nil -> ""
            token -> token
          end

        token ->
          token |> hd() |> to_charlist()
      end

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:login_required, false)
      |> assign(:semester, semester)
      |> assign(:grades, %{})
      |> assign(:shown_grades, %{})
      |> start_async(:load_grades, fn -> fetch_all_grades(api_token, semester) end)

    {:ok, socket}
  end
end

