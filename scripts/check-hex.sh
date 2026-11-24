#!/bin/sh
set -eu

matches=$(grep -RInE '#[0-9A-Fa-f]{3,8}|rgba?\(' src --include='*.css' --include='*.tsx' --include='*.ts' --include='*.js' --include='*.mjs' --include='*.jsx' | grep -v '^src/styles/tokens.css:' || true)
if [ -n "$matches" ]; then
  echo "Hex/rgb color literals found outside src/styles/tokens.css:"
  echo "$matches"
  exit 1
fi

echo "Hex/rgb check passed."
