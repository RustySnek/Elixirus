defmodule ElixirusWeb.StudentLive.Subjects do
  require Logger
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view
  import Venomous
  alias Venomous.SnakeArgs
  import ElixirusWeb.Components.Loadings
  import ElixirusWeb.Helpers

  @default_params %{
    query: "",
    hide_empty: "false",
    sort_grades: "newest",
    grade_query: ""
  }
  @asyncs [:load_grades]

  defp assign_averages(socket, grades) do
    grade_averages =
      Enum.map(grades, fn {subject, grades} ->
        {subject, count_average(grades)}
      end)
      |> Map.new()

    semester_average =
      grade_averages
      |> Map.values()
      |> Enum.reduce(0, fn avg, acc -> acc + avg end)
      |> Kernel./(
        Enum.reject(grade_averages |> Map.values(), &(&1 == 0))
        |> Enum.count()
        |> max(1)
      )

    socket
    |> assign(:grade_averages, grade_averages)
    |> assign(:semester_average, semester_average)
  end

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
          |> Enum.filter(
            &(&1
              |> to_string()
              |> String.downcase()
              |> String.contains?(String.downcase(query)))
          ) !=
            []
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

  def _sort_grade_by_weight_value(grade) do
    if grade.counts == false do
      0
    else
      value =
        grade.value

      weight =
        grade.weight

      value * weight
    end
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
          &Map.get(&1, :weight),
          :desc
        )

      "value" ->
        grades
        |> Enum.sort_by(
          &(&1 |> Map.get(:counts) |> Kernel.==(true) && &1 |> Map.get(:value)),
          :desc
        )

      "weighed_value" ->
        grades
        |> Enum.sort_by(
          &_sort_grade_by_weight_value(&1),
          :desc
        )

      _ ->
        grades
    end
  end

  def handle_event("view_grade", %{"grade_id" => id, "subject" => subject}, socket) do
    {:noreply,
     push_navigate(socket,
       to: ~p"/student/subjects/#{subject}?grade_id=#{id}&semester=#{socket.assigns.semester}"
     )}
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

    query_params = %{
      query: query,
      hide_empty: hide_empty,
      sort_grades: sort_grades,
      grade_query: grades_query
    }

    socket =
      socket
      |> assign(:shown_grades, shown)
      |> assign(:query_params, query_params)
      |> push_patch(to: ~p"/student/subjects?#{query_params}")

    {:noreply, socket}
  end

  def fetch_all_grades(client, semester) do
    {SnakeArgs.from_params(:elixirus, :grades, [client, semester])
     |> python!(), semester}
  end

  def handle_async(task, {:exit, _reason}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_grades, {:ok, {grades, semester}}, socket) do
    query = socket.assigns.query

    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, grades, @asyncs) do
        {:ok, [grades, semester_grades]} ->
          keys = grades |> Map.keys()
          semester_grades = sort_gpas(semester_grades)

          keys =
            keys |> search_subjects(query)

          shown = grades |> Map.take(keys)

          cache_and_ttl_data(user_id, "semester_grades", semester_grades, 15)
          cache_and_ttl_data(user_id, "#{semester}-grades", grades, 15)

          socket
          |> assign(:grades, grades)
          |> assign(:shown_grades, shown)
          |> assign(:semester_grades, semester_grades)
          |> assign_averages(grades)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def mount(
        _params,
        %{"semester" => semester, "token" => token, "user_id" => user_id},
        socket
      ) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    data = handle_cache_data(user_id, "#{semester}-grades")

    socket =
      socket
      |> assign(:client, client)
      |> assign(:user_id, user_id)
      |> assign(:grades, nil)
      |> assign(:semester_grades, %{})
      |> assign(:semester_average, 0.0)
      |> assign(:shown_grades, %{})
      |> assign(:query_params, @default_params)
      |> assign(:page_title, "Subjects")

    socket =
      case data do
        :load ->
          socket
          |> start_async(:load_grades, fn -> fetch_all_grades(client, semester) end)

        data ->
          socket |> assign(:grades, data) |> assign(:shown_grades, data) |> assign_averages(data)
      end

    {:ok, assign(socket, :semester, semester)}
  end
end
