#!/bin/bash
set -e

echo "--- [1/3] Aggiornamento sorgenti Git ---"
# Siamo già dentro la cartella Progetto-Informatica grazie al server.js
git fetch origin
git reset --hard origin/main

echo "--- [2/3] Verifica permessi script ---"
chmod +x serverDeploy.sh

echo "--- [3/3] Riavvio dei servizi Docker ---"

# Determiniamo il comando corretto (preferiamo il binario statico che abbiamo installato)
if [ -f "/usr/local/bin/docker-compose" ]; then
    DOCKER_CMD="/usr/local/bin/docker-compose"
elif docker compose version >/dev/null 2>&1; then
    DOCKER_CMD="docker compose"
else
    DOCKER_CMD="docker-compose"
fi

echo "Usando il comando: $DOCKER_CMD"

# Eseguiamo il restart
$DOCKER_CMD down
$DOCKER_CMD up -d --build --force-recreate

echo "--- DEPLOY COMPLETATO CON SUCCESSO ---"