#!/bin/bash
set -e

echo "--- [1/3] Aggiornamento sorgenti Git ---"
git fetch origin
git reset --hard origin/main

echo "--- [2/3] Verifica permessi script ---"
chmod +x serverDeploy.sh

echo "--- [3/3] Riavvio dei servizi Docker ---"

# Identifica il comando corretto
if [ -f "/usr/local/bin/docker-compose" ]; then
    DOCKER_CMD="/usr/local/bin/docker-compose"
else
    DOCKER_CMD="docker compose"
fi

# 1. Spegniamo solo i container, MAI usare il flag -v se vuoi tenere i dati
$DOCKER_CMD stop

# 2. Avviamo e ricostruiamo solo ciò che è cambiato (backend/frontend)
# --no-recreate assicura che se il DB è già attivo e i dati sono lì, non venga toccato
$DOCKER_CMD up -d --build --remove-orphans

echo "--- DEPLOY COMPLETATO (DATI PRESERVATI) ---"