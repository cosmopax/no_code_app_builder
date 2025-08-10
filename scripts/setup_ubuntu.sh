#!/usr/bin/env bash
set -euo pipefail
echo "SAFETY NOTICE: Installs Linuxbrew (if used), Gemini CLI, nvm+Node LTS, Qwen CLI, gh."
sudo apt update
# Linuxbrew (optional)
if ! command -v brew >/dev/null 2>&1; then
  /bin/bash -lc "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi
brew install gemini-cli || true
sudo apt install -y curl build-essential python3-venv
# nvm + Node LTS
if [ ! -d "$HOME/.nvm" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
nvm install --lts && nvm use --lts
npm install -g @qwen-code/qwen-code
# GitHub CLI (optional)
if ! command -v gh >/dev/null 2>&1; then
  type -p curl >/dev/null || sudo apt install -y curl
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt update && sudo apt install -y gh
fi
echo "DONE. Verify: gemini --help | qwen --version | gh --version"
