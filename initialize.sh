#!/bin/sh
venv_directory="$PWD/priv/librus-apix/venv"

if [ -z "$MIX_BUN_PATH" ]; then
  export MIX_BUN_PATH=$(which bun)
  echo "Set MIX_BUN_PATH"
fi

if [ -z "$PYTHONPATH" ]; then
  export PYTHONPATH="$PWD/priv/librus-apix:$PWD/priv/librus-apix/venv/lib/python3.11/site-packages"
  echo "Set PYTHONPATH"
fi
echo "Installing mix dependancies..."
mix deps.get

echo "Installing bun dependancies..."
bun install

if [ -d "$venv_directory" ]; then
  echo "Python venv already exists, skipping..."
else
  python -m venv $venv_directory
  echo "Created python environment"
      source $venv_directory/bin/activate
  pip install -r $venv_directory/../requirements.txt
fi

echo -e "\nDone!"
