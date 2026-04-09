const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');




// TODO ==============================================
// tutti
// GET /api/user (Lista utenti)
router.get('/', checkAuth, (req, res) => res.json({ message: "Tutti gli utenti" }));

// TODO ==============================================
// tutti
// GET /api/user/search?q=[] (Ricerca utenti)
router.get('/search', checkAuth, (req, res) => res.json({ message: `Cerco utenti per: ${req.query.q}` }));

// TODO ==============================================
// tutti
// GET /api/user/:username (Dettaglio utente specifico)
router.get('/:username', checkAuth, (req, res) => res.json({ message: `Dati di ${req.params.username}` }));

// tutti
// POST /api/user
router.post('/', async (req, res) => {
    const { username, password, displayName, bio } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username e password obbligatori" });
    }

    try {
    const passwordHash = await bcrypt.hash(password, 10);
    const sql = `
            INSERT INTO users (username, "passwordHash", "displayName", bio)
            VALUES ($1, $2, $3, $4)
        `;
    const result = await db.query(sql, [username, passwordHash, displayName, bio]);

    return res.status(201).json({ message: "Utente creato" });

    } catch(err) {
        console.log(err)
        return res.status(400).json({ error: "Errore registrazione" });
    }
})

// TODO ==============================================
// solo utente stesso
// PUT /api/user/:username (Modifica utente)
router.put('/:username', checkAuth, (req, res) => res.json({ message: `Utente ${req.params.username} aggiornato` }));

// TODO ==============================================
// solo utente stesso
// DELETE /api/user/:username (Cancellazione utente)
router.delete('/:username', checkAuth, (req, res) => res.json({ message: `Utente ${req.params.username} eliminato` }));

module.exports = router;