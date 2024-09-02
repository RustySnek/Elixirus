defmodule Elixirus.Types.Event do
  @moduledoc false
  defstruct [
    :title,
    :subject,
    :data,
    :day,
    :number,
    :hour,
    :href
  ]

  @type t() :: %__MODULE__{
          title: String.t(),
          subject: String.t(),
          data: map(),
          day: String.t(),
          number: non_neg_integer() | String.t(),
          hour: String.t(),
          href: String.t()
        }
end
