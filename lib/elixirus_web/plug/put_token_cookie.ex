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
    user_id = conn.cookies["user_id"]

    semester =
      case conn.cookies["semester"] do
        nil -> 0
        sem -> Plug.Conn.Query.decode(sem)
      end

    case {cookie, conn.cookies["username"]} do
      {cookie, username} when cookie == nil or username == nil ->
        conn |> put_session(:semester, semester) |> put_session(:token, %{"not:found": []})

      {cookie, username} ->
        conn
        |> put_session(:token, Plug.Conn.Query.decode(cookie))
        |> put_session(:username, username)
        |> put_session(:user_id, user_id)
        |> put_session(:semester, semester)
    end
  end
end
