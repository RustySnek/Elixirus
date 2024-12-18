defmodule ElixirusWeb.Router do
  import Redirect
  use ElixirusWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {ElixirusWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api_token do
    plug ElixirusWeb.Plug.PutTokenCookie
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  redirect "/", "/student", :permanent

  scope "/", ElixirusWeb do
    pipe_through :browser
    get "/set_token", PageController, :set_token
    get "/set_semester", PageController, :set_semester
    get "/clear_token", PageController, :clear_token

    scope "/student" do
      pipe_through :api_token
      live "/", StudentLive.Index
      live "/refresh", StudentLive.Refresh
      live "/announcements", StudentLive.Announcements
      live "/timetable", StudentLive.Timetable
      live "/schedule", StudentLive.Schedule
      live "/homework", StudentLive.Homework

      scope "/attendance" do
        live "/", StudentLive.Attendance
        live "/subjects", StudentLive.Attendance, :subject_frequency
        live "/:href", StudentLive.Attendance, :view
      end

      scope "/messages" do
        live "/", StudentLive.Messages
        live "/send", StudentLive.Messages, :send_message
        live "/:message_id", StudentLive.Messages, :view
      end

      scope "/subjects" do
        live "/", StudentLive.Subjects
        live "/:subject", StudentLive.GradesLive.Subject
      end

      # scope "/scheduling" do
      #   
      # end

      #  scope "/academics" do
      #    live "/", StudentLive.AcademicsLive.Index
      #    
      #    
      #    
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", ElixirusWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard in development
  if Application.compile_env(:elixirus, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: ElixirusWeb.Telemetry
    end
  end
end
