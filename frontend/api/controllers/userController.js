const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const userResult = await db.query('SELECT id, full_name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userResult.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBalance = async (req, res) => {
    try {
        const accountsResult = await db.query('SELECT account_number, balance, currency FROM accounts WHERE user_id = $1', [req.user.id]);
        res.json(accountsResult.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStatement = async (req, res) => {
    try {
        res.json({ 
            message: 'Cartola generada con éxito',
            downloadUrl: `/api/user/statement/pdf`
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
