defmodule Elixirus.Types.NotificationData do
  @moduledoc false
  alias Elixirus.Types.RecentEvent
  alias Elixirus.Types.Attendance
  alias Elixirus.Types.Message
  alias Elixirus.Types.Grade
  alias Elixirus.Types.Announcement
  alias Elixirus.Types.Homework

  defstruct [
    :attendance,
    :messages,
    :grades,
    :announcements,
    :schedule,
    :homework
  ]

  @type t :: %__MODULE__{
          attendance: list(Attendance.t()),
          messages: list(Message.t()),
          grades: list(Grade.t()),
          announcements: list(Announcement.t()),
          schedule: list(RecentEvent.t()),
          homework: list(Homework.t())
        }
end
