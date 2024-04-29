defmodule ElixirusWeb.PageController do
  use ElixirusWeb, :controller

  def set_semester(conn, %{"semester" => semester}) do
    conn
    |> put_resp_cookie("semester", semester,
      http_only: true,
      max_age: 3_600 * 24 * 7,
      same_site: "strict",
      path: "/"
    )
    |> send_resp(200, "{}")
  end

  def set_token(conn, %{"token" => token, "user_id" => user_id}) do
    conn
    |> put_resp_cookie("api_token", token,
      max_age: 3_600 * 24 * 7,
      secure: true,
      http_only: true,
      same_site: "strict",
      path: "/"
    )
    |> put_resp_cookie("user_id", user_id,
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
