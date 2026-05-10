const { Pool } = require('pg');

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'username',
  password: 'password',
  database: 'db_name',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
