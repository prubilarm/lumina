require('dotenv').config();
const db = require('./config/db');

async function createRecipientsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS recipients (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            name TEXT NOT NULL,
            account_number TEXT NOT NULL,
            bank_name TEXT DEFAULT 'Lumina Bank',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await db.query(query);
        console.log('Table "recipients" created successfully or already exists.');
    } catch (err) {
        console.error('Error creating "recipients" table:', err);
    } finally {
        process.exit();
    }
}

createRecipientsTable();
