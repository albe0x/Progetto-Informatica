const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');

/*
 * I post sono accessibili a tutti gli utenti loggati
 * checkAuth deve avvenire con successo.
*/


//to do implemnet accual post racomdnation
// tutti
// GET /api/post (Feed globale)
router.get('/', checkAuth, (req, res) => res.json([1,6,3,8,10,2]));

// tutti
// GET /api/post/user/:id_user (Feed specifico di un utente)
router.get('/user/:id_user', checkAuth, async (req, res) => {
    try {
        sql = ` SELECT *
                FROM posts
                WHERE id_user = $1
                `
        const result = await db.query(sql, [req.params.id_user])
        return res.json(result.rows)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore creazione post" });
    }
})


// tutti
// GET /api/post/:id_post (Dettaglio singolo post)
router.get('/:id_post', checkAuth, async (req, res) => {
    try {
        sql = ` SELECT *
                FROM posts
                WHERE id_post = $1
                `
        const result = await db.query(sql, [req.params.id_post])
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Post non trovato" });
        }
        return res.json(result.rows[0])
    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: "Errore creazione post" });
    }

});


// solo proprietario
// POST /api/post (Crea nuovo post)
router.post('/', checkAuth, async(req, res) => {
    const {title, content, imageUrl} = req.body;
    try {
        sql = ` INSERT INTO posts(id_user, title, content, "imageUrl")
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
        console.log(err)
        return res.status(500).json({ error: "Errore creazione post" });
    }
});

// solo proprietario
// PUT /api/post/:id_post (Modifica post)
router.put('/:id_post', checkAuth, (req, res) => res.status(501).json({ message: `Post ${req.params.id_post} modificato` }));


// solo proprietario
// DELETE /api/post/:id_post (Elimina post)
router.delete('/:id_post', checkAuth, (req, res) => res.status(501).json({ message: `Post ${req.params.id_post} eliminato` }));


module.exports = router;