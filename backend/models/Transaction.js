const db = require('../config/db');

class Transaction {
    static async create(senderAccountId, receiverAccountId, type, amount, description) {
        const result = await db.query(
            'INSERT INTO transactions (sender_account_id, receiver_account_id, type, amount, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [senderAccountId, receiverAccountId, type, amount, description]
        );
        return result.rows[0];
    }

    static async getByUserId(userId) {
        const result = await db.query(`
            SELECT t.* 
            FROM transactions t
            JOIN accounts a ON t.sender_account_id = a.id OR t.receiver_account_id = a.id
            WHERE a.user_id = $1
            ORDER BY t.created_at DESC
        `, [userId]);
        return result.rows;
    }

    static async getAll() {
        const result = await db.query(`
            SELECT t.*, 
                   u1.full_name as sender_name, 
                   u2.full_name as receiver_name
            FROM transactions t
            LEFT JOIN accounts a1 ON t.sender_account_id = a1.id
            LEFT JOIN users u1 ON a1.user_id = u1.id
            LEFT JOIN accounts a2 ON t.receiver_account_id = a2.id
            LEFT JOIN users u2 ON a2.user_id = u2.id
            ORDER BY t.created_at DESC
        `);
        return result.rows;
    }
}

module.exports = Transaction;
