const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');

/*
 * I messaggi sono accessibili solamente al mittente e al destinatario
 * req.user === mittente || req.user === destinatario
*/





// mittente o destinatario
// GET /api/message/:id_message (Dettaglio singolo messaggio)
router.get('/messages/:id', checkAuth, async (req, res) => {
    const id_message = req.params.id;
    const id_user = req.user.id_user; // L'utente loggato

    try {
        const sql = `
            SELECT 
                m.*, 
                u.username AS sender_name
            FROM messages m
            JOIN users u ON m.id_sender = u.id_user
            JOIN chatmembers cm ON m.id_chat = cm.id_chat
            WHERE m.id_message = $1 AND cm.id_user = $2
        `;

        const result = await db.query(sql, [id_message, id_user]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Messaggio non trovato o accesso negato" });
        }

        return res.json(result.rows[0]); // Restituiamo solo l'oggetto del messaggio
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore nel recupero del messaggio" });
    }
});

// mittente
// DELETE /api/message/:id_message (Elimina messaggio per tutti o per sé)
router.delete('/:id_message', checkAuth, (req, res) => res.status(501).json({ message: `Messaggio ${req.params.id_message} eliminato` }));


module.exports = router;