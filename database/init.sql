CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    "displayName" VARCHAR(100),
    bio TEXT,
    "passwordHash" VARCHAR(255) NOT NULL,
    "authorizationToken" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id_post SERIAL PRIMARY KEY,
    id_user INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
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