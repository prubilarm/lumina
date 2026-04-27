const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details and accounts
 *       404:
 *         description: User not found
 */
router.get('/users/:id', verifyToken, isAdmin, adminController.getUserDetails);

/**
 * @swagger
 * /admin/users/{id}/transactions:
 *   get:
 *     summary: Get transaction history for a specific user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of transactions for the user
 */
router.get('/users/:id/transactions', verifyToken, isAdmin, adminController.getUserTransactions);

/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 */
router.get('/transactions', verifyToken, isAdmin, adminController.getAllTransactions);
router.post('/users/:id/suspend', verifyToken, isAdmin, adminController.suspendUser);
router.get('/users/:id/statement', verifyToken, isAdmin, adminController.generateStatement);

module.exports = router;
