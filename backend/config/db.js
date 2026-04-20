const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbPromise = open({
  filename: path.join(__dirname, '../database.sqlite'),
  driver: sqlite3.Database
}).then(async (db) => {
  console.log('Using SQLite local database.');
  
  // Initialize tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      account_number TEXT UNIQUE NOT NULL,
      balance DECIMAL(15, 2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      balance_after DECIMAL(15, 2) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_account_id INTEGER NOT NULL REFERENCES accounts(id),
      to_account_id INTEGER NOT NULL REFERENCES accounts(id),
      amount DECIMAL(15, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
});

// Wrapper to mimic pg Pool interface
const pool = {
  query: async (text, params = []) => {
    const db = await dbPromise;
    
    // Convert PostgreSQL $1, $2 to SQLite ?
    let sqliteText = text.replace(/\$\d+/g, '?');
    
    // SQLite doesn't support "RETURNING id" in older versions usually
    // We'll strip it and use lastID if it's an INSERT
    const isInsert = sqliteText.trim().toLowerCase().startsWith('insert');
    const cleanedText = sqliteText.replace(/RETURNING\s+id/gi, '').trim();

    if (cleanedText.toLowerCase().startsWith('select')) {
      const rows = await db.all(cleanedText, params);
      return { rows };
    } else {
      const result = await db.run(cleanedText, params);
      const rows = isInsert ? [{ id: result.lastID }] : [];
      return { rows, lastID: result.lastID };
    }
  },
  connect: async () => {
    const db = await dbPromise;
    return {
      query: (text, params) => pool.query(text, params),
      release: () => {}
    };
  },
  getConnection: async () => {
    const db = await dbPromise;
    return {
      query: (text, params) => pool.query(text, params),
      release: () => {}
    };
  }
};

module.exports = pool;
