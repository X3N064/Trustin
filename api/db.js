const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'db',
  database: 'trading',
  password: 'Qwer1234**',
  port: 5432,
});

module.exports = pool;
