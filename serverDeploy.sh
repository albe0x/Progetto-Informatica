#!/bin/bash
set -e

echo "Fetching latest changes from GitHub..."
git fetch origin
git reset --hard origin/main

echo "Making script executable..."
chmod +x serverDeploy.sh

echo "Reset and restarting Docker..."
/usr/local/bin/docker-compose down
/usr/local/bin/docker-compose up -d --build --force-recreate

echo "Deploy completed successfully!"
