#!/bin/bash
set -e

echo "--- [STEP 1] Aggiornamento sorgenti ---"
git fetch origin
git reset --hard origin/main

echo "--- [STEP 2] Verifica permessi ---"
chmod +x serverDeploy.sh

echo "--- [STEP 3] Riavvio container progetto ---"

# Proviamo prima docker-compose (v1) poi docker compose (v2)
if command -v docker-compose &> /dev/null
then
    docker-compose up -d --build
else
    docker compose up -d --build
fi

echo "--- DEPLOY COMPLETATO ---"
