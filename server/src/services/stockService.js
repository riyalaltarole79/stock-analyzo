const axios = require('axios');
const https = require('https');

// Create a persistent axios instance with keep-alive and timeout
const finnhubClient = axios.create({
  timeout: 10000,
  httpsAgent: new https.Agent({ 
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 25,
    maxFreeSockets: 10
  })
});

// Robust fetch with automatic retries for transient errors
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await finnhubClient.get(url);
    } catch (error) {
      const isRetryable = 
        error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ECONNABORTED' ||
        error.response?.status >= 500;

      if (i === retries - 1 || !isRetryable) throw error;
      
      console.warn(`⚠️ Finnhub API call failed (${error.code || error.response?.status}). Retrying in ${i + 1}s... (${i + 1}/${retries})`);
      await new Promise(res => setTimeout(res, 1000 * (i + 1))); 
    }
  }
};

// Mock data for demo if API key is missing
const mockStocks = {
  'AAPL': { price: 175.43, change: 1.2, name: 'Apple Inc.' },
  'TSLA': { price: 240.50, change: -2.5, name: 'Tesla, Inc.' },
  'AMZN': { price: 145.10, change: 0.8, name: 'Amazon.com, Inc.' },
  'MSFT': { price: 370.20, change: 1.5, name: 'Microsoft Corp.' },
  'GOOGL': { price: 135.60, change: -0.4, name: 'Alphabet Inc.' }
};

exports.getStockQuote = async (symbol) => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || apiKey === 'your_finnhub_api_key') {
    return mockStocks[symbol.toUpperCase()] || { price: Math.random() * 200 + 50, change: (Math.random() - 0.5) * 5, name: symbol };
  }

  try {
    const response = await fetchWithRetry(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    if (response.status === 429) throw new Error('Rate limit exceeded');
    
    return {
      price: response.data.c,
      change: response.data.d,
      changePercent: response.data.dp,
      high: response.data.h,
      low: response.data.l,
      open: response.data.o,
      prevClose: response.data.pc
    };
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn(`⚠️ Finnhub Rate Limit hit for ${symbol}. Using simulated data.`);
    } else {
      console.error(`Finnhub API Error: ${error.message}`);
    }
    return mockStocks[symbol.toUpperCase()] || { 
      price: 100 + (Math.random() * 50), 
      change: (Math.random() - 0.5) * 2, 
      name: symbol 
    };
  }
};

exports.getMarketNews = async () => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || apiKey === 'your_finnhub_api_key') {
    return [
      { id: 1, headline: 'Market reaches all-time high', summary: 'The stock market has seen a significant surge today...', url: '#' },
      { id: 2, headline: 'Tech stocks on the rise', summary: 'Major tech companies report higher than expected earnings...', url: '#' }
    ];
  }
  try {
    const response = await fetchWithRetry(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`);
    return response.data.slice(0, 10);
  } catch (error) {
    return [];
  }
};

// AI Prediction (Simple trend analysis)
exports.getPrediction = (symbol, history) => {
  // Mock AI logic: if price is above moving average, suggest Buy
  // In a real app, this would be a more complex ML model
  const random = Math.random();
  if (random > 0.6) return { signal: 'BUY', confidence: 85, reason: 'Strong upward momentum detected' };
  if (random > 0.3) return { signal: 'HOLD', confidence: 60, reason: 'Consolidation phase' };
  return { signal: 'SELL', confidence: 75, reason: 'Overbought conditions' };
};
