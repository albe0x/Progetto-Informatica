#!/bin/bash
set -e

echo "--- [1/3] Aggiornamento sorgenti ---"
git fetch origin
git reset --hard origin/main

echo "--- [2/3] Pulizia profonda (Senza cancellare dati) ---"
# Usiamo 'down' invece di 'stop' per pulire i container vecchi,
# ma NON mettiamo '-v' così i tuoi dati SQL restano al sicuro.
docker compose down

echo "--- [3/3] Avvio e Ricostruzione ---"
# --force-recreate assicura che i container siano nuovi di zecca
docker compose up -d --build --force-recreate --remove-orphans

echo "--- [EXTRA] Attesa inizializzazione DB ---"
# Aspettiamo 10 secondi per dare tempo a Postgres di creare le tabelle
# prima che il backend dia errore 'relation does not exist'
sleep 10

echo "Deploy completato con successo!"