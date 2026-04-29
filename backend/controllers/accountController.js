const Account = require('../models/Account');

const getAccountByUserId = async (req, res) => {
  try {
    const accounts = await Account.findByUserId(req.user.id);
    if (accounts.length === 0) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json(accounts); // Lumina Bank allows multiple accounts
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const accounts = await Account.findByUserId(req.user.id);
    // Return all balances for Lumina Bank
    res.json(accounts.map(acc => ({ account_number: acc.account_number, balance: acc.balance, currency: acc.currency })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAccountByUserId, getBalance };

