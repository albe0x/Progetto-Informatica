const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'username',
  password: 'password',
  database: 'db_name',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

/*
async function getUser() {
  const res = await db.query('SELECT * FROM users WHERE nome = $1 AND cognome = $2 ', [1, 2]);
  console.log(res.rows[0]);
}
 */