CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    "displayName" VARCHAR(100),
    bio TEXT,
    "passwordHash" VARCHAR(255) NOT NULL,
    "authorizationToken" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "isSuperAdmin" BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX idx_users_username_lower ON users (LOWER(username));

CREATE TABLE posts (
    id_post SERIAL PRIMARY KEY,
    id_user INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    "imageUrl" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella delle conversazioni
CREATE TABLE chats (
    id_chat SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE chatmembers (
    id_chat INT NOT NULL REFERENCES chats(id_chat) ON DELETE CASCADE,
    id_user INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    "joinedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_chat, id_user)
);

-- Tabella dei messaggi (aggiornata)
CREATE TABLE messages (
    id_message SERIAL PRIMARY KEY,
    id_chat INT NOT NULL REFERENCES chats(id_chat) ON DELETE CASCADE, -- IL PONTE
    id_sender INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    content TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nuova tabella per i like
CREATE TABLE post_likes (
    id_post INT NOT NULL REFERENCES posts(id_post) ON DELETE CASCADE,
    id_user INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    PRIMARY KEY (id_post, id_user)
);

-- Nuova tabella per i commenti
CREATE TABLE post_comments (
    id_comment SERIAL PRIMARY KEY,
    id_post INT NOT NULL REFERENCES posts(id_post) ON DELETE CASCADE,
    id_user INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per i follow
CREATE TABLE follows (
    follower_id INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    followed_id INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, followed_id),
    CHECK (follower_id != followed_id)
);

