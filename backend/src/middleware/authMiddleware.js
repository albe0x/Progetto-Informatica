const db = require('../db');
const createError = require('http-errors');

const checkAuth = async (req, res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization) {
        return next(createError(401, "Accesso negato: authorization mancante"));
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
            return next(createError(401, "Sessione non valida"));
        }

        req.user = { 
            id_user: user.id_user,
            username: user.username 
        };
        next();

    } catch (err) {
        return next(err);
    }
};

module.exports = checkAuth;


