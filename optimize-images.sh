#!/usr/bin/env bash
set -x
CYAN='\033[0;36m'
RESET_COLOR='\033[0m'
if ! which optipng >> /dev/null || ! which jpegoptim >> /dev/null; then
  echo -e "${CYAN}[slammin]${RESET_COLOR} Installing missing packages ..."
  brew install optipng
  brew install jpegoptim
fi
cd static
find ${1:-.} -type f -name "*.(jpeg|jpg)" -exec jpegoptim --max=90 --strip-all {} \;
find ${1:-.} -type f -name "*.png" -exec optipng -o7 --strip all {} \;