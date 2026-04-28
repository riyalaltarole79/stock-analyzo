const stockService = require('../services/stockService');

exports.getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await stockService.getStockQuote(symbol);
    const prediction = stockService.getPrediction(symbol);
    res.json({ ...quote, prediction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNews = async (req, res) => {
  try {
    const news = await stockService.getMarketNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchStocks = async (req, res) => {
  // Simple mock search
  const { query } = req.query;
  const popular = ['AAPL', 'TSLA', 'AMZN', 'MSFT', 'GOOGL', 'META', 'NVDA', 'AMD'];
  const results = popular.filter(s => s.includes(query.toUpperCase()));
  res.json(results);
};
