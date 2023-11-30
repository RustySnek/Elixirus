defmodule ElixirusWeb.Plug.PutTokenCookie do
  @moduledoc """
  Reads a user_details cookie and puts user_details into session
  """
  import Plug.Conn
  import Phoenix.Controller, only: [redirect: 2]

  def init(_) do
    %{}
  end

  def call(conn, _opts) do
    conn = fetch_cookies(conn)

    cookie = conn.cookies["api_token"]

    case cookie do
      nil ->
        conn |> redirect(to: "/")

      _ ->
        conn |> put_session(:api_token, Plug.Conn.Query.decode(cookie))
    end
  end
end
