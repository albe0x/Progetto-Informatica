# Progetto-Informatica

A real-time chat application with posts and social features built with Node.js, React, PostgreSQL, and Docker.

## Live Deployment

- **App**: https://app.albe0x.com/
- **API**: https://api.albe0x.com/

## Features

- 🔐 User authentication and authorization
- 💬 Real-time chat with group management
- 📝 Post creation, likes, and comments
- 🔍 User search and profiles
- 👤 User profiles with verification and admin badges
- 🤝 User follow system
- 📥 Data portability (Export my data)

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: PostgreSQL
- **Deployment**: Docker + Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Run the Application

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3000
- Frontend application on port 5173

## API Documentation

For detailed API endpoint documentation, see [API-endpoints.md](API-endpoints.md)

### Main Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current session info

#### Users
- `GET /api/user/search` - Search users
- `GET /api/user/:username` - Get user profile
- `POST /api/user` - Create new user
- `PUT /api/user` - Update user profile
- `DELETE /api/user` - Delete account
- `POST /api/user/:id_user/follow` - Follow/Unfollow user

#### Posts
- `GET /api/post` - Recommended posts feed
- `POST /api/post` - Create new post
- `DELETE /api/post/:id_post` - Delete post (Proprietario o SuperAdmin)
- `POST /api/post/:id_post/like` - Like/Unlike post
- `POST /api/post/:id_post/comments` - Add comment

#### Chat
- `GET /api/chat` - List user's chats
- `POST /api/chat` - Create new chat
- `POST /api/chat/:id_chat/messages` - Send message
- `POST /api/chat/:id_chat/members` - Add members to chat

## Authentication

All protected routes require an `Authorization` header with the authentication token:

```
Authorization: <token>
```

## Admin Capabilities

Users with `isSuperAdmin: true` (managed via database) can:
- Delete any post.
- Delete any user account.
- View administrative indicators in the UI.

## Notes

- GET endpoints return enriched data (likes, verification status, etc.)
- DELETE endpoints are fully functional with permission checks.
- PUT /api/post/:id_post is currently a placeholder.
