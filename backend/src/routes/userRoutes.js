const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');




// tutti
// GET /api/user (Lista utenti)
router.get('/', checkAuth, (req, res) => res.status(501).json({ message: `Funzione non implementata` }));

// tutti
// GET /api/user/search?q=[] (Ricerca utenti)
router.get('/search', checkAuth, async(req, res) => {
    try {
        if (!req.query.q || req.query.q.trim() === "") {
            return res.status(200).json([]); // Restituisci un array vuoto
        }
        const result = await db.query(
            `SELECT id_user, username, "displayName", bio, "createdAt" FROM users WHERE username Ilike $1 OR "displayName" Ilike $1 LIMIT 50`, 
            ['%' + req.query.q + '%']
        );
        return res.status(200).json(result.rows)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore interno" });
    }
});

// tutti
// GET /api/user/:username (Dettaglio utente specifico)
router.get('/:username', checkAuth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id_user, username, "displayName", bio, "createdAt" FROM users WHERE username = $1`, 
            [req.params.username]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Utente non trovato" });
        }
        const user = result.rows[0];
        return res.status(200).json(user)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore interno" });
    }
});

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
        return res.status(500).json({ error: "Errore registrazione" });
    }
})

// solo utente stesso
// PUT /api/user/ (Modifica utente)
router.put('/', checkAuth, async (req, res) => {
    let { username, password, displayName, bio } = req.body;
    let passwordHash = password ? await bcrypt.hash(password, 10) : null;

    try{
        const selectResult = await db.query(
            `SELECT username, "passwordHash", "displayName", bio FROM users WHERE id_user = $1`, 
            [req.user.id_user]
        );

        if (selectResult.rowCount === 0) {
            return res.status(404).json({ error: "Utente non trovato" });
        }
        const currentUser = selectResult.rows[0];

        username = username || currentUser.username
        passwordHash = passwordHash || currentUser.passwordHash
        displayName = displayName || currentUser.displayName
        bio = bio ?? currentUser.bio      // accetta "" come true

        const sql = `
            UPDATE users 
            SET username = $2, "passwordHash" = $3, "displayName" = $4, bio = $5
            WHERE id_user = $1
        `;
        const result = await db.query(sql, [req.user.id_user, username, passwordHash, displayName, bio]);

        return res.status(200).json({ message: "Utente modificato" });

    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore modifica" });
    }
})


// solo utente stesso
// DELETE /api/user/:username (Cancellazione utente)
router.delete('/:username', checkAuth, (req, res) => res.status(501).json({ message: `Funzione non implementata` }));

module.exports = router;