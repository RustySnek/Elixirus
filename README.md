![Elixirus](https://github.com/RustySnek/Elixirus/blob/master/images/elixirus_logo.png)

[![Updated Badge](https://badges.pufler.dev/updated/rustysnek/elixirus)](https://github.com/RustySnek/Elixirus/commits/master/) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr/rustysnek/elixirus?style=flat-square) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/rustysnek/elixirus?style=flat-square)

### 📒 A better replacement for Synergia Learning Managment System web interface
**Elixirus** is a web application written in Elixir Phoenix for the librus_apix web scraper, providing a superior replacement for the native Librus web interface.

### Core Features 🚀
- **Data Caching**: Efficient data caching for faster load times. ⚡
- **Token Management**: Flexibly maintains tokens inside *ets* Erlang memory storage, allowing users the option to enable or disable token storing for refreshing purposes 🔒
- **Seamless Experience**: Enjoy a smooth and uninterrupted user experience. 🌐

### [Push Notifications](https://github.com/RustySnek/Elixirus/blob/ntfy_notifications/docs/notifications.md) 📲
- Elixirus supports notifications using [ntfy.sh](https://ntfy.sh/)
- Setup notifications guide [here](https://github.com/RustySnek/Elixirus/blob/ntfy_notifications/docs/notifications.md)

### Additional Features 🌟
- **Attendance Calculation**: Calculate percentage attendance effortlessly. 📊
- **GPA Calculation**: Compute semestral and yearly GPA with ease. 🎓

### Deployment Features 🚀
- **Docker Support**: Easily deploy using the provided Dockerfile. 🐳
- **CI/CD Integration**: Automated workflows with GitHub CI/CD. 🔄
- **Python Integration**: Utilize Python libraries through erlport. 🐍
- **HTTP Proxy Support**: Bypass API blocks with proxy support. 🌐
- **Health Checks**: Monitor connection health with integrated health checks. ❤️

### Anti Features 🛑
- UI design is far from perfect... 💀
- Notifications are only present when the Token is being kept and refreshed server-side 🔒

## Tech used 🔧
 * [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view) -  Rich, real-time user experiences with server-rendered HTML  🔥🐦
 * [bun](https://github.com/oven-sh/bun) - Incredibly fast JavaScript runtime, bundler, test runner, and package manager 🥖
 * [erlport](https://github.com/erlport/erlport) - Connecting Elixir with Python 🧪 ❤️ 🐍
 * [librus-apix](https://github.com/RustySnek/librus-apix) - Web Scraper for Librus Synergia written in Python 🪛🐍

## 🛠️ Working with devenv

Run `direnv allow` to allow `.envrc` execution


## Prerequisites ❗
 * bun
 * erlang
 * elixir 1.16.3
 * python 3.11
 * pip


## Setup ✅
 * ### To simplify setup you can run: `initialize.sh` script
 * ### Manual setup
   Set MIX_BUN_PATH (location of bun executable) and PYTHONPATH (location of python libraries for Erlport):
   
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

## Deploy  🐋 
❄️ Check out [example on deploying to remote NixOS machine with Colmena](https://github.com/RustySnek/elixirus-nix/blob/master/elixirus.nix)

🐋 Docker
* you can pull the existing container with

```sh
docker pull ghcr.io/rustysnek/elixirus:latest
```

* with docker-compose
     You will need
    - SECRET_BASE_KEY (mix phx.gen.secret)

```sh
docker-compose up --build
```
