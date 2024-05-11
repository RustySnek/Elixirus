{ pkgs, ... }:

{
  enterShell = ''
    export MIX_BUN_PATH=$(which bun)
    export PYTHONPATH="$PWD/priv/librus-apix:$PWD/priv/librus-apix/venv/lib/python3.11/site-packages"
  ''; 
  packages = with pkgs; [
    bun
    elixir_1_15
    erlang
    elixir-ls
    python311
    python311Packages.pip
    nodePackages.pyright

    vscode-langservers-extracted
    tailwindcss-language-server
    
 ] ++ lib.optionals pkgs.stdenv.isLinux (with pkgs; [inotify-tools]);

  env.LANG = "en_US.UTF-8";
  dotenv.enable = true;
}
