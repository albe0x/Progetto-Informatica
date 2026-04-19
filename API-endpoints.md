# Backend API Endpoints

Base URL: `http://api.albe0x.com/api`
Base URL: `http://localhost:3000/api`

## Authentication

### `POST /api/auth/login`
- Auth: none
- Request JSON:
  - `username` (string, required)
  - `password` (string, required)

Example:
```json
{
  "username": "alice",
  "password": "secret"
}
```
- Success response (200):
```json
{
  "message": "Login effettuato",
  "token": "generated-token",
  "username": "alice"
}
```
- Errors:
  - `400` missing fields
  - `401` invalid username/password

### `POST /api/auth/logout`
- Auth: required
- Request: no body
- Response (200):
```json
{
  "message": "Logout effettuato con successo"
}
```

### `GET /api/auth/me`
- Auth: required
- Response (200): current user object
- Example:
```json
{
  "id_user": 1,
  "username": "alice"
}
```

---

## Chat Endpoints

### `GET /api/chat/`
- Auth: required
- Returns chats joined by the current user
- Response (200) example:
```json
[
  {
    "id_chat": 2,
    "name": "Group Chat",
    "joinedAt": "2026-04-17T12:00:00.000Z"
  }
]
```

### `GET /api/chat/:id_chat/members/`
- Auth: required
- Path param: `id_chat`
- Returns chat members
- Response example:
```json
[
  {
    "id_user": 1,
    "username": "alice",
    "joinedAt": "2026-04-17T12:00:00.000Z"
  }
]
```
- Errors:
  - `404` if no members found for the chat

### `GET /api/chat/:id_chat/messages`
- Auth: required
- Path param: `id_chat`
- Requires the user to belong to the chat
- Response example:
```json
[
  {
    "id_message": 5,
    "id_sender": 1,
    "username": "alice",
    "content": "Hello",
    "isRead": false,
    "createdAt": "2026-04-17T12:05:00.000Z"
  }
]
```
- Errors:
  - `403` if user is not chat member

### `POST /api/chat/`
- Auth: required
- Request JSON:
  - `name` (string)
  - `members` (array of usernames, optional)

Example:
```json
{
  "name": "New Chat",
  "members": ["bob", "carol"]
}
```
- Response (201):
```json
{
  "message": "Chat created successfully",
  "id_chat": 7
}
```

### `POST /api/chat/:id_chat/messages`
- Auth: required
- Path param: `id_chat`
- Request JSON:
  - `content` (string)

Example:
```json
{
  "content": "Hi everyone!"
}
```
- Response (201) example:
```json
{
  "id_message": 12,
  "id_chat": 7,
  "id_sender": 1,
  "content": "Hi everyone!",
  "isRead": false,
  "createdAt": "2026-04-17T12:10:00.000Z"
}
```

---

## Post Endpoints

### `GET /api/post/`
- Auth: required
- Returns a feed of recommended posts for the current user
- Response (200) example:
```json
[
  {
    "id_post": 10,
    "id_user": 1,
    "title": "Hello",
    "content": "Post content",
    "imageUrl": null,
    "username": "alice"
  }
]
```

### `GET /api/post/user/:id_user`
- Auth: required
- Path param: `id_user`
- Returns all posts by that user
- Response (200) example:
```json
[
  {
    "id_post": 10,
    "id_user": 1,
    "title": "Hello",
    "content": "Post content",
    "imageUrl": null,
    "username": "alice"
  }
]
```
- Errors:
  - `404` if no posts found for the user

### `GET /api/post/:id_post`
- Auth: required
- Path param: `id_post`
- Returns one post object
- Response (200) example:
```json
{
  "id_post": 10,
  "id_user": 1,
  "title": "Hello",
  "content": "Post content",
  "imageUrl": null,
  "username": "alice"
}
```
- Errors:
  - `404` if post not found

### `POST /api/post/`
- Auth: required
- Request JSON:
  - `title` (string)
  - `content` (string)
  - `imageUrl` (string|null)

Example:
```json
{
  "title": "New Post",
  "content": "This is my post",
  "imageUrl": "https://example.com/img.jpg"
}
```
- Response (201):
```json
{
  "message": "Post creato",
  "id_post": 11
}
```

### `PUT /api/post/:id_post`
- Auth: required
- Currently returns `501 Not Implemented`
- No actual update behavior yet

### `DELETE /api/post/:id_post`
- Auth: required
- Currently returns `501 Not Implemented`
- No actual deletion behavior yet

---

## User Endpoints

### `GET /api/user/`
- Auth: required
- Currently returns `501 Not Implemented`

### `GET /api/user/search?q=...`
- Auth: required
- Query param: `q` (search string)
- Returns matching users
- Response (200) example:
```json
[
  {
    "id_user": 3,
    "username": "bob",
    "displayName": "Bob",
    "bio": "Developer",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### `GET /api/user/:username`
- Auth: required
- Path param: `username`
- Returns a public user profile
- Response (200) example:
```json
{
  "id_user": 3,
  "username": "bob",
  "displayName": "Bob",
  "bio": "Developer",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### `POST /api/user`
- Auth: none
- Request JSON:
  - `username` (string, required)
  - `password` (string, required)
  - `displayName` (string, optional)
  - `bio` (string, optional)

Example:
```json
{
  "username": "alice",
  "password": "secret",
  "displayName": "Alice",
  "bio": "I love coding"
}
```
- Response (201):
```json
{
  "message": "Utente creato"
}
```

### `PUT /api/user/`
- Auth: required
- Request JSON may include any of:
  - `username`
  - `password`
  - `displayName`
  - `bio`

Example:
```json
{
  "displayName": "Alice Rossi",
  "bio": "Aggiornata bio"
}
```
- Response (200):
```json
{
  "message": "Utente modificato"
}
```

### `DELETE /api/user/:username`
- Auth: required
- Currently returns `501 Not Implemented`

---

## Notes
- Protected routes require header: `Authorization: <token>`
- Server listens on port `3000`
- Routes with `501 Not Implemented` are placeholders and do not perform actual delete/update operations yet.
