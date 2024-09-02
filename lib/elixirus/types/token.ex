defmodule Elixirus.Types.Token do
  @moduledoc false
  defstruct [
    :API_Key,
    :csrf_token,
    :oauth
  ]

  @type t :: %__MODULE__{
          API_Key: String.t(),
          csrf_token: String.t(),
          oauth: String.t()
        }
end
