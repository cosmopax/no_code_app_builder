#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Start frontend service
(
  cd services/web
  if [ -f package.json ]; then
    if [ ! -d "node_modules" ]; then
      echo "Installing web dependencies..."
      npm install
    fi
    npm run dev
  else
    echo "Next.js not initialized yet."
  fi
) &

# Start backend service
(
  cd services/api
  if [ ! -d ".venv" ]; then
    python3 -m venv .venv
  fi
  . .venv/bin/activate
  pip install -U fastapi uvicorn[standard]
  if [ ! -f main.py ]; then
    cat > main.py << 'PY'
from fastapi import FastAPI
app = FastAPI()
@app.get("/health")
def health(): return {"ok": True}
PY
  fi
  uvicorn main:app --reload --port 8001
) &

wait
