defmodule ElixirusWeb.Plug.PutTokenCookie do
  @moduledoc """
  Reads a user_details cookie and puts user_details into session
  """
  alias Elixirus.TokenWorker
  import Plug.Conn

  def init(_) do
    %{}
  end

  def call(conn, _opts) do
    conn = fetch_cookies(conn)

    token = conn.cookies["api_token"]

    conn =
      case conn.cookies["calendar_id"] do
        nil -> conn
        calendar -> put_session(conn, :calendar_id, calendar)
      end

    user_id =
      conn.cookies |> Map.get("user_id", UUID.uuid4())

    {_, month, _} = Date.to_erl(Date.utc_today())

    semester =
      if month >= 2 and month < 9 do
        "1"
      else
        "0"
      end

    case token do
      nil ->
        conn
        |> put_session(:token, %{})
        |> put_session(:user_id, user_id)
        |> put_session(:semester, semester)

      token ->
        token = Plug.Conn.Query.decode(token)

        GenServer.call(
          TokenWorker,
          {:extend_lifetime, token |> Map.keys() |> Enum.at(0)},
          :infinity
        )

        conn
        |> put_session(:token, token)
        |> put_session(:user_id, user_id)
        |> put_session(:semester, semester)
    end
  end
end
