const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'db.gyxazovkxkoafugfbnaj.supabase.co',
  database: 'postgres',
  password: 'Makita1234#$.,',
  port: 5432,
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT email, full_name, role FROM users WHERE role = 'admin'");
  console.log(JSON.stringify(res.rows));
  await client.end();
}

run().catch(console.error);
