const stockService = require('../services/stockService');

const socketHandler = (io) => {
  console.log('Socket initialized');

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join a room for a specific stock
    socket.on('subscribe', (symbol) => {
      socket.join(symbol);
      console.log(`Client ${socket.id} subscribed to ${symbol}`);
    });

    socket.on('unsubscribe', (symbol) => {
      socket.leave(symbol);
      console.log(`Client ${socket.id} unsubscribed from ${symbol}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Simulate real-time updates for popular stocks
  const symbols = ['AAPL', 'TSLA', 'AMZN', 'MSFT', 'GOOGL', 'NVDA'];
  
  const updateMarket = async () => {
    for (const symbol of symbols) {
      try {
        const quote = await stockService.getStockQuote(symbol);
        
        // Add slight random fluctuation for simulation if needed
        if (process.env.FINNHUB_API_KEY === 'your_finnhub_api_key' || !quote.open) {
          quote.price += (Math.random() - 0.5) * 0.2;
        }
        
        io.to(symbol).emit('priceUpdate', {
          symbol,
          price: quote.price,
          change: quote.change,
          timestamp: new Date()
        });
        
        io.to('market').emit('marketUpdate', {
          symbol,
          price: quote.price,
          change: quote.change
        });
        
        // Add a small delay between each symbol to spread out API calls
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Error updating ${symbol}:`, err.message);
      }
    }
  };

  // Run update every 10 seconds to stay well within free tier limits
  setInterval(updateMarket, 10000);
  updateMarket(); // Initial run
};

module.exports = socketHandler;
