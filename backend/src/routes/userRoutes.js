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
            `SELECT id_user, username, "displayName", bio, "createdAt", "isSuperAdmin", "isVerified" FROM users WHERE username ILIKE $1 OR "displayName" ILIKE $1 LIMIT 50`,
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
            `SELECT id_user, username, "displayName", bio, "createdAt", "isSuperAdmin", "isVerified" FROM users WHERE LOWER(username) = LOWER($1)`, 
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

// POST /api/user/:id_user/follow (Toggle Follow)
router.post('/:id_user/follow', checkAuth, async (req, res, next) => {
    try {
        const follower_id = req.user.id_user;
        const followed_id = req.params.id_user;
        if (follower_id == followed_id) return next(createError(400, "Non puoi seguire te stesso"));

        const checkFollow = await db.query('SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = $2', [follower_id, followed_id]);
        
        if (checkFollow.rowCount > 0) {
            await db.query('DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2', [follower_id, followed_id]);
            return res.json({ followed: false });
        } else {
            await db.query('INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)', [follower_id, followed_id]);
            return res.json({ followed: true });
        }
    } catch(err) { return next(err); }
});

// GET /api/user/:id_user/following-status (Verifica se segui l'utente)
router.get('/:id_user/following-status', checkAuth, async (req, res, next) => {
    try {
        const checkFollow = await db.query('SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = $2', [req.user.id_user, req.params.id_user]);
        return res.json({ followed: checkFollow.rowCount > 0 });
    } catch(err) { return next(err); }
});

// GET /api/user/export (Export dei dati dell'utente)
router.get('/export/me', checkAuth, async (req, res, next) => {
    try {
        const id_user = req.user.id_user;
        const profile = await db.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        const posts = await db.query('SELECT * FROM posts WHERE id_user = $1', [id_user]);
        const comments = await db.query('SELECT * FROM post_comments WHERE id_user = $1', [id_user]);
        
        const exportData = {
            profile: profile.rows[0],
            posts: posts.rows,
            comments: comments.rows,
            exportedAt: new Date().toISOString(),
            notice: "Questi sono tutti i dati che il sistema ha memorizzato su di te."
        };
        
        res.setHeader('Content-disposition', 'attachment; filename=my_data.json');
        res.setHeader('Content-type', 'application/json');
        return res.json(exportData);
    } catch(err) { return next(err); }
});

// solo utente stesso
// DELETE /api/user/ (Cancellazione account)
router.delete('/', checkAuth, async (req, res, next) => {
    try {
        await db.query('DELETE FROM users WHERE id_user = $1', [req.user.id_user]);
        return res.json({ message: "Account eliminato correttamente" });
    } catch(err) { return next(err); }
});

// DELETE /api/user/:username (Mantenuto per compatibilità, punta al nuovo)
router.delete('/:username', checkAuth, async (req, res, next) => {
    if (req.user.username !== req.params.username && !req.user.isSuperAdmin) {
        return next(createError(403, "Non puoi eliminare questo account"));
    }
    try {
        await db.query('DELETE FROM users WHERE username = $1', [req.params.username]);
        return res.json({ message: "Account eliminato" });
    } catch(err) { return next(err); }
});

module.exports = router;