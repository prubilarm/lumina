const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Makita1234%23%24.%2C@db.gyxazovkxkoafugfbnaj.supabase.co:5432/postgres',
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT email, full_name, role FROM users ORDER BY created_at DESC LIMIT 5");
  console.log(JSON.stringify(res.rows));
  await client.end();
}

run().catch(console.error);
