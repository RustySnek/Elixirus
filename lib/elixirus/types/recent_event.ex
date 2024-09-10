defmodule Elixirus.Types.RecentEvent do
  @moduledoc false
  defstruct [
    :date_added,
    :type,
    :data
  ]

  @type t() :: %__MODULE__{
          date_added: String.t(),
          type: String.t(),
          data: String.t()
        }
end
