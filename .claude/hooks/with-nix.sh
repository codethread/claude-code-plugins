#!/usr/bin/env bash
# Wraps a command in `nix develop` when flake.nix is present
DIR="${CLAUDE_PROJECT_DIR:-.}"
if [ -f "$DIR/flake.nix" ] && command -v nix &>/dev/null; then
  exec nix develop "$DIR" --command "$@"
else
  exec "$@"
fi
