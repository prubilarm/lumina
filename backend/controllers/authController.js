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

const db = require('../config/db');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'No existe un usuario con este correo' });
        }

        // Generate 6 digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await db.query('UPDATE users SET reset_code = $1, reset_expires = $2 WHERE id = $3', [resetCode, expires, user.id]);

        // In a real app, send email. For this demo, we return the code (or pretend we sent it)
        console.log(`Reset Code for ${email}: ${resetCode}`);
        
        res.json({ message: 'Código de recuperación enviado al correo (Demo: use ' + resetCode + ')' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1 AND reset_code = $2 AND reset_expires > NOW()', [email, code]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Código inválido o expirado' });
        }

        const user = userResult.rows[0];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = $1, reset_code = NULL, reset_expires = NULL WHERE id = $2', [hashedPassword, user.id]);

        res.json({ message: 'Contraseña restablecida con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.seedTestUser = async (req, res) => {
    try {
        const email = 'test@lumina.com';
        const password = 'password123';
        
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.json({ message: 'Usuario de prueba ya existe', user: userExists });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create('Test User', email, hashedPassword, 'user');
        
        // Create initial account
        await Account.create(newUser.id, 'SAV-TEST-999', 50000);
        
        res.json({ message: 'Usuario de prueba creado con éxito', user: email, password: password });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear usuario de prueba: ' + err.message });
    }
};
