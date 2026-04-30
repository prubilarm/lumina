const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User Registration
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid data
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Unauthorized
 */
const { verifyToken } = require('../middlewares/authMiddleware');
router.post('/login', authController.login);
router.post('/verify-password', verifyToken, authController.verifyPassword);
router.get('/migrate-db', async (req, res) => {
    try {
        const db = require('../config/db');
        await db.query("ALTER TABLE accounts ADD COLUMN IF NOT EXISTS card_number VARCHAR(20) UNIQUE");
        const accounts = await db.query("SELECT id FROM accounts");
        for (const acc of accounts.rows) {
            const cardNum = '4532 6944 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);
            await db.query("UPDATE accounts SET card_number = $1 WHERE id = $2", [cardNum, acc.id]);
        }
        res.json({ message: 'Database migrated with new prefix successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
