# Progetto-Informatica

A real-time chat application with posts and social features built with Node.js, React, PostgreSQL, and Docker.

## Live Deployment

- **App**: https://app.albe0x.com/
- **API**: https://api.albe0x.com/

## Features

- 🔐 User authentication and authorization
- 💬 Real-time chat with multiple users
- 📝 Post creation and feed
- 🔍 User search and profiles
- 👤 User profiles with admin capabilities
- ❤️ Post likes tracking

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
- `GET /api/auth/me` - Get current user

#### Users
- `GET /api/user/search` - Search users
- `GET /api/user/:username` - Get user profile (includes `isSuperAdmin`)
- `POST /api/user` - Create new user
- `PUT /api/user` - Update user profile

#### Posts
- `GET /api/post` - Get recommended posts feed
- `GET /api/post/user/:id_user` - Get user's posts
- `GET /api/post/:id_post` - Get single post (includes `likes`)
- `POST /api/post` - Create new post

#### Chat
- `GET /api/chat` - Get user's chats
- `GET /api/chat/:id_chat/members` - Get chat members
- `GET /api/chat/:id_chat/messages` - Get chat messages
- `POST /api/chat` - Create new chat
- `POST /api/chat/:id_chat/messages` - Send message

## Authentication

All protected routes require an `Authorization` header with the authentication token:

```
Authorization: <token>
```

## Response Format

All responses are in JSON format with database field names as-is (camelCase/snake_case as defined in database schema).

## Notes

- GET endpoints return full data including `likes` (posts) and `isSuperAdmin` (users)
- POST endpoints return minimal data (message and ID only)
- PUT and DELETE endpoints for posts and users are not yet implemented (return 501)
