# Local Developer Guide
This guide covers local development setup for the no-code app builder on macOS (Monterey+) and Ubuntu.

## Overview
The development environment consists of two services:
- **Frontend (port 3000):** Next.js React application with Tailwind CSS
- **Backend (port 8001):** FastAPI service with in-memory task storage

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

To start the development environment, follow these step-by-step instructions:

#### Quick Start (Automated)

Run the main development script from the root of the repository:

```bash
./scripts/dev-run.sh
```

#### What the Script Does

The `dev-run.sh` script performs the following actions:

1.  **Backend API Setup & Start:**
    -   Creates a Python virtual environment in `services/api/.venv` if it doesn't exist
    -   Activates the virtual environment
    -   Installs required Python packages (`fastapi`, `uvicorn[standard]`)
    -   Creates a minimal `main.py` if it doesn't exist
    -   Starts the FastAPI server on `http://localhost:8001` with hot-reloading enabled

2.  **Frontend UI Setup & Start:**
    -   Navigates to `services/web` directory
    -   Installs Node.js dependencies from `package.json` if `node_modules` is missing
    -   Starts the Next.js development server on `http://localhost:3000` with hot-reloading

Both services run concurrently in the background.

#### Manual Start (Alternative)

If you prefer to start services manually or need more control:

**Terminal 1 - Backend:**
```bash
cd services/api
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -U fastapi uvicorn[standard]
uvicorn main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd services/web
npm install  # Only needed if node_modules is missing
npm run dev
```

#### Verification Steps

After starting the services, verify they are running:

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8001/health
   # Expected: {"ok": true}
   ```

2. **Frontend Access:**
   - Open http://localhost:3000 in your browser
   - You should see the "No-code Builder" welcome page
   - The page should show "API Status: Online" if backend is running

3. **API Endpoints Test:**
   ```bash
   # Get all tasks (should return empty array initially)
   curl http://localhost:8001/tasks
   # Expected: []
   
   # Create a test task
   curl -X POST http://localhost:8001/tasks \
     -H "Content-Type: application/json" \
     -d '{"project_id": 1, "title": "Test Task"}'
   # Expected: {"id": 1, "project_id": 1, "title": "Test Task", "status": "todo"}
   ```

#### Stopping Services

To stop both services:
- Press `Ctrl+C` in the terminal where you ran `dev-run.sh`
- If running manually, press `Ctrl+C` in each terminal window

### Troubleshooting

#### Port Conflicts (3000 & 8001)

**Problem:** Port conflicts are the most common issue when starting the development environment.

**Frontend Port 3000 Issues:**
- **Symptoms:** Error like "Port 3000 is already in use" when starting Next.js
- **Solutions:**
  1. **Kill existing processes:**
     ```bash
     # Find processes using port 3000
     lsof -ti :3000
     # Kill the processes (replace <PID> with actual process IDs)
     kill -9 <PID>
     
     # Or kill all node processes (use carefully)
     pkill node
     ```
  
  2. **Use a different port:**
     ```bash
     # Option 1: Modify package.json dev script
     cd services/web
     # Edit package.json and change:
     # "dev": "next dev --turbopack --port 3001"
     
     # Option 2: Use environment variable
     PORT=3001 npm run dev
     
     # Option 3: Use Next.js CLI flag
     npx next dev --port 3001
     ```

  3. **Common conflicting applications:**
     - Other Next.js/React apps
     - Gatsby development servers
     - Rails servers (when configured for port 3000)
     - Other Node.js development servers

**Backend Port 8001 Issues:**
- **Symptoms:** Error like "Port 8001 is already in use" when starting FastAPI
- **Solutions:**
  1. **Kill existing processes:**
     ```bash
     # Find processes using port 8001
     lsof -ti :8001
     # Kill the processes
     kill -9 <PID>
     
     # Or find and kill uvicorn processes
     pkill -f uvicorn
     ```
  
  2. **Use a different port:**
     ```bash
     # Modify the dev-run.sh script port argument:
     # Change: uvicorn main:app --reload --port 8002
     
     # Or run manually with different port:
     cd services/api
     source .venv/bin/activate
     uvicorn main:app --reload --port 8002
     ```
     
     If you change the backend port, also update the frontend API calls:
     ```bash
     # Update services/web/src/app/page.tsx
     # Change: fetch('http://localhost:8001/health')
     # To:     fetch('http://localhost:8002/health')
     ```

  3. **Common conflicting applications:**
     - Other FastAPI/Python web servers
     - Django development servers
     - Flask applications
     - Other uvicorn processes

#### Dependency Issues

**Node.js Dependencies:**
- **Symptoms:** Module not found errors, build failures
- **Solutions:**
  ```bash
  cd services/web
  rm -rf node_modules package-lock.json
  npm cache clean --force
  npm install
  ```

**Python Dependencies:**
- **Symptoms:** Import errors, missing module errors
- **Solutions:**
  ```bash
  cd services/api
  rm -rf .venv
  python3 -m venv .venv
  source .venv/bin/activate  # On Windows: .venv\Scripts\activate
  pip install --upgrade pip
  pip install -U fastapi uvicorn[standard]
  ```

#### Environment Issues

**Python Version Problems:**
- **Symptoms:** "python3: command not found" or version conflicts
- **Solutions:**
  ```bash
  # Check Python version (need 3.10+)
  python3 --version
  
  # macOS with Homebrew:
  brew install python@3.11
  
  # Ubuntu:
  sudo apt update
  sudo apt install python3.11 python3.11-venv
  ```

**Node.js Version Problems:**
- **Symptoms:** Compatibility issues, build failures
- **Solutions:**
  ```bash
  # Check Node.js version
  node --version
  
  # Install/update Node.js LTS
  # macOS with nvm:
  nvm install --lts && nvm use --lts
  
  # Ubuntu with nvm:
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.bashrc
  nvm install --lts && nvm use --lts
  ```

#### Service Connection Issues

**Frontend Can't Connect to Backend:**
- **Symptoms:** API Status shows "Offline" in the UI
- **Diagnosis:**
  ```bash
  # Test backend directly
  curl http://localhost:8001/health
  
  # Check if backend is running
  ps aux | grep uvicorn
  
  # Check backend logs
  # (Look at terminal where dev-run.sh is running)
  ```
- **Solutions:**
  1. Ensure backend is running on correct port
  2. Check for CORS issues (shouldn't occur with localhost)
  3. Verify firewall/security software isn't blocking connections

#### Performance Issues

**Slow Startup:**
- **Common causes:** First-time npm install, Python venv creation
- **Solutions:** Wait for initial setup to complete, subsequent starts will be faster

**Hot Reload Not Working:**
- **Frontend:** Try refreshing browser, check Next.js console output
- **Backend:** Check uvicorn logs, ensure files are being watched correctly

#### Getting Help

If issues persist:
1. Check the terminal output where `dev-run.sh` is running for error messages
2. Verify all prerequisites are installed (see Prereqs section)
3. Try the manual startup process to isolate issues
4. Check the GitHub issues for similar problems
5. Run the setup scripts again: `scripts/setup_macos.sh` or `scripts/setup_ubuntu.sh`

### AI-powered Workflow
To use the AI agent workflow:
1.  **Plan:** `./scripts/ai-plan.sh "Describe the feature to build"`
2.  **Generate:** `./scripts/ai-generate.sh "Describe the implementation task"`
3.  **Review:** `git diff | ./scripts/ai-review.sh` (or similar)
