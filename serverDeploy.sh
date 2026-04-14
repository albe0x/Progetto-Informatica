#!/bin/bash
set -e

echo "--- [STEP 1] Aggiornamento sorgenti ---"
git fetch origin
git reset --hard origin/main

echo "--- [STEP 2] Verifica permessi ---"
chmod +x serverDeploy.sh

echo "--- [STEP 3] Riavvio container progetto ---"

# Usiamo 'docker compose' (senza trattino) che è la versione moderna (V2)
# e risolve il problema 'ContainerConfig'
docker compose up -d --build

echo "--- DEPLOY COMPLETATO ---"
