const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');
const createError = require('http-errors');


router.get('/', checkAuth, async (req, res, next) => {
    try {
        const sql = ` SELECT c.id_chat, c.name , "joinedAt"
                FROM chats c JOIN chatmembers cm ON c.id_chat = cm.id_chat
                WHERE cm.id_user = $1
                ORDER BY c.id_chat DESC;
                `
        const result = await db.query(sql, [req.user.id_user])
        return res.json(result.rows)
    } catch(err) {
        return next(err);
    }
});

router.get('/:id_chat/members/', checkAuth, async (req, res) => {
    try {
        const sql = `
                SELECT u.id_user, u.username, cm."joinedAt"
                FROM chatmembers cm
                JOIN users u ON cm.id_user = u.id_user
                WHERE cm.id_chat = $1
                ORDER BY cm."joinedAt" ASC;
            `;
        const result = await db.query(sql, [req.params.id_chat])
        if (result.rowCount === 0) {
            return next(createError(404, "Membri della chat non trovati"));
        }
        return res.json(result.rows)
    } catch(err) {
        return next(err);
    }
});

router.get('/:id_chat/messages', checkAuth, async (req, res) => {
    const id_chat = req.params.id_chat;
    const id_user = req.user.id_user;

    try {
        const memberCheck = await db.query(
            'SELECT 1 FROM chatmembers WHERE id_chat = $1 AND id_user = $2',
            [id_chat, id_user]
        );

        if (memberCheck.rowCount === 0) {
            return next(createError(403, "Non hai i permessi per vedere questi messaggi"));
        }

        // 2. QUERY MESSAGGI: Recupera i messaggi e il nome del mittente
        const sql = `
            SELECT 
                m.id_message, 
                m.id_sender, 
                u.username, 
                m.content, 
                m."isRead", 
                m."createdAt"
            FROM messages m
            JOIN users u ON m.id_sender = u.id_user
            WHERE m.id_chat = $1
            ORDER BY m."createdAt" ASC;
        `;

        const result = await db.query(sql, [id_chat]);

        return res.json(result.rows);

    } catch(err) {
        return next(err);
    }
});

router.post('/', checkAuth, async (req, res) => {
    const { name, members = [] } = req.body;

    try {
        const chatSql = `
            INSERT INTO chats (name)
            VALUES ($1)
            RETURNING id_chat
        `;
        const chatResult = await db.query(chatSql, [name]);
        const newChatId = chatResult.rows[0].id_chat;

        if (members.length > 0) {
            const memberSql = `
                INSERT INTO chatmembers (id_chat, id_user)
                SELECT $1, id_user 
                FROM users 
                WHERE username = ANY($2)
            `;
            await db.query(memberSql, [newChatId, members]);
        }

        return res.status(201).json({ 
            message: "Chat created successfully", 
            id_chat: newChatId 
        });

    } catch(err) {
        return next(err);
    }
});

router.post('/:id_chat/messages', checkAuth, async (req, res, next) => {
    const { id_chat } = req.params;
    const { content } = req.body;
    const id_sender = req.user.id_user;

    try {
        const sql = `
            INSERT INTO messages (id_chat, id_sender, content)
            VALUES ($1, $2, $3)
            RETURNING id_message, id_chat, id_sender, content, "isRead", "createdAt"
        `;
        
        const result = await db.query(sql, [id_chat, id_sender, content]);
        
        return res.status(201).json(result.rows[0]);
    } catch(err) {
        return next(err);
    }
});


module.exports = router;