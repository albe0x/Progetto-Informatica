const db = require('../db');

const checkAuth = async (req, res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization) {
        return res.status(401).json({ error: "Accesso negato: authorization mancante" });
    }

    try{
        const sql = `
            SELECT id_user, username
            FROM users
            WHERE "authorizationToken" = $1
        ;`

        const result = await db.query(sql, [authorization]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Sessione non valida" });
        }

        req.user = { 
            id_user: user.id_user,   //req.user.id_user
            username: user.username 
        };
        next();

    } catch (err) {
        console.log('Error in checkAuth:', err);
        return res.status(500).json({ error: "Errore interno" });
    }
};

module.exports = checkAuth;


