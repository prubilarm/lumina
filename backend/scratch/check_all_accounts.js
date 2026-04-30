const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Makita1234%23%24.%2C@db.gyxazovkxkoafugfbnaj.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT u.full_name, a.account_number, a.balance, a.card_number 
    FROM users u 
    JOIN accounts a ON u.id = a.user_id 
    ORDER BY u.full_name
  `);
  console.table(res.rows);
  await client.end();
}

run().catch(console.error);
