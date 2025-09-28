# no_code_app_builder
Lovable-style, local-first AI builder using **Gemini CLI** (plan) + **Qwen Code CLI** (codegen), with optional **GitHub Copilot CLI**. GUI in Next.js (later wrapped with Tauri for desktop), FastAPI backend, Docker/Compose for portability.

## Quick Start
- Local build (macOS first, Ubuntu compatible): see `README_LOCAL.md`.
- Remote automation (Jules/tasks): see `README_JULES.md`.
- Status logs: `STATUS_LOCAL.md` and `STATUS_JULES.md`.

## Stack
- UI: Next.js → Tauri (desktop)
- Backend: FastAPI
- Agents: Gemini CLI (plan), Qwen Code CLI (generate), Copilot CLI (optional)
- Packaging: Docker/Compose

## API Endpoints

The backend is a FastAPI service running on `http://localhost:8001`.

### Core Endpoints

| Method | Endpoint          | Query Parameters | Description                                  |
|--------|-------------------|------------------|----------------------------------------------|
| `GET`  | `/health`         | None             | Health check for the API service. Returns `{"ok": true}` |
| `GET`  | `/tasks`          | `project_id` (optional) | Get a list of tasks. Filter by project_id if provided |
| `POST` | `/tasks`          | None             | Create a new task with project_id and title |
| `PATCH`| `/tasks/{task_id}`| None             | Update a task's title or status              |

### Request/Response Examples

**Health Check:**
```bash
curl http://localhost:8001/health
# Response: {"ok": true}
```

**Get All Tasks:**
```bash
curl http://localhost:8001/tasks
# Response: [{"id": 1, "project_id": 1, "title": "Task 1", "status": "todo"}, ...]
```

**Get Tasks by Project:**
```bash
curl "http://localhost:8001/tasks?project_id=1"
# Response: [{"id": 1, "project_id": 1, "title": "Task 1", "status": "todo"}, ...]
```

**Create Task:**
```bash
curl -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d '{"project_id": 1, "title": "New Task"}'
# Response: {"id": 2, "project_id": 1, "title": "New Task", "status": "todo"}
```

**Update Task:**
```bash
curl -X PATCH http://localhost:8001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "doing"}'
# Response: {"id": 1, "project_id": 1, "title": "Task 1", "status": "doing"}
```

### Task Status Values
- `todo` - Task is not started
- `doing` - Task is in progress  
- `done` - Task is completed

## Roadmap
- Stage 1: MVP loop (plan → generate → run → iterate)
- Stage 2: Tauri desktop wrap
- Stage 3: DB + Auth + GitHub deep integration
- Stage 4: Containerized runners & distribution
