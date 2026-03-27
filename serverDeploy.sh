#!/bin/bash
set -e

REPO_URL="https://github.com/albe0x/Progetto-Informatica.git"
TARGET_DIR="Progetto-Informatica"

# 1. Clone or Pull updates
if [ -d "$TARGET_DIR" ]; then
    cd "$TARGET_DIR" && git pull
else
    git clone "$REPO_URL" "$TARGET_DIR"
    cd "$TARGET_DIR"
fi

docker compose up -d --build
