#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -x "/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node" ]]; then
  NODE="/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node"
else
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm use >/dev/null
  NODE="$(command -v node)"
fi

exec "$NODE" "$ROOT/node_modules/@playwright/mcp/cli.js" "$@"
