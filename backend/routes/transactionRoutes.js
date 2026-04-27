const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Money movement operations
 */

/**
 * @swagger
 * /transactions/deposit:
 *   post:
 *     summary: Deposit money into the account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deposit successful
 */
router.post('/deposit', verifyToken, transactionController.deposit);

/**
 * @swagger
 * /transactions/transfer:
 *   post:
 *     summary: Transfer money to another account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - receiver_account_number
 *             properties:
 *               amount:
 *                 type: number
 *               receiver_account_number:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post('/transfer', verifyToken, transactionController.transfer);

/**
 * @swagger
 * /transactions/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/history', verifyToken, transactionController.getHistory);

module.exports = router;
