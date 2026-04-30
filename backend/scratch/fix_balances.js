const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Makita1234%23%24.%2C@db.gyxazovkxkoafugfbnaj.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  // Set Admin balance to 10M CLP
  const adminRes = await client.query("SELECT id FROM users WHERE role = 'admin'");
  if (adminRes.rows.length > 0) {
      const adminId = adminRes.rows[0].id;
      await client.query("UPDATE accounts SET balance = 10000000 WHERE user_id = $1", [adminId]);
      console.log('Admin balance updated');
  }

  // Set other users to 1M CLP if they are at 0
  await client.query("UPDATE accounts SET balance = 1000000 WHERE balance = 0");
  
  console.log('Database balances updated');
  await client.end();
}

run().catch(console.error);
