defmodule Elixirus.Types.Grade do
  @moduledoc false
  defstruct [
    :title,
    :grade,
    :counts,
    :date,
    :href,
    :desc,
    :semester,
    :category,
    :teacher,
    :weight
  ]

  @type t :: %__MODULE__{
          title: String.t(),
          grade: String.t(),
          counts: boolean(),
          date: String.t(),
          href: String.t(),
          desc: String.t(),
          semester: non_neg_integer(),
          category: String.t(),
          teacher: String.t(),
          weight: non_neg_integer()
        }
end
