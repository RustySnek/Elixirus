# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :elixirus,
  generators: [timestamp_type: :utc_datetime]

config :elixir, :time_zone_database, Tzdata.TimeZoneDatabase
# Configures the endpoint
config :elixirus, ElixirusWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: ElixirusWeb.ErrorHTML, json: ElixirusWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Elixirus.PubSub,
  live_view: [signing_salt: "UkfzIumN"],
  elixirus_test: System.get_env("ELIXIRUS_TEXT", "false")

# Configure esbuild (the version is required)
config :bun,
  path: System.get_env("MIX_BUN_PATH"),
  version: "1.1.2",
  default: [
    args:
      ~w(build js/app.js --outdir=../priv/static/assets --external /fonts/* --external /images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.3.2",
  default: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
