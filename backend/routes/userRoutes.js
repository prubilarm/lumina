const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and account details
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get('/profile', verifyToken, userController.getProfile);

/**
 * @swagger
 * /user/balance:
 *   get:
 *     summary: Get user account balance
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance data
 */
router.get('/balance', verifyToken, userController.getBalance);
router.get('/statement', verifyToken, userController.getStatement);

module.exports = router;
