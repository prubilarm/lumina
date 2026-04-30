const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');
const { sendConfirmationEmail } = require('../services/emailService');

exports.register = async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const totalUsers = await User.count();
        const role = totalUsers === 0 ? 'admin' : 'user';

        const newUser = await User.create(full_name, email, hashedPassword, role);

        // Account Numbers
        const savingsNumber = 'SAV-' + Math.floor(Math.random() * 1000000);
        const checkingNumber = 'CHK-' + Math.floor(Math.random() * 1000000);

        // Initial balance
        await Account.create(newUser.id, savingsNumber, 100000); // 100k CLP initial
        await Account.create(newUser.id, checkingNumber, 0);

        sendConfirmationEmail(email, full_name).catch(console.error);

        res.status(201).json({
            message: 'Usuario registrado con éxito',
            user: newUser,
            accounts: [
                { number: savingsNumber, currency: 'CLP' },
                { number: checkingNumber, currency: 'CLP' }
            ]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret_Lumina Bank',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.verifyPassword = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByIdWithPassword(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


