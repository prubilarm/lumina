const pool = require('../config/db');

const getAccountByUserId = async (req, res) => {
  try {
    const [accounts] = await pool.query('SELECT * FROM accounts WHERE user_id = ?', [req.user.id]);
    if (accounts.length === 0) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json(accounts[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const [accounts] = await pool.query('SELECT balance FROM accounts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (accounts.length === 0) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json(accounts[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAccountByUserId, getBalance };
