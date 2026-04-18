const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Makita1234%23%24.@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Polyfill para usar el mismo método de conexión si se necesita
pool.getConnection = async () => {
  const client = await pool.connect();
  client.query = async (text, params) => {
    return client.query(text, params); // Mantenemos compatible con client.query()
  };
  return client;
};

module.exports = pool;
