#!/usr/bin/env bash
set -x
CYAN='\033[0;36m'
RESET_COLOR='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="${1:-$SCRIPT_DIR/src/assets}"
SVGO_CONFIG="$SCRIPT_DIR/svgo.config.js"

if ! which optipng >>/dev/null || ! which jpegoptim >>/dev/null; then
  echo -e "${CYAN}[slammin]${RESET_COLOR} Installing missing packages ..."
  brew install optipng
  brew install jpegoptim
fi

find "$TARGET_DIR" -type f -name "*.jpg" -exec jpegoptim --max=90 --strip-all {} \;
find "$TARGET_DIR" -type f -name "*.jpeg" -exec jpegoptim --max=90 --strip-all {} \;
find "$TARGET_DIR" -type f -name "*.png" -exec optipng -o7 --strip all {} \;

if find "$TARGET_DIR" -type f -name "*.svg" -print -quit | grep -q .; then
  echo -e "${CYAN}[slammin]${RESET_COLOR} Minifying SVGs (comments/metadata/whitespace only) ..."
  if command -v svgo >>/dev/null; then
    svgo --config="$SVGO_CONFIG" -f "$TARGET_DIR" -r
  else
    npx --yes svgo --config="$SVGO_CONFIG" -f "$TARGET_DIR" -r
  fi
fi
