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
        const sql = ` SELECT *, users.username
                FROM posts 
                join users on posts.id_user = users.id_user
                WHERE id_post = ANY($1::int[])
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
        const sql = ` SELECT *, users.username
                FROM posts
                join users on posts.id_user = users.id_user
                WHERE id_user = $1
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
        const sql = ` SELECT *, users.username
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


// solo proprietario
// DELETE /api/post/:id_post (Elimina post)
router.delete('/:id_post', checkAuth, (req, res, next) => next(createError(501, "DELETE NON IMPLEMENTATA")));


module.exports = router;