# Progetto-Informatica

Un'applicazione di chat in tempo reale con post e funzionalità social, costruita con Node.js, React, PostgreSQL e Docker.

## 🚀 Come Funziona il Progetto

Il progetto è una piattaforma social completa che permette agli utenti di interagire attraverso messaggi diretti, chat di gruppo e un feed di post.

1.  **Backend (Node.js/Express):** Gestisce la logica di business, l'autenticazione tramite token (salvati nel database) e le interazioni con il database PostgreSQL. Utilizza un'architettura a rotte per separare le responsabilità (auth, user, post, chat).
2.  **Frontend (React/Vite):** Un'interfaccia moderna e reattiva costruita con Tailwind CSS. Utilizza i Context di React per gestire lo stato dell'autenticazione e fornisce un'esperienza utente fluida.
3.  **Database (PostgreSQL):** Memorizza utenti, post, commenti, like, relazioni di follow e messaggi di chat.
4.  **Docker:** L'intero ecosistema è containerizzato, rendendo il deploy e lo sviluppo locale estremamente semplici e consistenti.

## ✨ Funzionalità Implementate

-   🔐 **Autenticazione Sicura:** Registrazione, login e logout con gestione dei token di sessione.
-   💬 **Chat in Tempo Reale:** Creazione di chat, messaggistica e gestione dei membri del gruppo.
-   📝 **Feed di Post:** Creazione di post con supporto per titoli, contenuti e immagini.
-   ❤️ **Interazioni Social:** Sistema di "Like" e commenti sui post.
-   🤝 **Sistema di Follow:** Segui altri utenti per rimanere aggiornato sulle loro attività.
-   🔍 **Ricerca Utenti:** Trova altri utenti tramite username o nome visualizzato.
-   👤 **Profili Utente:** Pagine profilo dettagliate con badge di verifica e stato Admin.
-   📥 **Portabilità dei Dati:** Funzionalità per esportare tutti i propri dati in formato JSON.
-   🛡️ **Ruoli Admin:** Supporto per SuperAdmin con poteri di moderazione (eliminazione post/utenti).

## 🛠️ Tech Stack

-   **Backend:** Node.js + Express
-   **Frontend:** React + Vite + Tailwind CSS + Lucide React
-   **Database:** PostgreSQL
-   **DevOps:** Docker + Docker Compose + Adminer (per la gestione DB)

## 🚦 Accesso all'Applicazione

L'applicazione è accessibile ai seguenti indirizzi:

-   **Frontend:** `http://localhost:5173` (locale) o `https://app.albe0x.com` (produzione)
-   **API:** `http://localhost:3000/api` (locale) o `https://api.albe0x.com/api` (produzione)

Tutti gli endpoint API sono documentati in dettaglio in [API-endpoints.md](API-endpoints.md).

### Autenticazione
- `POST /auth/login` - Effettua il login.
- `POST /auth/logout` - Effettua il logout.
- `GET /auth/me` - Ottiene le info sulla sessione corrente.

### Utenti
- `GET /user/search?q=...` - Cerca utenti.
- `GET /user/:username` - Ottiene il profilo pubblico di un utente.
- `POST /user` - Registra un nuovo utente.
- `PUT /user` - Modifica il proprio profilo.
- `DELETE /user` - Elimina il proprio account.
- `POST /user/:id_user/follow` - Segui/Smetti di seguire un utente.
- `GET /user/export/me` - Esporta i dati personali.

### Post
- `GET /post` - Ottiene il feed dei post raccomandati.
- `POST /post` - Crea un nuovo post.
- `GET /post/:id_post` - Dettaglio di un singolo post.
- `DELETE /post/:id_post` - Elimina un post (Proprietario o SuperAdmin).
- `POST /post/:id_post/like` - Metti/Togli like a un post.
- `POST /post/:id_post/comments` - Aggiungi un commento.

### Chat
- `GET /chat` - Lista delle chat dell'utente.
- `POST /chat` - Crea una nuova chat (singola o di gruppo).
- `GET /chat/:id_chat/messages` - Recupera la cronologia messaggi.
- `POST /chat/:id_chat/messages` - Invia un messaggio.
- `POST /chat/:id_chat/members` - Aggiunge membri a una chat esistente.

## 📦 Installazione e Avvio Rapido

### Prerequisiti
- Docker e Docker Compose installati.

### Avvio
```bash
docker-compose up -d --build
```
Questo comando avvierà:
- **Database:** PostgreSQL sulla porta 5432.
- **Backend:** API sulla porta 3000.
- **Frontend:** Applicazione React sulla porta 5173 (mappata su 80 nel container).
- **Adminer:** Gestore database sulla porta 3001.

## 📝 Note
Tutti gli endpoint protetti richiedono l'header `Authorization: <token>`.
I SuperAdmin vengono definiti direttamente nel database tramite il flag `isSuperAdmin`.
