defmodule Elixirus.Types.StudentInformation do
  @moduledoc false
  defstruct [
    :name,
    :class_name,
    :number,
    :tutor,
    :school,
    :lucky_number
  ]

  @type t :: %__MODULE__{
          name: String.t(),
          class_name: String.t(),
          number: non_neg_integer(),
          tutor: String.t(),
          school: String.t(),
          lucky_number: non_neg_integer() | String.t()
        }
end
