defmodule ElixirusWeb.StudentLive.Grades.Subject do
  use ElixirusWeb, :live_view
  import ElixirusWeb.Helpers

  def mount(
        %{"subject" => subject} = params,
        %{"semester" => semester, "token" => api_token, "user_id" => user_id},
        socket
      ) do
    api_token = handle_api_token(socket, api_token)
    grade_id = Map.get(params, "grade_id", nil)

    grades =
      case Cachex.get(:elixirus_cache, user_id <> "grades") do
        {:ok, grades} -> grades
        _ -> nil
      end

    socket =
      case grades do
        nil ->
          push_navigate(socket, to: "/student/grades")

        _ ->
          socket
          |> assign(:token, api_token)
          |> assign(:grades, grades)
          |> assign(:subject, subject)
          |> assign(:shown_grade, grade_id)
          |> assign(:semester, semester)
      end

    {:ok, socket}
  end
end
