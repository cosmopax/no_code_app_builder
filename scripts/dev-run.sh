#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
( cd services/web && [ -f package.json ] && npm run dev || echo "Next.js not initialized yet." ) &
( cd services/api && python3 -m venv .venv && . .venv/bin/activate \
  && pip install -U fastapi uvicorn[standard] \
  && [ -f main.py ] || { cat > main.py << 'PY'
from fastapi import FastAPI
app = FastAPI()
@app.get("/health")
def health(): return {"ok": True}
PY
} \
  && uvicorn main:app --reload --port 8001 ) &
wait
