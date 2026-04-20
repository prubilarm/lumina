const pool = require('./config/db');
const bcrypt = require('bcrypt');

const initDb = async () => {
  try {
    console.log('Connecting to database...');
    
    // 1. Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table checked/created.');

    // 2. Create Accounts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        account_number VARCHAR(20) UNIQUE NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Accounts table checked/created.');

    // 3. Create Transactions Table
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        type transaction_type NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        balance_after DECIMAL(15, 2) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Transactions table checked/created.');

    // 4. Seed Data
    const { rows: userExists } = await pool.query('SELECT * FROM users WHERE email = $1', ['juan@example.com']);
    
    if (userExists.length === 0) {
      console.log('Seeding initial data...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const { rows: juan } = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
        ['Juan Perez', 'juan@example.com', hashedPassword]
      );
      
      await pool.query(
        'INSERT INTO accounts (user_id, account_number, balance) VALUES ($1, $2, $3)',
        [juan[0].id, '1000000001', 5000.00]
      );
      
      console.log('Seed data inserted successfully.');
    } else {
      console.log('Initial user already exists. Skipping seeed.');
    }

    console.log('DATABASE READY!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDb();
