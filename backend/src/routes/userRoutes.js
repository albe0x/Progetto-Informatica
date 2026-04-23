const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');
const createError = require('http-errors');


// tutti
// GET /api/user/?q=[] (Ricerca utenti)
router.get('/search', checkAuth, async(req, res, next) => {
    try {
        const result = await db.query(
            `SELECT id_user, username, "displayName", bio, "createdAt", "isSuperAdmin" FROM users WHERE username ILIKE $1 OR "displayName" ILIKE $1 LIMIT 50`, 
            ['%' + (req.query.q || '') + '%']
        );
        return res.status(200).json(result.rows)
    } catch(err) {
        return next(err);
    }
});

// tutti
// GET /api/user/:username (Dettaglio utente specifico)
router.get('/:username', checkAuth, async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT id_user, username, "displayName", bio, "createdAt", "isSuperAdmin" FROM users WHERE username = $1`, 
            [req.params.username]
        );
        if (result.rowCount === 0) {
            return next(createError(404, "Nessun utente trovato"));
        }
        const user = result.rows[0];
        return res.status(200).json(user)
    } catch(err) {
        return next(err);
    }
});

// tutti
// POST /api/user
router.post('/', async (req, res, next) => {
    const { username, password, displayName, bio } = req.body;
    if (!username || !password) {
        return next(createError(400, "Username e password obbligatori"));
    }
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const sql = `
                INSERT INTO users (username, "passwordHash", "displayName", bio)
                VALUES ($1, $2, $3, $4)
            `;
        await db.query(sql, [username, passwordHash, displayName, bio]);
        return res.status(201).json({ message: "Utente creato" });
    } catch(err) {
        return next(err);
    }
})

// solo utente stesso
// PUT /api/user/ (Modifica utente)
router.put('/', checkAuth, async (req, res, next) => {
    let { username, password, displayName, bio } = req.body;
    let passwordHash = password ? await bcrypt.hash(password, 10) : null;
    try{
        const selectResult = await db.query(
            `SELECT username, "passwordHash", "displayName", bio FROM users WHERE id_user = $1`, 
            [req.user.id_user]
        );
        if (selectResult.rowCount === 0) {
            return next(createError(404, "Utente non trovato"));
        }
        const currentUser = selectResult.rows[0];
        username = username || currentUser.username
        passwordHash = passwordHash || currentUser.passwordHash
        displayName = displayName || currentUser.displayName
        bio = bio ?? currentUser.bio
        const sql = `
            UPDATE users 
            SET username = $2, "passwordHash" = $3, "displayName" = $4, bio = $5
            WHERE id_user = $1
        `;
        await db.query(sql, [req.user.id_user, username, passwordHash, displayName, bio]);
        return res.status(200).json({ message: "Utente modificato" });
    } catch(err) {
        return next(err);
    }
})

// solo utente stesso
// DELETE /api/user/:username (Cancellazione utente)
router.delete('/:username', checkAuth, (req, res, next) => next(createError(501, "DELETE NON IMPLEMENTATA")));

module.exports = router;