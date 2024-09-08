defmodule Elixirus.Types.MessageData do
  @moduledoc false
  @type t :: %__MODULE__{
          author: String.t(),
          title: String.t(),
          date: String.t(),
          content: String.t()
        }

  defstruct [
    :author,
    :title,
    :date,
    :content
  ]
end
