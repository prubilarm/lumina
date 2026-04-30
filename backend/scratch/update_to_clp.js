const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Makita1234%23%24.%2C@db.gyxazovkxkoafugfbnaj.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  // Update all accounts to CLP
  await client.query("UPDATE accounts SET currency = 'CLP'");
  
  // Ensure all have card numbers
  const accounts = await client.query("SELECT id FROM accounts WHERE card_number IS NULL");
  for (const acc of accounts.rows) {
      const cardNum = '4532 6944 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);
      await client.query("UPDATE accounts SET card_number = $1 WHERE id = $2", [cardNum, acc.id]);
  }
  
  console.log('Database updated to CLP');
  await client.end();
}

run().catch(console.error);
