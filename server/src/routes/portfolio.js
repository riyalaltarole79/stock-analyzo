const express = require('express');
const router = express.Router();
const { trade, getPortfolio, getTransactions } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.post('/trade', protect, trade);
router.get('/holdings', protect, getPortfolio);
router.get('/transactions', protect, getTransactions);

module.exports = router;
