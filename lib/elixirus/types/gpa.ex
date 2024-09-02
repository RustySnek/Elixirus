defmodule Elixirus.Types.Gpa do
  @moduledoc false
  defstruct [
    :semester,
    :gpa,
    :subject
  ]

  @type t :: %__MODULE__{
          semester: non_neg_integer(),
          gpa: float() | String.t(),
          subject: String.t()
        }
end
