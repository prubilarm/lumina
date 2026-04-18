const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer, getHistory } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.get('/history/:accountId', protect, getHistory);

module.exports = router;
