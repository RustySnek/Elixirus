{ pkgs, lib, config, inputs, ... }:
let
unstable = import inputs.nixpkgs-unstable {system = pkgs.stdenv.system; };
in {
  dotenv.enable = true;
  enterShell = ''
    export MIX_BUN_PATH=$(which bun)
  ''; 

  packages = [
    unstable.elixir_1_17
    unstable.elixir-ls
    pkgs.bun
    pkgs.erlang
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.nodePackages.pyright
    pkgs.nodePackages_latest.typescript-language-server
    pkgs.vscode-langservers-extracted
    pkgs.tailwindcss-language-server
    
 ]
 ++ lib.optionals pkgs.stdenv.isLinux (with pkgs; [inotify-tools]);

 }
