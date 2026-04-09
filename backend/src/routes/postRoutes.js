const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');

/*
 * I post sono accessibili a tutti gli utenti loggati
 * checkAuth deve avvenire con successo.
*/


// tutti
// GET /api/post (Feed globale)
router.get('/', checkAuth, (req, res) => res.json({ message: "Tutti i post" }));

// tutti
// GET /api/post/:id_post (Dettaglio singolo post)
router.get('/:id_post', checkAuth, (req, res) => res.json({ message: `Contenuto post ${req.params.id_post}` }));


// solo proprietario
// POST /api/post (Crea nuovo post)
router.post('/', checkAuth, (req, res) => res.json({ message: "Post creato" }));

// solo proprietario
// PUT /api/post/:id_post (Modifica post)
router.put('/:id_post', checkAuth, (req, res) => res.json({ message: `Post ${req.params.id_post} modificato` }));


// solo proprietario
// DELETE /api/post/:id_post (Elimina post)
router.delete('/:id_post', checkAuth, (req, res) => res.json({ message: `Post ${req.params.id_post} eliminato` }));


// -- EXTRA
// tutti
// GET /api/post/user/:id_user (Feed specifico di un utente)
router.get('/user/:id_user', checkAuth, (req, res) => res.json({ message: `Post dell'utente ${req.params.id_user}` }));

module.exports = router;