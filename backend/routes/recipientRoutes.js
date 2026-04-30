const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Recipients
 *   description: Saved contacts for transfers
 */

/**
 * @swagger
 * /recipients:
 *   get:
 *     summary: Get all saved recipients
 *     tags: [Recipients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recipients
 */
router.get('/', verifyToken, recipientController.getRecipients);

/**
 * @swagger
 * /recipients:
 *   post:
 *     summary: Add a new recipient
 *     tags: [Recipients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               account_number:
 *                 type: string
 *               bank_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipient created
 */
router.post('/', verifyToken, recipientController.addRecipient);

/**
 * @swagger
 * /recipients/{id}:
 *   delete:
 *     summary: Delete a recipient
 *     tags: [Recipients]
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
 *         description: Recipient deleted
 */
router.delete('/:id', verifyToken, recipientController.deleteRecipient);

module.exports = router;
