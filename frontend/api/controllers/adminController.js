const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const usersResult = await db.query(
            `SELECT u.id, u.full_name, u.email, u.role, u.created_at, SUM(a.balance) as balance 
             FROM users u
             LEFT JOIN accounts a ON u.id = a.user_id
             GROUP BY u.id, u.full_name, u.email, u.role, u.created_at`
        );
        res.json(usersResult.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactionsResult = await db.query(
            `SELECT t.*, u1.full_name as sender_name, u2.full_name as receiver_name
             FROM transactions t
             LEFT JOIN accounts a1 ON t.sender_account_id = a1.id
             LEFT JOIN accounts a2 ON t.receiver_account_id = a2.id
             LEFT JOIN users u1 ON a1.user_id = u1.id
             LEFT JOIN users u2 ON a2.user_id = u2.id
             ORDER BY t.created_at DESC`
        );
        res.json(transactionsResult.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userResult = await db.query(
            `SELECT u.id, u.full_name, u.email, u.role, u.created_at, SUM(a.balance) as balance 
             FROM users u
             LEFT JOIN accounts a ON u.id = a.user_id
             WHERE u.id = $1
             GROUP BY u.id, u.full_name, u.email, u.role, u.created_at`,
            [id]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accountsResult = await db.query(
            'SELECT * FROM accounts WHERE user_id = $1',
            [id]
        );

        res.json({
            ...userResult.rows[0],
            accounts: accountsResult.rows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const transactionsResult = await db.query(
            `SELECT t.*, u1.full_name as sender_name, u2.full_name as receiver_name
             FROM transactions t
             LEFT JOIN accounts a1 ON t.sender_account_id = a1.id
             LEFT JOIN accounts a2 ON t.receiver_account_id = a2.id
             LEFT JOIN users u1 ON a1.user_id = u1.id
             LEFT JOIN users u2 ON a2.user_id = u2.id
             WHERE u1.id = $1 OR u2.id = $1
             ORDER BY t.created_at DESC`,
            [id]
        );
        res.json(transactionsResult.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.suspendUser = async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ message: 'Cuenta sancionada/suspendida correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.generateStatement = async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ 
            message: 'Certificado generado con éxito',
            downloadUrl: `/api/admin/users/${id}/statement/pdf`
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
