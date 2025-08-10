# Local Developer Guide
This guide covers macOS first (Monterey+), then Ubuntu.

## Prereqs
- macOS: Homebrew, Python 3.10+, Node LTS
- Ubuntu: apt, Python 3.10+, Node LTS
- Optional: Docker Desktop (mac) / docker + compose (linux)

## Install CLIs
- Gemini CLI
- Qwen Code CLI
- (Optional) GitHub Copilot CLI

Use `scripts/setup_macos.sh` or `scripts/setup_ubuntu.sh`.

## First Run
1. Plan: `./scripts/ai-plan.sh "MVP spec here"`
2. Generate: `./scripts/ai-generate.sh "First task here"`
3. Run: `./scripts/dev-run.sh` -> Web: http://localhost:3000  API: http://localhost:8001/health
