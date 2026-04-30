const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Makita1234%23%24.%2C@db.gyxazovkxkoafugfbnaj.supabase.co:5432/postgres',
});

async function run() {
  await client.connect();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin123!', salt);
  
  const email = 'admin@lumina.bank';
  const fullName = 'Admin Lumina';
  
  const check = await client.query("SELECT id FROM users WHERE email = $1", [email]);
  if (check.rows.length > 0) {
    await client.query("UPDATE users SET role = 'admin', password = $1 WHERE email = $2", [hashedPassword, email]);
    console.log('Admin updated');
  } else {
    await client.query(
      "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4)",
      [fullName, email, hashedPassword, 'admin']
    );
    console.log('Admin created');
  }
  await client.end();
}

run().catch(console.error);
