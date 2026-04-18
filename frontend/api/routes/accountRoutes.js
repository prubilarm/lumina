const express = require('express');
const router = express.Router();
const { getAccountByUserId, getBalance } = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/me', protect, getAccountByUserId);
router.get('/:id/balance', protect, getBalance);

module.exports = router;
