#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
TASK="${1:-"Implement backend CRUD (/projects, /tasks) with Pydantic models + unit tests."}"
qwen --system "$(cat prompts/generate.md)" --input "$TASK" \
  --context "Repo structure: $(find . -maxdepth 2 -type d | sed 's#^\./##g' | tr '\n' ' ')"
echo "Generation finished. Review changes: git status; git diff."
