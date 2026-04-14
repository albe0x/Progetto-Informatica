#!/bin/bash

# Interrompe lo script in caso di errore
set -e

echo "-------------------------------------------------------"
echo "🚀 AVVIO DEPLOY AUTOMATIZZATO: $(date)"
echo "-------------------------------------------------------"

# [STEP 1] Aggiornamento del codice sorgente
echo "--- [1/3] Sincronizzazione Repository ---"
# Siamo già dentro la cartella Progetto-Informatica
# Scarichiamo le ultime modifiche (incluso eventuali nuove versioni di questo script)
git fetch origin
git reset --hard origin/main
echo "✅ Codice aggiornato con successo."

# [STEP 2] Gestione Permessi
echo "--- [2/3] Verifica Permessi ---"
# Ci assicuriamo che lo script possa essere eseguito nei futuri deploy
chmod +x serverDeploy.sh
echo "✅ Permessi script configurati."

# [STEP 3] Rilancio dei Container
echo "--- [3/3] Riavvio Container Progetto ---"

# Utilizziamo docker-compose (con il trattino) perché Alpine solitamente 
# espone il binario v1 o v2 sotto questo nome.
# Se la tua VM usa il plugin v2, lo script funzionerà comunque grazie al volume.
if command -v docker-compose &> /dev/null
then
    echo "⚙️  Esecuzione tramite docker-compose..."
    docker-compose up -d --build
else
    echo "⚙️  Esecuzione tramite docker compose..."
    docker compose up -d --build
fi

echo "-------------------------------------------------------"
echo "✅ DEPLOY COMPLETATO CON SUCCESSO!"
echo "-------------------------------------------------------"
