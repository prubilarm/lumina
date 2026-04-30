const db = require('../config/db');

class User {
    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query('SELECT id, full_name, email, role, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findByIdWithPassword(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(full_name, email, password, role) {
        const result = await db.query(
            'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
            [full_name, email, password, role]
        );
        return result.rows[0];
    }

    static async count() {
        const result = await db.query('SELECT COUNT(*) FROM users');
        return parseInt(result.rows[0].count);
    }

    static async getAll() {
        const result = await db.query(`
            SELECT u.id, u.full_name, u.email, u.role, u.created_at, SUM(a.balance) as balance
            FROM users u
            LEFT JOIN accounts a ON u.id = a.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
        return result.rows;
    }
}

module.exports = User;
