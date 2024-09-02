defmodule Elixirus.Types.Message do
  @moduledoc false
  @type t :: %__MODULE__{
          author: String.t(),
          title: String.t(),
          date: String.t(),
          href: String.t(),
          unread: boolean(),
          has_attachment: boolean()
        }

  defstruct [
    :author,
    :title,
    :date,
    :href,
    :unread,
    :has_attachment
  ]
end
