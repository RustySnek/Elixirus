defmodule Elixirus.Types.Period do
  @moduledoc false
  @type t :: %__MODULE__{
          subject: String.t(),
          teacher_and_classroom: String.t(),
          date: String.t(),
          date_from: String.t(),
          date_to: String.t(),
          weekday: String.t(),
          info: map(),
          number: non_neg_integer(),
          next_recess_from: String.t() | nil,
          next_recess_to: String.t() | nil
        }

  defstruct [
    :subject,
    :teacher_and_classroom,
    :date,
    :date_from,
    :date_to,
    :weekday,
    :info,
    :number,
    :next_recess_from,
    :next_recess_to
  ]
end
