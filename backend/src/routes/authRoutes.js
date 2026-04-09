const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username e password obbligatori" });
    }

    try {
    const sql = `
            SELECT id_user, "passwordHash"
            FROM users
            WHERE username = $1
        `;
    const result = await db.query(sql, [username]);
    const user = result.rows[0];

    if (!user) {
        return res.status(401).json({ message: "Password o nome utente sbagliato" });
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (isMatch) {
        const token = crypto.randomBytes(32).toString('hex');

        const updateSql = 'UPDATE users SET "authorizationToken" = $1 WHERE id_user = $2';
        await db.query(updateSql, [token, user.id_user]);

        return res.json({ 
            message: "Login effettuato", 
            token: token,
            username: username 
        });
    } 
        return res.status(401).json({ message: "Password o nome utente sbagliato" });
    } catch {
       return res.status(500).json({ error: "Errore durante il login" });
    }
});

// POST /api/auth/logout
router.post('/logout', checkAuth, async (req, res) => {
    try {
        const sql = `
                UPDATE users 
                SET "authorizationToken" = NULL 
                WHERE id_user = $1
            `;
        await db.query(sql, [req.user.id_user]);
        res.json({ message: "Logout effettuato con successo" });
    } catch {
        res.status(500).json({ error: "Errore durante il logout" });
    }
});

// GET /api/auth/me 
router.get('/me', checkAuth, (req, res) => {
    res.json(req.user)
});

module.exports = router;


