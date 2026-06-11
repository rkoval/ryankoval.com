#!/usr/bin/env bash
# Resize and compress Playwright OG captures for social crawlers.
# Target: 1200×630 JPEG, stripped metadata, ≤300 KB each.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
IMG_DIR="$ROOT/public/images"
OG_W=1200
OG_H=630
JPEG_QUALITY=88
MAX_BYTES=$((300 * 1024))

if ! command -v magick >/dev/null 2>&1; then
  echo "error: ImageMagick (magick) is required" >&2
  exit 1
fi

optimize_one() {
  local name=$1
  local src dst tmp
  src=""
  for ext in png jpg jpeg; do
    if [[ -f "$IMG_DIR/${name}.${ext}" ]]; then
      src="$IMG_DIR/${name}.${ext}"
      break
    fi
  done
  if [[ -z "$src" ]]; then
    echo "error: missing $IMG_DIR/${name}.png (run Playwright capture first)" >&2
    exit 1
  fi

  dst="$IMG_DIR/${name}.jpg"
  tmp="$(mktemp "${TMPDIR:-/tmp}/og-XXXXXX.jpg")"

  magick "$src" \
    -strip \
    -resize "${OG_W}x${OG_H}!" \
    -quality "$JPEG_QUALITY" \
    -sampling-factor 4:2:0 \
    -interlace Plane \
    "$tmp"

  mv "$tmp" "$dst"
  chmod 644 "$dst"

  # Remove raw PNG capture after successful JPEG write
  if [[ "$src" != "$dst" && "$src" == *.png ]]; then
    rm -f "$src"
  fi

  local w h bytes
  w=$(sips -g pixelWidth "$dst" 2>/dev/null | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$dst" 2>/dev/null | awk '/pixelHeight/{print $2}')
  bytes=$(wc -c <"$dst" | tr -d ' ')

  if [[ "$w" != "$OG_W" || "$h" != "$OG_H" ]]; then
    echo "error: $dst is ${w}x${h}, expected ${OG_W}x${OG_H}" >&2
    exit 1
  fi

  echo "$dst  ${w}x${h}  $((bytes / 1024))KB"
  if ((bytes > MAX_BYTES)); then
    echo "warning: $dst exceeds $((MAX_BYTES / 1024))KB — consider lowering JPEG_QUALITY" >&2
  fi
}

optimize_one home-og-image
optimize_one resume-og-image
