# API RESTful

Base URL: `http://localhost:3000`

## Autenticazione

### POST `/api/auth/login`
- Description: Effettua il login e restituisce un token di sessione.
- Request body (JSON):
  - `username` (string, obbligatorio)
  - `password` (string, obbligatorio)
- Response (JSON):
  - `message` (string)
  - `token` (string)
  - `username` (string)

Esempio request:
```json
{
  "username": "mario",
  "password": "password123"
}
```

### POST `/api/auth/logout`
- Description: Termina la sessione dell'utente.
- Headers:
  - `Authorization: <token>`
- Response (JSON):
  - `message` (string)

### GET `/api/auth/me`
- Description: Restituisce i dati dell'utente autenticato.
- Headers:
  - `Authorization: <token>`
- Response (JSON):
  - `id_user` (numero)
  - `username` (string)

Esempio response:
```json
{
  "id_user": 1,
  "username": "mario"
}
```

---

## Utenti

### GET `/api/user`
- Description: Lista utenti (non implementato).
- Headers:
  - `Authorization: <token>`
- Response: `501 Not Implemented`

### GET `/api/user/search?q=<termine>`
- Description: Cerca utenti per nome utente o display name.
- Headers:
  - `Authorization: <token>`
- Query parameters:
  - `q` (string)
- Response (JSON): array di utenti.

Esempio request:
```
GET /api/user/search?q=mario
```

### GET `/api/user/:username`
- Description: Restituisce il profilo di un utente specifico.
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:username` (string)
- Response (JSON):
  - `id_user`
  - `username`
  - `displayName`
  - `bio`
  - `createdAt`

### POST `/api/user`
- Description: Registra un nuovo utente.
- Request body (JSON):
  - `username` (string, obbligatorio)
  - `password` (string, obbligatorio)
  - `displayName` (string, opzionale)
  - `bio` (string, opzionale)
- Response (JSON):
  - `message` (string)

### PUT `/api/user`
- Description: Modifica i dati dell'utente autenticato.
- Headers:
  - `Authorization: <token>`
- Request body (JSON):
  - `username` (string, opzionale)
  - `password` (string, opzionale)
  - `displayName` (string, opzionale)
  - `bio` (string, opzionale)
- Response (JSON):
  - `message` (string)

### DELETE `/api/user/:username`
- Description: Elimina un utente specifico (non implementato).
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:username`
- Response: `501 Not Implemented`

---

## Post

### GET `/api/post`
- Description: Recupera il feed globale / post consigliati.
- Headers:
  - `Authorization: <token>`
- Response (JSON): array di post.

### GET `/api/post/user/:id_user`
- Description: Recupera i post di un utente specifico.
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:id_user` (numero)
- Response (JSON): array di post.

### GET `/api/post/:id_post`
- Description: Recupera il dettaglio di un singolo post.
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:id_post` (numero)
- Response (JSON): oggetto post.

### POST `/api/post`
- Description: Crea un nuovo post.
- Headers:
  - `Authorization: <token>`
- Request body (JSON):
  - `title` (string)
  - `content` (string)
  - `imageUrl` (string)
- Response (JSON):
  - `message` (string)
  - `id_post` (numero)

### PUT `/api/post/:id_post`
- Description: Modifica un post esistente.
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:id_post`
- Response: `501 Not Implemented`

### DELETE `/api/post/:id_post`
- Description: Elimina un post esistente.
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:id_post`
- Response: `501 Not Implemented`

---

## Messaggi

### GET `/api/message/inbox`
- Description: Lista delle conversazioni attive (stub).
- Headers:
  - `Authorization: <token>`
- Response (JSON):
  - `{ "message": "Lista chat attive" }`

### GET `/api/message/:id_message`
- Description: Recupera il dettaglio di un messaggio (stub).
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:id_message`
- Response (JSON):
  - `{ "message": "Dettaglio msg <id_message>" }`

### POST `/api/message`
- Description: Invia un messaggio (stub).
- Headers:
  - `Authorization: <token>`
- Request body: payload non specificato.
- Response (JSON):
  - `{ "message": "Messaggio inviato" }`

### DELETE `/api/message/:id_message`
- Description: Elimina un messaggio (stub).
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:id_message`
- Response (JSON):
  - `{ "message": "Messaggio <id_message> eliminato" }`

### GET `/api/message/conversation/:id_partner`
- Description: Recupera la cronologia con un partner di conversazione (stub).
- Headers:
  - `Authorization: <token>`
- Path parameters:
  - `:id_partner`
- Response (JSON):
  - `{ "message": "Chat con <id_partner>" }`

---

## Note sull'autenticazione

Tutte le route protette richiedono l'header:
- `Authorization: <token>`

Il token viene restituito da `/api/auth/login` e verificato dal middleware `checkAuth`.
