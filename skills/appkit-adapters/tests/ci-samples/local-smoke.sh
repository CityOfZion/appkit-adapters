#!/usr/bin/env bash
set -euo pipefail

# local-smoke.sh
# Simple local smoke script for the canonical example.
#
# Intended for local/dev use.
# Note: this may exceed 60s in constrained agent environments, but is canonical for human verification.
# Non-binding reference: use this to quickly prove "clean install + build".

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
EX_DIR="$ROOT_DIR/examples/vite-react-neo3"

echo "[smoke] root: $ROOT_DIR"
echo "[smoke] example: $EX_DIR"

cd "$EX_DIR"

command -v pnpm >/dev/null 2>&1 || {
  echo "pnpm not found. Install pnpm first." >&2
  exit 1
}

echo "[smoke] node: $(node -v)"
echo "[smoke] pnpm: $(pnpm -v)"

pnpm install --frozen-lockfile
pnpm build

echo "[smoke] PASS: install + build"
