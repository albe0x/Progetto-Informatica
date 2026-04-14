#!/bin/bash
set -e

echo "--- [1/3] Sincronizzazione Sorgenti ---"
git fetch origin
git reset --hard origin/main

echo "--- [2/3] Configurazione Eseguibile ---"
chmod +x serverDeploy.sh

echo "--- [3/3] Reset e Riavvio Docker ---"
# Rimuove container vecchi o bloccati che causano conflitti
docker compose down --remove-orphans

# Ricrea tutto da zero ignorando i residui
docker compose up -d --build --force-recreate

echo "--- DEPLOY COMPLETATO ---"
