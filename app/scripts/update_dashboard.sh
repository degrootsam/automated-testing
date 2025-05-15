#!/bin/bash

# Load nvm (necessary for non-interactive shells)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Stop dashboard via PM2
pm2 stop bb-testing-dashboard

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Pull from upstream
cd "$SCRIPT_DIR/../" || {
	echo "Dashboard directory not found at $SCRIPT_DIR/../dashboard."
	exit 1
}

git checkout .

git pull upstream main

nvm use node

# Optionally install and build
npm install
npm run build

# Start dashboard again
pm2 start npm --name "bb-testing-dashboard" -- start
