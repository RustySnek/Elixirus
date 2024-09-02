defmodule Elixirus.Types.Homework do
  @moduledoc false
  @type t() :: %__MODULE__{
          lesson: String.t(),
          teacher: String.t(),
          subject: String.t(),
          category: String.t(),
          task_date: String.t(),
          completion_date: String.t(),
          href: String.t()
        }

  defstruct [
    :lesson,
    :teacher,
    :subject,
    :category,
    :task_date,
    :completion_date,
    :href
  ]
end
