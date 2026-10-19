#!/usr/bin/env bash
set -euo pipefail

# local-smoke.sh
# Simple local smoke script for the skill examples.
#
# Usage: tests/ci-samples/local-smoke.sh [example...]
#   default examples: vite-react-neo3 simple-app
#
# The examples link the adapters via `file:../../../../packages/<name>`, so the
# Rush packages are installed and built first (set SKIP_PACKAGES=1 to skip).
# Note: this may exceed 60s in constrained agent environments, but is canonical for human verification.
# Non-binding reference: use this to quickly prove "clean install + build".

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REPO_DIR="$(cd "$SKILL_DIR/../.." && pwd)"
EXAMPLES=("$@")
[ ${#EXAMPLES[@]} -eq 0 ] && EXAMPLES=(vite-react-neo3 simple-app)

echo "[smoke] repo: $REPO_DIR"
echo "[smoke] skill: $SKILL_DIR"

command -v pnpm >/dev/null 2>&1 || {
  echo "pnpm not found. Install pnpm first." >&2
  exit 1
}

echo "[smoke] node: $(node -v)"
echo "[smoke] pnpm: $(pnpm -v)"

if [ "${SKIP_PACKAGES:-0}" != "1" ]; then
  echo "[smoke] building adapter packages"
  cd "$REPO_DIR"
  node common/scripts/install-run-rush.js install
  node common/scripts/install-run-rush.js build-packages
fi

for example in "${EXAMPLES[@]}"; do
  echo "[smoke] example: $example"
  cd "$SKILL_DIR/examples/$example"
  pnpm install --frozen-lockfile
  pnpm build
  echo "[smoke] PASS: $example install + build"
done

echo "[smoke] PASS: all examples"