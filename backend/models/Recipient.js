const db = require('../config/db');

class Recipient {
    static async ensureTable() {
        await db.query(`
            CREATE TABLE IF NOT EXISTS recipients (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                name TEXT NOT NULL,
                account_number TEXT NOT NULL,
                bank_name TEXT DEFAULT 'Lumina Bank',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    static async create(userId, name, accountNumber, bankName = 'Lumina Bank') {
        await this.ensureTable();
        const result = await db.query(
            'INSERT INTO recipients (user_id, name, account_number, bank_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, name, accountNumber, bankName]
        );
        return result.rows[0];
    }

    static async findByUserId(userId) {
        await this.ensureTable();
        const result = await db.query(
            'SELECT * FROM recipients WHERE user_id = $1 ORDER BY name ASC',
            [userId]
        );
        return result.rows;
    }

    static async delete(id, userId) {
        await this.ensureTable();
        await db.query('DELETE FROM recipients WHERE id = $1 AND user_id = $2', [id, userId]);
    }
}

module.exports = Recipient;
