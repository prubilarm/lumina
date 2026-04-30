const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'db.gyxazovkxkoafugfbnaj.supabase.co',
  database: 'postgres',
  password: 'Makita1234#$.,',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT email, full_name, role FROM users ORDER BY created_at DESC LIMIT 5");
  console.log(JSON.stringify(res.rows));
  await client.end();
}

run().catch(console.error);
