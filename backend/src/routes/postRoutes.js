const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');
const recommendationHelpers = require('../helpers/recommendationHelpers');
const createError = require('http-errors');


// tutti
// GET /api/post (Feed globale)
router.get('/', checkAuth, async (req, res, next) => {
    try {
        const sql = ` SELECT posts.*, users.username, users."isSuperAdmin", users."isVerified", posts.likes
                FROM posts 
                join users on posts.id_user = users.id_user
                WHERE id_post = ANY($1::int[])
                ORDER BY array_position($1::int[], id_post)
                `
        const postsIds = await recommendationHelpers.getRecommendedPosts(req);
        const result = await db.query(sql, [postsIds])
        return res.json(result.rows)
    } catch(err) {
        return next(err);
    }
});

// tutti
// GET /api/post/user/:id_user (Feed specifico di un utente)
router.get('/user/:id_user', checkAuth, async (req, res, next) => {
    try {
        const sql = ` SELECT posts.*, users.username, users."isSuperAdmin", users."isVerified", posts.likes
                FROM posts
                join users on posts.id_user = users.id_user
                WHERE posts.id_user = $1
                ORDER BY posts."createdAt" DESC
                `
        const result = await db.query(sql, [req.params.id_user])
        if (result.rowCount === 0) {
            return next(createError(404, "Nessun post trovato"));
        }
        return res.json(result.rows)
    } catch(err) {
        return next(err);
    }
})


// tutti
// GET /api/post/:id_post (Dettaglio singolo post)
router.get('/:id_post', checkAuth, async (req, res, next) => {
    try {
        const sql = ` SELECT posts.*, users.username, users."isSuperAdmin", users."isVerified", posts.likes
                FROM posts
                join users on posts.id_user = users.id_user
                WHERE id_post = $1
                `
        const result = await db.query(sql, [req.params.id_post])
        if (result.rowCount === 0) {
            return next(createError(404, "Nessun post trovato"));
        }
        return res.json(result.rows[0])
    } catch(err) {
        return next(err);
    }
});


// solo proprietario
// POST /api/post (Crea nuovo post)
router.post('/', checkAuth, async(req, res, next) => {
    const {title, content, imageUrl} = req.body;
    try {
        const sql = ` INSERT INTO posts(id_user, title, content, "imageUrl")
                VALUES ($1, $2, $3, $4)
                RETURNING id_post
        `
        const result = await db.query(sql, [req.user.id_user, title, content, imageUrl]);
        const newPostId = result.rows[0].id_post;
        return res.status(201).json({ 
            message: "Post creato", 
            id_post: newPostId 
        });
    } catch(err) {
        return next(err);
    }
});

// solo proprietario
// PUT /api/post/:id_post (Modifica post)
router.put('/:id_post', checkAuth, (req, res, next) => next(createError(501, "PUT NON IMPLEMENTATA")));


// DELETE /api/post/:id_post (Elimina post)
router.delete('/:id_post', checkAuth, async (req, res, next) => {
    try {
        let sql, params;
        if (req.user.isSuperAdmin) {
            // SuperAdmin can delete any post
            sql = `DELETE FROM posts WHERE id_post = $1`;
            params = [req.params.id_post];
        } else {
            // Regular users can only delete their own posts
            sql = `DELETE FROM posts WHERE id_post = $1 AND id_user = $2`;
            params = [req.params.id_post, req.user.id_user];
        }
        
        const result = await db.query(sql, params);
        if (result.rowCount === 0) {
            return next(createError(403, "Non hai i permessi o il post non esiste"));
        }
        return res.json({ message: "Post eliminato" });
    } catch(err) {
        return next(err);
    }
});


// ENDPOINT PER LIKE E COMMENTI

// POST /api/post/:id_post/like (Toggle Like)
router.post('/:id_post/like', checkAuth, async (req, res, next) => {
    try {
        const checkLike = await db.query('SELECT 1 FROM post_likes WHERE id_post = $1 AND id_user = $2', [req.params.id_post, req.user.id_user]);
        if (checkLike.rowCount > 0) {
            await db.query('DELETE FROM post_likes WHERE id_post = $1 AND id_user = $2', [req.params.id_post, req.user.id_user]);
            await db.query('UPDATE posts SET likes = likes - 1 WHERE id_post = $1', [req.params.id_post]);
            return res.json({ liked: false });
        } else {
            await db.query('INSERT INTO post_likes (id_post, id_user) VALUES ($1, $2)', [req.params.id_post, req.user.id_user]);
            await db.query('UPDATE posts SET likes = likes + 1 WHERE id_post = $1', [req.params.id_post]);
            return res.json({ liked: true });
        }
    } catch(err) { return next(err); }
});

// GET /api/post/:id_post/liked-status (Check like status)
router.get('/:id_post/liked-status', checkAuth, async (req, res, next) => {
    try {
        const checkLike = await db.query('SELECT 1 FROM post_likes WHERE id_post = $1 AND id_user = $2', [req.params.id_post, req.user.id_user]);
        return res.json({ liked: checkLike.rowCount > 0 });
    } catch(err) { return next(err); }
});

// GET /api/post/:id_post/comments (Lista commenti)
router.get('/:id_post/comments', checkAuth, async (req, res, next) => {
    try {
        const sql = `SELECT c.*, u.username FROM post_comments c JOIN users u ON c.id_user = u.id_user WHERE c.id_post = $1 ORDER BY c."createdAt" ASC`;
        const result = await db.query(sql, [req.params.id_post]);
        return res.json(result.rows);
    } catch(err) { return next(err); }
});

// POST /api/post/:id_post/comments (Aggiungi commento)
router.post('/:id_post/comments', checkAuth, async (req, res, next) => {
    try {
        const { content } = req.body;
        const sql = `INSERT INTO post_comments (id_post, id_user, content) VALUES ($1, $2, $3) RETURNING *`;
        const result = await db.query(sql, [req.params.id_post, req.user.id_user, content]);
        return res.status(201).json(result.rows[0]);
    } catch(err) { return next(err); }
});


module.exports = router;