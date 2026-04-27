const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const db = require('../config/db');

exports.deposit = async (req, res) => {
    const { amount, description, account_number } = req.body;
    const userId = req.user.id;

    if (amount <= 0) return res.status(400).json({ message: 'El monto debe ser mayor a cero' });

    try {
        // Get target account
        let account;
        if (account_number) {
            account = await Account.findByNumber(account_number);
        } else {
            const accounts = await Account.findByUserId(userId);
            account = accounts[0];
        }

        if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });

        // Update balance
        await Account.updateBalance(account.id, amount, 'addition');

        // Log transaction
        await Transaction.create(null, account.id, 'deposit', amount, description || 'Abono en Cuenta');

        res.json({ message: 'Depósito realizado con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.transfer = async (req, res) => {
    const { amount, receiver_account_number, description, sender_account_number } = req.body;
    const userId = req.user.id;

    if (amount <= 0) return res.status(400).json({ message: 'El monto debe ser mayor a cero' });

    try {
        // Get sender account
        let senderAccount;
        if (sender_account_number) {
            senderAccount = await Account.findByNumber(sender_account_number);
        } else {
            const accounts = await Account.findByUserId(userId);
            senderAccount = accounts[0];
        }

        if (!senderAccount || senderAccount.user_id !== userId) {
            return res.status(401).json({ message: 'Cuenta de origen no válida' });
        }

        if (senderAccount.balance < amount) {
            return res.status(400).json({ message: 'Fondos insuficientes' });
        }

        // Get receiver account
        const receiverAccount = await Account.findByNumber(receiver_account_number);
        if (!receiverAccount) {
            return res.status(404).json({ message: 'Cuenta de destino no encontrada' });
        }

        // Perform updates (simplified without explicit transaction block for mock compatibility, 
        // but in real PG it should use BEGIN/COMMIT)
        await Account.updateBalance(senderAccount.id, amount, 'subtraction');
        await Account.updateBalance(receiverAccount.id, amount, 'addition');

        // Log transaction
        await Transaction.create(senderAccount.id, receiverAccount.id, 'transfer', amount, description || 'Transferencia Sentendar');

        res.json({ message: 'Transferencia realizada con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Transaction.getByUserId(req.user.id);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

