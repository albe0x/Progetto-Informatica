const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');


// GET /api/user (Lista utenti)
router.get('/', checkAuth, (req, res) => res.json({ message: "Tutti gli utenti" }));

// GET /api/user/search?q=[] (Ricerca utenti)
router.get('/search', checkAuth, (req, res) => res.json({ message: `Cerco utenti per: ${req.query.q}` }));

// GET /api/user/:username (Dettaglio utente specifico)
router.get('/:username', checkAuth, (req, res) => res.json({ message: `Dati di ${req.params.username}` }));

// POST /api/user (Creazione nuovo utente / Registrazione)
router.post('/', (req, res) => res.json({ message: "Utente creato" }));

// PUT /api/user/:username (Modifica utente)
router.put('/:username', checkAuth, (req, res) => res.json({ message: `Utente ${req.params.username} aggiornato` }));

// DELETE /api/user/:username (Cancellazione utente)
router.delete('/:username', checkAuth, (req, res) => res.json({ message: `Utente ${req.params.username} eliminato` }));

module.exports = router;