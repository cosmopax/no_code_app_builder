#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
SPEC="${1:-"MVP: Kanban (Projects/Tasks/Tags), email-only auth, local JSON storage, Next.js UI + FastAPI API."}"
mkdir -p .config
gemini prompt --input "$SPEC" --system "$(cat prompts/plan.md)" --output .config/plan.md > /dev/null
echo "Plan written to .config/plan.md"
