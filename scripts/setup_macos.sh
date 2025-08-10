#!/usr/bin/env bash
set -euo pipefail
echo "SAFETY NOTICE: This installs Homebrew (if missing), Gemini CLI, Node(LTS)+nvm, Qwen Code CLI, and optional gh+Copilot."
# Homebrew
if ! command -v brew >/dev/null 2>&1; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
brew update
# Gemini CLI
brew install gemini-cli || true
# nvm + Node LTS
brew install nvm || true
mkdir -p ~/.nvm
export NVM_DIR="$HOME/.nvm"
. "$(brew --prefix nvm)/nvm.sh"
nvm install --lts
nvm use --lts
# Qwen Code CLI
npm install -g @qwen-code/qwen-code
# Optional: GitHub CLI + Copilot CLI
if command -v gh >/dev/null 2>&1; then
  echo "gh present; run: gh auth login && gh extension install github/gh-copilot"
else
  brew install gh
  echo "Run: gh auth login && gh extension install github/gh-copilot"
fi
echo "DONE. Verify: gemini --help | qwen --version | gh --version"
