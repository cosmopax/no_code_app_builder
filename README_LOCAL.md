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

### Running the Application
To start both the frontend and backend services for development, run:
```bash
./scripts/dev-run.sh
```
This script will automatically install dependencies for both services if they are missing.
- **Web UI** will be available at `http://localhost:3000`
- **API** will be available at `http://localhost:8001/health`

### AI-powered Workflow
To use the AI agent workflow:
1.  **Plan:** `./scripts/ai-plan.sh "Describe the feature to build"`
2.  **Generate:** `./scripts/ai-generate.sh "Describe the implementation task"`
3.  **Review:** `git diff | ./scripts/ai-review.sh` (or similar)
