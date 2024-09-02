defmodule Elixirus.Types.Announcement do
  @moduledoc false
  defstruct [
    :title,
    :author,
    :description,
    :date
  ]

  @type t :: %__MODULE__{
          title: String.t(),
          author: String.t(),
          description: String.t(),
          date: String.t()
        }
end
