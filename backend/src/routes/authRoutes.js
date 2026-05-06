const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');
const createError = require('http-errors');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    const { username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username e password obbligatori" });
    }

    try {
    const sql = `
            SELECT id_user, "passwordHash", username
            FROM users
            WHERE LOWER(username) = LOWER($1)
        `;
    const result = await db.query(sql, [username]);
    const user = result.rows[0];

    if (!user) {
        return next(createError(401, "Credenziali non valide"));
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (isMatch) {
        const token = crypto.randomBytes(32).toString('hex');

        const updateSql = 'UPDATE users SET "authorizationToken" = $1 WHERE id_user = $2';
        await db.query(updateSql, [token, user.id_user]);

        return res.json({ 
            message: "Login effettuato", 
            token: token,
            username: user.username 
        });
    } else {
        return next(createError(401, "Credenziali non valide"));
    }
    } catch (err) {
       return next(err);
    }
});

// POST /api/auth/logout
router.post('/logout', checkAuth, async (req, res, next) => {
    try {
        const sql = `
                UPDATE users 
                SET "authorizationToken" = NULL 
                WHERE id_user = $1
            `;
        await db.query(sql, [req.user.id_user]);
        res.json({ message: "Logout effettuato con successo" });
    } catch (err) {
       return next(err);
    }
});

// GET /api/auth/me 
router.get('/me', checkAuth, (req, res) => {
    res.json(req.user)
});

module.exports = router;


