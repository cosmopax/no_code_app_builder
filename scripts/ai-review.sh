#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
DIFF=$(git diff || true)
[ -z "$DIFF" ] && { echo "No changes to review."; exit 0; }
printf "%s\n\n%s\n" "$(cat prompts/review.md)" "$DIFF" | qwen --input -
