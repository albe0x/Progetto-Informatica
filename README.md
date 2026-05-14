# Progetto Informatica

Chat e social network in tempo reale sviluppato con Node.js, React, PostgreSQL e Docker.

---

## Architettura e Tech Stack

* **Backend:** Node.js + Express. Logica di business, rotte separate e autenticazione tramite token.
* **Frontend:** React + Vite + Tailwind. Interfaccia reattiva con gestione dello stato tramite Context.
* **Database:** PostgreSQL. Archiviazione dati utenti, post, commenti, interazioni e messaggi.
* **DevOps:** Docker + Docker Compose + Adminer per la gestione locale.

---

## Endpoint API

Tutti gli endpoint protetti richiedono l'header `Authorization: <token>`.

### Autenticazione
* `POST /auth/login` - Login utente
* `POST /auth/logout` - Logout utente
* `GET /auth/me` - Info sessione corrente

### Utenti
* `GET /user/search?q=...` - Ricerca utenti
* `GET /user/:username` - Profilo pubblico utente
* `POST /user` - Registrazione nuovo utente
* `PUT /user` - Modifica profilo
* `DELETE /user` - Eliminazione account
* `POST /user/:id_user/follow` - Segui/Smetti di seguire utente
* `GET /user/export/me` - Esportazione dati personali JSON

### Post
* `GET /post` - Feed post raccomandati
* `POST /post` - Creazione nuovo post
* `GET /post/:id_post` - Dettaglio singolo post
* `DELETE /post/:id_post` - Eliminazione post (Autore o SuperAdmin)
* `POST /post/:id_post/like` - Inserimento/Rimozione like
* `POST /post/:id_post/comments` - Aggiunta commento

### Chat
* `GET /chat` - Lista delle chat dell'utente
* `POST /chat` - Nuova chat (singola o gruppo)
* `GET /chat/:id_chat/messages` - Cronologia messaggi
* `POST /chat/:id_chat/messages` - Invio messaggio
* `POST /chat/:id_chat/members` - Aggiunta membri alla chat

---

## Installazione e Link

### URL di riferimento
* **Frontend:** `http://localhost:5173` (Locale) | `https://app.albe0x.com` (Produzione)
* **API:** `http://localhost:3000/api` (Locale) | `https://api.albe0x.com/api` (Produzione)
* **Adminer:** `http://localhost:3001`

### Avvio rapido
```bash
docker compose up -d --build
