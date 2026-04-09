const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/auth/login
router.post('/login', (req, res) => res.json({ 
    message: "Login effettuato" 
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => res.json({ 
    message: "Logout effettuato" 
}));

// GET /api/auth/me (Restituisce l'utente loggato dall'header Authorization)
router.get('/me', (req, res) => res.json({ 
    message: "Dati profilo corrente" 
}));

module.exports = router;