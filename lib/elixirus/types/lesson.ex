defmodule Elixirus.Types.Lesson do
  @moduledoc false
  @type t :: %__MODULE__{
          subject: String.t(),
          teacher: String.t(),
          topic: String.t(),
          z_value: String.t(),
          attendance_symbol: String.t(),
          attendance_href: String.t(),
          lesson_number: non_neg_integer(),
          weekday: String.t(),
          date: String.t()
        }

  defstruct [
    :subject,
    :teacher,
    :topic,
    :z_value,
    :attendance_symbol,
    :attendance_href,
    :lesson_number,
    :weekday,
    :date
  ]
end
