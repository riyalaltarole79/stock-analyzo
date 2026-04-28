const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const stockService = require('../services/stockService');

exports.trade = async (req, res) => {
  const { symbol, type, shares, price } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const totalCost = shares * price;

    if (type === 'BUY') {
      if (user.balance < totalCost) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Update balance
      user.balance -= totalCost;
      await user.save();

      // Update Portfolio
      let holding = await Portfolio.findOne({ user: userId, symbol });
      if (holding) {
        const newTotalShares = holding.shares + shares;
        const newAvgPrice = ((holding.shares * holding.averagePrice) + totalCost) / newTotalShares;
        holding.shares = newTotalShares;
        holding.averagePrice = newAvgPrice;
        await holding.save();
      } else {
        await Portfolio.create({ user: userId, symbol, shares, averagePrice: price });
      }
    } else if (type === 'SELL') {
      let holding = await Portfolio.findOne({ user: userId, symbol });
      if (!holding || holding.shares < shares) {
        return res.status(400).json({ message: 'Insufficient shares' });
      }

      user.balance += totalCost;
      await user.save();

      holding.shares -= shares;
      if (holding.shares === 0) {
        await Portfolio.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }
    }

    // Record Transaction
    await Transaction.create({ user: userId, symbol, type, shares, price, total: totalCost });

    res.json({ message: 'Trade successful', balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user.id });
    
    // Enrich with current prices
    const enrichedHoldings = await Promise.all(holdings.map(async (h) => {
      const quote = await stockService.getStockQuote(h.symbol);
      const currentValue = h.shares * quote.price;
      const profitLoss = currentValue - (h.shares * h.averagePrice);
      return {
        ...h._doc,
        currentPrice: quote.price,
        currentValue,
        profitLoss,
        profitLossPercent: (profitLoss / (h.shares * h.averagePrice)) * 100
      };
    }));

    res.json(enrichedHoldings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
