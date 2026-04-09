// src/middleware/authMiddleware.js

const checkAuth = (req, res, next) => {
    const userId = req.headers['authorization']; // Legge l'ID dall'header

    if (!userId) {
        return res.status(401).json({ error: "Accesso negato: ID mancante" });
    }

    // Se l'ID c'è, lo "attacchiamo" alla richiesta così il controller sa chi è l'utente
    req.user = { id: userId }; 
    //TODO GET USER

    // Passiamo al prossimo passaggio (il controller)
    next();
};

module.exports = checkAuth;


