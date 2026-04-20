const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer, getHistory } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     summary: Deposit money into account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Deposit successful
 */
router.post('/deposit', protect, deposit);

/**
 * @swagger
 * /api/transactions/withdraw:
 *   post:
 *     summary: Withdraw money from account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Withdrawal successful
 */
router.post('/withdraw', protect, withdraw);

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Transfer money between accounts
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccountId:
 *                 type: string
 *               toAccountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post('/transfer', protect, transfer);

/**
 * @swagger
 * /api/transactions/history/{accountId}:
 *   get:
 *     summary: Get transaction history for an account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 */
router.get('/history/:accountId', protect, getHistory);

module.exports = router;
