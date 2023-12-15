![Elixir](https://github.com/RustySnek/Elixirus/assets/73820224/f98c563a-6e93-446b-8d69-79241c468199) ![us](https://github.com/RustySnek/Elixirus/assets/73820224/8db4378f-e11b-406c-b871-2086396667c6)

### A better replacemenet for Librus Synergia frontend written in Elixir

## Tech used
 * [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view) -  Rich, real-time user experiences with server-rendered HTML 🐦
 * [bun](https://github.com/oven-sh/bun) - Incredibly fast JavaScript runtime, bundler, test runner, and package manager 🥖
 * [erlport](https://github.com/erlport/erlport) - Connecting Elixir with Python 🧪 ❤️ 🐍
 * [librus-apix](https://github.com/RustySnek/librus-apix) - Web Scraper for Librus Synergia written in Python 🪛🐍

## Working with devenv
 Run `direnv allow` to allow .envrc execution
 
## Prerequisites
 * bun
 * erlang
 * elixir 1.15
 * python 3.11
 * pip

## Setup
 * ### To simplify setup you can run: `sh initialize.sh`
 * ### Manual setup
   Set MIX_BUN_PATH and PYTHONPATH:
   
      ```sh
   export MIX_BUN_PATH=$(which bun)
   export PYTHONPATH="$PWD/priv/librus-apix:$PWD/priv/librus-apix/venv/lib/python3.11/site-packages"
      ```

   Install mix and bun dependancies:

   ```sh
   mix deps.get
   bun install
   ```

   Setup python environment:

   ```sh
   python -m venv $PWD/priv/librus-apix/venv
   source $PWD/priv/librus-apix/venv/bin/activate
   pip install -r $PWD/priv/librus-apix/requirements.txt
   deactivate
   ```
 * ### Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`
     Now you can visit [`localhost:4001`](http://localhost:4001) from your browser.
