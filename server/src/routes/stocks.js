const express = require('express');
const router = express.Router();
const { getQuote, getNews, searchStocks } = require('../controllers/stockController');

router.get('/quote/:symbol', getQuote);
router.get('/news', getNews);
router.get('/search', searchStocks);

module.exports = router;
