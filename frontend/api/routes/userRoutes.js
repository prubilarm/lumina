const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, userController.getProfile);
router.get('/balance', verifyToken, userController.getBalance);
router.get('/statement', verifyToken, userController.getStatement);

module.exports = router;
