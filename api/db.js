const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'trading',
    password: process.env.DB_PASSWORD || 'Qwer1234**',
    port: 5432,
});

module.exports = pool;
