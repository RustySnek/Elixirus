defmodule ElixirusWeb.StudentLive.Subjects do
  use ElixirusWeb, :live_view
  import Elixirus.PythonWrapper
  import Heroicons
  import ElixirusWeb.Components.Loadings
  import ElixirusWeb.Helpers
  alias ElixirusWeb.LoginModal

  def handle_params(params, _uri, socket) do
    hide_empty =
      case params |> Map.get("hide_empty", false) do
        "true" -> true
        _ -> false
      end

    sort_grades = params |> Map.get("sort_grades", "newest")
    query = params |> Map.get("query", "")
    grades_query = params |> Map.get("grade_query", "")
    grades = socket.assigns.grades
    keys = grades |> Map.keys()

    keys =
      keys
      |> search_subjects(query)

    # |> search_grades(grades_query)
    shown = grades |> Map.take(keys) |> search_grades(grades_query)

    socket =
      socket
      |> assign(:sort_grades, sort_grades)
      |> assign(:query, query)
      |> assign(:grade_query, grades_query)
      |> assign(:hide_empty, hide_empty)
      |> assign(:shown_grades, shown)

    {:noreply, socket}
  end

  defp search_grades(subjects, query) do
    if query == "" do
      subjects
    end

    subjects
    |> Enum.map(fn {subject, grades} ->
      filtered_grades =
        grades
        |> Enum.filter(fn grade ->
          grade
          |> Map.values()
          |> Enum.filter(fn val ->
            val |> to_string() |> String.downcase() |> String.contains?(String.downcase(query))
          end) != []
        end)

      {subject, filtered_grades}
    end)
    |> Enum.into(%{})
  end

  defp search_subjects(keys, query) do
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

  defp sort_grades_by(grades, by) do
    case by do
      "newest" ->
        grades |> Enum.reverse()

      "oldest" ->
        grades

      "weight" ->
        grades
        |> Enum.sort_by(
          fn grade ->
            Map.get(grade, ~c"weight") |> to_string |> String.to_integer()
          end,
          :desc
        )

      "value" ->
        grades
        |> Enum.sort_by(
          fn grade ->
            if Map.get(grade, ~c"counts") == false do
              0
            else
              Map.get(grade, ~c"value") |> to_string |> String.to_float()
            end
          end,
          :desc
        )

      "weighed_value" ->
        grades
        |> Enum.sort_by(
          fn grade ->
            if Map.get(grade, ~c"counts") == false do
              0
            else
              value =
                Map.get(grade, ~c"value")
                |> to_string
                |> String.to_float()

              weight =
                Map.get(grade, ~c"weight")
                |> to_string()
                |> String.to_integer()

              value * weight
            end
          end,
          :desc
        )

      _ ->
        grades
    end
  end

  def handle_event("view_grade", %{"grade_id" => id, "subject" => subject}, socket) do
    {:noreply,
     push_navigate(socket, to: ~p"/student/grades/#{subject}?grade_id=#{id}", replace: true)}
  end

  def handle_event("navigate_students", %{"token" => token, "user_id" => user_id}, socket) do
    socket =
      socket
      |> assign(:token, token)
      |> assign(:login_required, false)
      |> assign(:user_id, user_id)
      |> start_async(:load_grades, fn -> fetch_all_grades(token, socket.assigns.semester) end)

    {:noreply, redirect(socket, to: "/student/grades")}
  end

  def handle_event(
        "query_grades",
        %{"query" => query, "sort_grades" => sort_grades, "grade_query" => grades_query} = params,
        socket
      ) do
    grades = socket.assigns.grades
    keys = grades |> Map.keys()

    hide_empty =
      case Map.get(params, "hide_empty", false) do
        "on" -> true
        _ -> false
      end

    keys =
      keys
      |> search_subjects(query)

    shown = grades |> Map.take(keys) |> search_grades(grades_query)

    socket =
      socket
      |> assign(:sort_grades, sort_grades)
      |> assign(:query, query)
      |> assign(:grade_query, grades_query)
      |> assign(:hide_empty, hide_empty)
      |> assign(:shown_grades, shown)

    query_params = %{
      query: query,
      hide_empty: hide_empty,
      sort_grades: sort_grades,
      grade_query: grades_query
    }

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
            keys |> search_subjects(socket.assigns.query)

          shown = grades |> Map.take(keys)
          Cachex.put(:elixirus_cache, socket.assigns.user_id <> "grades", grades)
          Cachex.expire(:elixirus_cache, socket.assigns.user_id <> "grades", :timer.minutes(5))
          IO.inspect(Cachex.ttl(:elixirus_cache, socket.assigns.user_id))
          IO.inspect(socket.assigns.user_id)

          socket
          |> assign(:grades, grades)
          |> assign(:shown_grades, shown)

        _ ->
          assign(socket, :login_required, true)
      end

    {:noreply, socket}
  end

  def mount(
        _params,
        %{"semester" => semester, "token" => api_token, "user_id" => user_id},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)
    data = handle_cache_data(user_id, "grades")

    socket =
      socket
      |> assign(:token, api_token)
      |> assign(:user_id, user_id)
      |> assign(:login_required, false)
      |> assign(:semester, semester)
      |> assign(:grades, %{})
      |> assign(:shown_grades, %{})

    socket =
      case data do
        :load ->
          socket |> start_async(:load_grades, fn -> fetch_all_grades(api_token, semester) end)

        data ->
          socket |> assign(:grades, data) |> assign(:shown_grades, data)
      end

    {:ok, socket}
  end
end
