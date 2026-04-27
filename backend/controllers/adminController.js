const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.getAll();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const accounts = await Account.findByUserId(id);

        res.json({
            ...user,
            accounts: accounts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const transactions = await Transaction.getByUserId(id);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.suspendUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Logic for role update
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        
        // This would normally be a User.update method
        const db = require('../config/db');
        await db.query('UPDATE users SET role = $1 WHERE id = $2', ['suspended', id]);
        
        res.json({ message: 'Cuenta sancionada/suspendida correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.generateStatement = async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ 
            message: 'Certificado bancario generado con éxito',
            downloadUrl: `https://sentendar-bank.vercel.app/api/admin/users/${id}/statement/pdf`
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

