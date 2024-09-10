defmodule Elixirus.Types.NotificationIds do
  @moduledoc false
  defstruct [
    :attendance,
    :messages,
    :grades,
    :announcements,
    :schedule,
    :homework
  ]

  @type t :: %__MODULE__{
          attendance: list(String.t()),
          messages: list(String.t()),
          grades: list(String.t()),
          announcements: list(String.t()),
          schedule: list(String.t()),
          homework: list(String.t())
        }
end
