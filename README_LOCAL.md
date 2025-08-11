# Local Developer Guide
This guide covers macOS first (Monterey+), then Ubuntu.

## Prereqs
- macOS: Homebrew, Python 3.10+, Node LTS
- Ubuntu: apt, Python 3.10+, Node LTS
- Optional: Docker Desktop (mac) / docker + compose (linux)

## Development

### One-time Setup
First, run the setup script for your OS to install the required CLIs:
- For macOS: `scripts/setup_macos.sh`
- For Ubuntu: `scripts/setup_ubuntu.sh`

### Local Runbook

To start the development environment, run the main development script from the root of the repository:

```bash
./scripts/dev-run.sh
```

This script performs the following actions:
1.  **Starts the Backend API:**
    -   Creates a Python virtual environment in `services/api/.venv` if it doesn't exist.
    -   Installs required Python packages from `services/api/requirements.txt`.
    -   Starts the FastAPI server on `http://localhost:8001` with hot-reloading enabled.
2.  **Starts the Frontend UI:**
    -   Installs Node.js dependencies from `package.json` in `services/web` if `node_modules` is missing.
    -   Starts the Next.js development server on `http://localhost:3000` with hot-reloading.

Both services will run in the background. To stop them, you can press `Ctrl+C` in the terminal where you ran `dev-run.sh`.

### Troubleshooting

-   **Port Conflicts:** If you have other services running on port `3000` or `8001`, the `dev-run.sh` script may fail.
    -   To change the frontend port, modify the `dev` script in `services/web/package.json`.
    -   To change the backend port, modify the `--port` argument in `scripts/dev-run.sh`.
-   **Dependency Issues:** If you encounter issues with dependencies, try deleting the `node_modules` and `package-lock.json` files in `services/web` and the `.venv` directory in `services/api`, then run `dev-run.sh` again.

### AI-powered Workflow
To use the AI agent workflow:
1.  **Plan:** `./scripts/ai-plan.sh "Describe the feature to build"`
2.  **Generate:** `./scripts/ai-generate.sh "Describe the implementation task"`
3.  **Review:** `git diff | ./scripts/ai-review.sh` (or similar)
