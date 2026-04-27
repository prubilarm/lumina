const db = require('../config/db');

class Account {
    static async findByUserId(userId) {
        const result = await db.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
        return result.rows;
    }

    static async findByNumber(accountNumber) {
        const result = await db.query('SELECT * FROM accounts WHERE account_number = $1', [accountNumber]);
        return result.rows[0];
    }

    static async create(userId, accountNumber, initialBalance = 0) {
        const result = await db.query(
            'INSERT INTO accounts (user_id, account_number, balance) VALUES ($1, $2, $3) RETURNING *',
            [userId, accountNumber, initialBalance]
        );
        return result.rows[0];
    }

    static async updateBalance(accountId, amount, type = 'addition') {
        const query = type === 'addition' 
            ? 'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *'
            : 'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING *';
        
        const result = await db.query(query, [amount, accountId]);
        return result.rows[0];
    }
}

module.exports = Account;
