'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import StockCard from '@/components/stocks/StockCard';
import { Search, Loader2, TrendingUp, Globe, Filter } from 'lucide-react';

export default function MarketPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const popularSymbols = ['AAPL', 'TSLA', 'AMZN', 'MSFT', 'GOOGL', 'NVDA', 'META', 'AMD'];

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const results = await Promise.all(
          popularSymbols.map(async (symbol) => {
            const { data } = await api.get(`/stocks/quote/${symbol}`);
            return { symbol, ...data };
          })
        );
        setStocks(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Market Overview</h1>
          <p className="text-slate-400">Discover and track global assets in real-time</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search symbol or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xl"
          />
        </div>
      </div>

      {/* Market Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <MarketStat label="S&P 500" value="5,024.12" change="+1.24%" isPositive={true} />
        <MarketStat label="Nasdaq" value="15,990.66" change="+1.56%" isPositive={true} />
        <MarketStat label="Dow Jones" value="38,677.32" change="-0.08%" isPositive={false} />
        <MarketStat label="Bitcoin" value="$64,320.50" change="+4.32%" isPositive={true} />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-500 animate-pulse">Loading live market data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name || 'Company Name'}
              price={stock.price}
              change={stock.change}
              changePercent={(stock.change / stock.price) * 100}
            />
          ))}
        </div>
      )}

      {!loading && filteredStocks.length === 0 && (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
          <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">No stocks found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

function MarketStat({ label, value, change, isPositive }: any) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl flex justify-between items-center">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
      <div className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {change}
      </div>
    </div>
  );
}
