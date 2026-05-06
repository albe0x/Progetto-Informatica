#!/bin/bash
set -e

echo "--- [STEP 1] Aggiornamento sorgenti ---"
git fetch origin
git reset --hard origin/main

echo "--- [STEP 2] Riavvio container progetto ---"
docker compose down --remove-orphans
docker compose up --build -d

echo "--- DEPLOY COMPLETATO ---"
