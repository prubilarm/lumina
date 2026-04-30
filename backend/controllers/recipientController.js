const Recipient = require('../models/Recipient');

exports.addRecipient = async (req, res) => {
    const { name, account_number, bank_name } = req.body;
    const userId = req.user.id;

    if (!name || !account_number) {
        return res.status(400).json({ message: 'Nombre y número de cuenta son obligatorios' });
    }

    try {
        const recipient = await Recipient.create(userId, name, account_number, bank_name);
        res.status(201).json(recipient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRecipients = async (req, res) => {
    try {
        const recipients = await Recipient.findByUserId(req.user.id);
        res.json(recipients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteRecipient = async (req, res) => {
    try {
        await Recipient.delete(req.params.id, req.user.id);
        res.json({ message: 'Contacto eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
