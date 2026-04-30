const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT email, full_name, role FROM users WHERE role = 'admin'");
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
