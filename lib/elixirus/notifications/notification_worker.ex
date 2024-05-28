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

  defp parse_notification(:grades, grade) do
    body =
      "*#{grade.grade}*<sup>#{grade.weight}</sup> #{grade.category}  Average: #{grade.counts |> to_string}  Teacher: #{grade.teacher}"

    headers = [
      {"Click",
       "https://elixirus.rustysnek.xyz/student/academics/subjects/#{grade.title}?grade_id=#{grade.href}&semester=#{grade.semester}"},
      {"Icon", "https://placehold.co/200x200/f904ef/FFFFFF?font=montserrat&text=#{grade.grade}"},
      {"Title", "*#{grade.grade}* - #{grade.title}"},
      {"Tags", "graduation-cap"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:attendance, attendance) do
    body = "#{attendance.subject}  Teacher: #{attendance.teacher}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/academics/attendance"},
      {"Icon",
       "https://placehold.co/200x200/f904ef/FFFFFF?font=montserrat&text=#{attendance.symbol}"},
      {"Title", "*#{attendance.symbol}* - #{attendance.topic}"},
      {"Tags", "red-circle"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:messages, message) do
    body = "#{message.title} - #{message.author}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/communication/messages"},
      {"Title", "Received a new message from #{message.author}!"},
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
      {"Tags", "mega"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:schedule, event) do
    time =
      cond do
        event.number != "unknown" -> event.hour
        event.hour != "unknown" -> event.hour
        true -> ""
      end

    body = "#{event.subject}  #{time}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/scheduling/schedule"},
      {"Title", "#{event.title}"},
      {"Tags", "calendar"},
      {"Markdown", "yes"}
    ]

    {body, headers}
  end

  defp parse_notification(:homework, homework) do
    body =
      "#{homework.category}  Due to: #{homework.completion_date}  Teacher: #{homework.teacher}"

    headers = [
      {"Click", "https://elixirus.rustysnek.xyz/student/scheduling/schedule"},
      {"Title", "#{homework.lesson}: #{homework.subject}"},
      {"Tags", "calendar"},
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
          Logger.info("Pushed notification")

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
