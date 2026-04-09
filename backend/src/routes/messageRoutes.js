const express = require('express');
const router = express.Router();
const db = require('../db');
const checkAuth = require('../middleware/authMiddleware');

/*
 * I messaggi sono accessibili solamente al mittente e al destinatario
 * req.user === mittente || req.user === destinatario
*/

// mittente o destinatario
// GET /api/message/inbox (Lista delle ultime conversazioni)
router.get('/inbox', checkAuth, (req, res) => res.json({ message: "Lista chat attive" }));

// mittente o destinatario
// GET /api/message/:id_message (Dettaglio singolo messaggio)
router.get('/:id_message', checkAuth, (req, res) => res.json({ message: `Dettaglio msg ${req.params.id_message}` }));

// mittente
// POST /api/message (Invia messaggio - NB: La chat real-time userà anche Socket.io)
router.post('/', checkAuth, (req, res) => res.json({ message: "Messaggio inviato" }));

// mittente
// DELETE /api/message/:id_message (Elimina messaggio per tutti o per sé)
router.delete('/:id_message', checkAuth, (req, res) => res.json({ message: `Messaggio ${req.params.id_message} eliminato` }));

// -- EXTRA
// mittente o destinatario
// GET /api/message/conversation/:id_partner (Cronologia messaggi con un utente)
router.get('/conversation/:id_partner', checkAuth, (req, res) => res.json({ message: `Chat con ${req.params.id_partner}` }));

module.exports = router;