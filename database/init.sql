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

CREATE TABLE messages (
    id_message SERIAL PRIMARY KEY,
    id_sender INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    id_receiver INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    content TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);