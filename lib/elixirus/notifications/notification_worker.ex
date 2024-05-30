defmodule Elixirus.Notifications.NotificationWorker do
  @moduledoc false
  alias Elixirus.Notifications.NotificationsSupervisor
  use HTTPoison.Base

  use GenServer
  require Logger

  def start_link(args) do
    GenServer.start_link(__MODULE__, args)
  end

  def init([notification, token]) do
    state = {notification, token}
    {:ok, state, {:continue, :push_notification}}
  end

  defp counts_emoji(true), do: "✅"
  defp counts_emoji(false), do: "❌"

  defp grade_sign_encode(grade) do
    grade |> String.replace(~r/[+]/, "%2B") |> String.replace(~r/[-]/, "%2D")
  end

  defp parse_notification(:grades, grade) do
    body =
      "#{grade.category} - #{grade.desc}\n#{grade.grade} #{grade.title}\nWeight: #{grade.weight}\nCounts: #{grade.counts |> counts_emoji()}"

    headers = [
      {"Click",
       "https://elixirus.rustysnek.xyz/student/academics/subjects/#{grade.title}?grade_id=#{grade.href}&semester=#{grade.semester}"},
      {"Icon",
       "https://placehold.co/200x200/35123b/FFFFFF/png/?font=montserrat&text=#{grade.grade |> grade_sign_encode}"},
      {"Title", "#{grade.grade} #{grade.title}"},
      {"Tags", "closed_book"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:attendance, attendance) do
    body =
      "#{attendance.subject}: #{attendance.type}\nTopic: #{attendance.topic}\nTeacher: #{attendance.teacher}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/academics/attendance"},
      {"Icon",
       "https://placehold.co/200x200/35123b/FFFFFF/png/?font=montserrat&text=#{attendance.symbol}"},
      {"Title", "#{attendance.symbol} - #{attendance.subject}"},
      {"Tags", "x"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:messages, message) do
    body = "#{message.title}\n - #{message.author}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/communication/messages"},
      {"Title", "Received a message from #{message.author}!"},
      {"Icon", "https://elixirus.rustysnek.xyz/images/snake_envelope.jpg"},
      {"Tags", "envelope"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:announcements, announcement) do
    body = "#{announcement.description}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/communication/announcements"},
      {"Title", "#{announcement.title}"},
      {"Icon", "https://elixirus.rustysnek.xyz/images/horn.png"},
      {"Tags", "postal_horn"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:schedule, event) do
    body = "#{event.data}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/scheduling/schedule"},
      {"Title", "#{event.type}"},
      {"Icon", "https://placehold.co/200x200/35123b/FFFFFF/png/?font=montserrat&text=!"},
      {"Tags", "calendar"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:homework, homework) do
    body =
      "#{homework.category}\n#{homework.subject}\nDue to: #{homework.completion_date}\nTeacher: #{homework.teacher}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/academics/homework"},
      {"Title", "#{homework.lesson}: #{homework.subject}"},
      {"Tags", "pencil"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  def handle_continue(:push_notification, state) do
    {{key, elements}, token} = state

    elements
    |> Enum.map(&parse_notification(key, &1))
    |> Enum.each(fn {body, headers} ->
      notify =
        post(
          "https://ntfy.sh/#{token}",
          body,
          headers
        )

      case notify do
        {:ok, %HTTPoison.Response{status_code: 200, body: _body}} ->
          Logger.info("Pushed notification #{token}")

        {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
          Logger.warning("Status code: #{status_code}\n #{body |> inspect}")

        {:error, %HTTPoison.Error{reason: reason}} ->
          Logger.error("Failed to send notification")
          reason |> inspect() |> Logger.error()
      end
    end)

    NotificationsSupervisor.terminate_child(self())
    {:stop, :terminate, state}
  end
end
