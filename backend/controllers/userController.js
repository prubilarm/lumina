const db = require('../config/db');
const bcrypt = require('bcryptjs');

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

exports.updateProfile = async (req, res) => {
    const { full_name, email } = req.body;
    const userId = req.user.id;

    try {
        const result = await db.query(
            'UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, full_name, email',
            [full_name, email, userId]
        );
        res.json({ message: 'Perfil actualizado con éxito', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const userResult = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBalance = async (req, res) => {
    try {
        const accountsResult = await db.query('SELECT id, account_number, balance, currency, card_number FROM accounts WHERE user_id = $1', [req.user.id]);
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
exports.blockAccount = async (req, res) => {
    const { accountId } = req.body;
    const userId = req.user.id;

    try {
        await db.query('UPDATE accounts SET is_blocked = TRUE WHERE id = $1 AND user_id = $2', [accountId, userId]);
        res.json({ message: 'Cuenta bloqueada con éxito por seguridad' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.unblockAccount = async (req, res) => {
    const { accountId } = req.body;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden desbloquear cuentas.' });
    }

    try {
        await db.query('UPDATE accounts SET is_blocked = FALSE WHERE id = $1', [accountId]);
        res.json({ message: 'Cuenta desbloqueada con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
