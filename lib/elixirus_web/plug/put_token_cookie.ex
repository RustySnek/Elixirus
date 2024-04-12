defmodule ElixirusWeb.Plug.PutTokenCookie do
  @moduledoc """
  Reads a user_details cookie and puts user_details into session
  """
  import Plug.Conn

  def init(_) do
    %{}
  end

  def call(conn, _opts) do
    conn = fetch_cookies(conn)

    cookie = conn.cookies["api_token"]

    user_id =
      conn.cookies |> Map.get("user_id", make_ref() |> :erlang.ref_to_list() |> to_string())

    {_, month, _} = Date.to_erl(Date.utc_today())

    semester =
      cond do
        month >= 2 and month < 9 -> "1"
        true -> "0"
      end

    case {cookie, conn.cookies["username"]} do
      {cookie, username} when cookie == nil or username == nil ->
        conn
        |> put_session(:token, %{"not:found": []})
        |> put_session(:user_id, user_id)
        |> put_session(:semester, semester)

      {cookie, username} ->
        conn
        |> put_session(:token, Plug.Conn.Query.decode(cookie))
        |> put_session(:username, username)
        |> put_session(:user_id, user_id)
        |> put_session(:semester, semester)
    end
  end
end
