defmodule Elixirus.Types.Attendance do
  @moduledoc false
  @type t :: %__MODULE__{
          symbol: String.t(),
          href: String.t(),
          semester: non_neg_integer(),
          date: String.t(),
          type: String.t(),
          teacher: String.t(),
          period: non_neg_integer(),
          excursion: boolean(),
          topic: String.t(),
          subject: String.t()
        }

  defstruct [
    :symbol,
    :href,
    :semester,
    :date,
    :type,
    :teacher,
    :period,
    :excursion,
    :topic,
    :subject
  ]
end
