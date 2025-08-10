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

## Roadmap
- Stage 1: MVP loop (plan → generate → run → iterate)
- Stage 2: Tauri desktop wrap
- Stage 3: DB + Auth + GitHub deep integration
- Stage 4: Containerized runners & distribution
