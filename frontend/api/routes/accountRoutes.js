const express = require('express');
const router = express.Router();
const { getAccountByUserId, getBalance } = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/accounts/me:
 *   get:
 *     summary: Get current user account details
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 */
router.get('/me', protect, getAccountByUserId);

/**
 * @swagger
 * /api/accounts/{id}/balance:
 *   get:
 *     summary: Get balance for a specific account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 */
router.get('/:id/balance', protect, getBalance);

module.exports = router;
