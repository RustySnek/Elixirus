defmodule Elixirus.Types.Client do
  @moduledoc false
  import Venomous, only: [python!: 1]
  alias Elixirus.Types.Token
  alias Venomous.SnakeArgs

  defstruct [
    :token,
    :proxy
  ]

  @type t :: %__MODULE__{
          token: Token.t(),
          proxy: map()
        }

  defp proxy(nil), do: %{}

  defp proxy(proxy) do
    case System.get_env("USE_PROXY") do
      "yes" -> %{"https" => proxy, "http" => proxy}
      _ -> %{}
    end
  end

  defp proxy, do: proxy(System.get_env("ELIXIRUS_PROXY"))

  @spec get_client(String.t(), String.t()) :: %__MODULE__{} | any()
  def get_client(username, password) do
    SnakeArgs.from_params(:client, :get_client_from_credentials, [username, password, proxy()])
    |> Venomous.python!()
  end

  @spec get_client(String.t()) :: %__MODULE__{} | any()
  def get_client(token) do
    SnakeArgs.from_params(:client, :get_client, [token, proxy()]) |> python!()
  end
end
