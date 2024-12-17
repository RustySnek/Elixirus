defmodule ElixirusWeb.StudentLive.Refresh do
  use ElixirusWeb, :live_view
  import ElixirusWeb.Helpers, only: [purge_user_cache: 1]

  def mount(_params, %{"user_id" => user_id}, socket) do
    purge_user_cache(user_id)
    {:ok, push_navigate(socket, to: ~p"/")}
  end

  def render(assigns) do
    ~H"""
    <h1>cache cleared</h1>
    """
  end
end
