const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');


router.get('/chat', checkAuth, async (req, res) => {
    try {
        const sql = ` SELECT c.id_chat, c.name , "joinedAt"
                FROM chats c JOIN chatmembers cm ON c.id_chat = cm.id_chat
                WHERE cm.id_user = $1
                ORDER BY c.id_chat DESC;
                `
        const result = await db.query(sql, [req.user.id_user])
        return res.json(result.rows)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore recupero post" });
    }
});

router.get('/chat/:id_chat', checkAuth, async (req, res) => {
    try {
        const sql = `
                SELECT m.*, u.username AS sender_name
                FROM messages m
                JOIN users u ON m.id_sender = u.id_user
                WHERE m.id_chat = $1
                ORDER BY m."createdAt" ASC;
        `;
        const result = await db.query(sql, [req.params.id_chat])
        return res.json(result.rows)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore recupero post" });
    }
});

router.get('/chat/:id_chat/members/', checkAuth, async (req, res) => {
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
            return res.status(404).json({ error: "Post non trovato" });
        }
        return res.json(result.rows)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore recupero post" });
    }
});GET 


router.get('/chats/:id/messages', checkAuth, async (req, res) => {
    const id_chat = req.params.id; // Prende :id dalla rotta
    const id_user = req.user.id_user; // L'utente loggato dal middleware checkAuth

    try {
        const memberCheck = await db.query(
            'SELECT 1 FROM chatmembers WHERE id_chat = $1 AND id_user = $2',
            [id_chat, id_user]
        );

        if (memberCheck.rowCount === 0) {
            return res.status(403).json({ error: "Non hai i permessi per vedere questi messaggi" });
        }

        // 2. QUERY MESSAGGI: Recupera i messaggi e il nome del mittente
        const sql = `
            SELECT 
                m.id_message, 
                m.id_sender, 
                u.username AS sender_name, 
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

    } catch (err) {
        console.error("Errore recupero messaggi:", err);
        return res.status(500).json({ error: "Errore interno del server" });
    }
});

router.post('/chats/:id/messages', checkAuth, async (req, res) => {
    const id_chat = req.params.id;
    const id_sender = req.user.id_user;
    const { content } = req.body;

    // Controllo rapido: il messaggio non deve essere vuoto
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: "Il contenuto del messaggio non può essere vuoto" });
    }

    try {
        // 1. SICUREZZA: L'utente ha il diritto di inviare messaggi in questa chat?
        const membership = await db.query(
            'SELECT 1 FROM chatmembers WHERE id_chat = $1 AND id_user = $2',
            [id_chat, id_sender]
        );

        if (membership.rowCount === 0) {
            return res.status(403).json({ error: "Non sei un membro di questa chat" });
        }

        // 2. INSERIMENTO: Creiamo il messaggio
        const sql = `
            INSERT INTO messages (id_chat, id_sender, content)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const result = await db.query(sql, [id_chat, id_sender, content]);

        // Restituiamo il messaggio appena creato (utile per il frontend per aggiornare la UI)
        return res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("Errore invio messaggio:", err);
        return res.status(500).json({ error: "Impossibile inviare il messaggio" });
    }
});

router.post('/chats', checkAuth, async (req, res) => {
    const { name, participants } = req.body;
    const creatorId = req.user.id_user;

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
        return res.status(400).json({ error: "Devi invitare almeno un altro utente" });
    }

    // Iniziamo una transazione
    const client = await db.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Creiamo la chat
        const chatSql = 'INSERT INTO chats (name) VALUES ($1) RETURNING id_chat';
        const chatRes = await client.query(chatSql, [name || null]);
        const id_chat = chatRes.rows[0].id_chat;

        // 2. Prepariamo la lista di tutti i membri (creatore + partecipanti)
        const allMembers = [creatorId, ...participants];
        
        // Rimuoviamo eventuali duplicati per sicurezza
        const uniqueMembers = [...new Set(allMembers)];

        // 3. Inseriamo i membri nella tabella chatmembers
        // Usiamo un ciclo o una query multipla
        const memberSql = 'INSERT INTO chatmembers (id_chat, id_user) VALUES ($1, $2)';
        for (const userId of uniqueMembers) {
            await client.query(memberSql, [id_chat, userId]);
        }

        await client.query('COMMIT');
        
        return res.status(201).json({ 
            message: "Chat creata con successo", 
            id_chat 
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Errore creazione chat:", err);
        return res.status(500).json({ error: "Errore durante la creazione della chat" });
    } finally {
        client.release();
    }
});

module.exports = router;