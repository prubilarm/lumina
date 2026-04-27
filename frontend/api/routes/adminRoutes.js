const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/users/:id', verifyToken, isAdmin, adminController.getUserDetails);
router.get('/users/:id/transactions', verifyToken, isAdmin, adminController.getUserTransactions);
router.get('/transactions', verifyToken, isAdmin, adminController.getAllTransactions);
router.post('/users/:id/suspend', verifyToken, isAdmin, adminController.suspendUser);
router.get('/users/:id/statement', verifyToken, isAdmin, adminController.generateStatement);

module.exports = router;
