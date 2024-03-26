ARG ELIXIR_VERSION=1.15.7
ARG OTP_VERSION=25.3.2.7
ARG DEBIAN_VERSION=bullseye-20231009-slim

ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:${DEBIAN_VERSION}"
ARG BUN_IMAGE="oven/bun:latest"

FROM ${BUILDER_IMAGE} as initial_builder

RUN apt-get update -y && apt-get install -y build-essential git \
    && apt-get clean && rm -f /var/lib/apt/lists/*_*

WORKDIR /app
ENV MIX_ENV="prod"

COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

FROM ${BUN_IMAGE} as bunny

WORKDIR /app
COPY --from=initial_builder /app .
COPY package.json .
RUN bun install && bun install --production

FROM ${BUILDER_IMAGE} as builder

ENV MIX_ENV="prod"
WORKDIR /app
COPY --from=bunny app/ .
RUN mix local.hex --force && \
    mix local.rebar --force

COPY priv priv
COPY lib lib
COPY assets assets

RUN mix assets.deploy && mix compile

COPY config/runtime.exs config/
COPY rel rel

RUN mix release

FROM ${RUNNER_IMAGE}

COPY priv priv
RUN apt-get update -y && \
  apt-get install -y \
      build-essential zlib1g-dev libncurses5-dev \
      libgdbm-dev libnss3-dev libssl-dev libreadline-dev \
      libffi-dev wget software-properties-common \
      openssl locales ca-certificates && \
  apt-get clean && rm -f /var/lib/apt/lists/*_*

RUN wget https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tar.xz && \
  tar -xf Python-3.11.0.tar.xz && \
  ./Python-3.11.0/configure && \
  make install && \
  rm -r Python-3.11.0.tar.xz Python-3.11.0/

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV PYTHONPATH="/app/librus-apix"
ENV MIX_ENV="prod"

WORKDIR "/app"
RUN chown nobody /app

COPY priv/librus-apix librus-apix
RUN pip3 install -r librus-apix/requirements.txt && \
    rm -r /usr/bin/python3 && ln -s /usr/local/bin/python3 /usr/bin/python 

COPY --from=builder --chown=nobody:root /app/_build/${MIX_ENV}/rel/elixirus ./

USER nobody

CMD ["/app/bin/server"]
