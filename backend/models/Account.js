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

    static async findByCardNumber(cardNumber) {
        // Remove spaces for comparison
        const cleanNumber = cardNumber.replace(/\s/g, '');
        const result = await db.query("SELECT * FROM accounts WHERE REPLACE(card_number, ' ', '') = $1", [cleanNumber]);
        return result.rows[0];
    }

    static async findByCardNumberWithDetails(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        const result = await db.query(`
            SELECT a.*, u.full_name as holder_name 
            FROM accounts a 
            JOIN users u ON a.user_id = u.id 
            WHERE REPLACE(a.card_number, ' ', '') = $1
        `, [cleanNumber]);
        return result.rows[0];
    }

    static async create(userId, accountNumber, initialBalance = 0) {
        const card_number = '4532 6944 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);
        const result = await db.query(
            'INSERT INTO accounts (user_id, account_number, balance, card_number) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, accountNumber, initialBalance, card_number]
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
