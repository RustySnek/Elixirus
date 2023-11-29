defmodule ElixirusWeb.PageController do
  use ElixirusWeb, :controller

  def set_token(conn, %{"token" => token}) do
    conn
    |> put_resp_cookie("api_token", token,
      secure: true,
      http_only: true,
      same_site: "strict",
      path: "/"
    )
    |> send_resp(200, "{}")
  end

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false)
  end
end
