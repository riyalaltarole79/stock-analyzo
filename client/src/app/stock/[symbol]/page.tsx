'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import api from '@/services/api';
import StockChart from '@/components/stocks/StockChart';
import TradingPanel from '@/components/stocks/TradingPanel';
import PredictionCard from '@/components/stocks/PredictionCard';
import { ArrowLeft, Clock, TrendingUp, Info, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function StockDetails() {
  const { symbol } = useParams() as { symbol: string };
  const { latestPrice } = useSocket(symbol);
  const [stockData, setStockData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/stocks/quote/${symbol}`);
        setStockData(data);
        
        // Generate mock historical data
        const mockHist = Array.from({ length: 30 }, (_, i) => ({
          time: `${i}:00`,
          price: data.price + (Math.random() - 0.5) * 10
        }));
        setHistory(mockHist);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [symbol]);

  // Update history with live data
  useEffect(() => {
    if (latestPrice) {
      setHistory(prev => {
        const newHist = [...prev.slice(1), { 
          time: new Date(latestPrice.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
          price: latestPrice.price 
        }];
        return newHist;
      });
      setStockData((prev: any) => ({ ...prev, price: latestPrice.price, change: latestPrice.change }));
    }
  }, [latestPrice]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  if (!stockData) return <div className="text-center py-20 text-white">Stock not found</div>;

  const currentPrice = latestPrice?.price || stockData.price;
  const currentChange = latestPrice?.change || stockData.change;
  const isPositive = currentChange >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold text-white tracking-tight">{symbol}</h1>
              <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg uppercase tracking-wider">Nasdaq</span>
            </div>
            <p className="text-slate-400 font-medium text-lg">{stockData.name || 'Company Name'}</p>
          </div>
          
          <div className="text-left md:text-right">
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-black text-white">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <div className={`flex items-center gap-1 font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '+' : ''}{currentChange.toFixed(2)} ({((currentChange / currentPrice) * 100).toFixed(2)}%)
              </div>
            </div>
            <div className="flex items-center gap-2 justify-start md:justify-end text-slate-500 text-xs mt-1">
              <Clock className="w-3 h-3" />
              Live market data
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-2">
                {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                  <button key={tf} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tf === '1H' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    {tf}
                  </button>
                ))}
              </div>
              <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <StockChart data={history} color={isPositive ? '#10b981' : '#f43f5e'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PredictionCard prediction={stockData.prediction} />
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" />
                Key Statistics
              </h3>
              <div className="space-y-3">
                <StatRow label="Open" value={`$${stockData.open?.toFixed(2) || '---'}`} />
                <StatRow label="High" value={`$${stockData.high?.toFixed(2) || '---'}`} />
                <StatRow label="Low" value={`$${stockData.low?.toFixed(2) || '---'}`} />
                <StatRow label="Prev Close" value={`$${stockData.prevClose?.toFixed(2) || '---'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Trading Section */}
        <div className="space-y-8">
          <TradingPanel symbol={symbol} currentPrice={currentPrice} />
          
          {/* Market News Mini-section */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Related News
            </h3>
            <div className="space-y-4">
              <NewsItem title="Market sentiment turns bullish as inflation slows" date="2 hours ago" />
              <NewsItem title={`${symbol} announces quarterly earnings growth`} date="5 hours ago" />
              <NewsItem title="Tech sector leads recovery in morning session" date="1 day ago" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function NewsItem({ title, date }: { title: string, date: string }) {
  return (
    <div className="group cursor-pointer">
      <p className="text-sm font-medium text-slate-300 group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1">{title}</p>
      <p className="text-xs text-slate-500">{date}</p>
    </div>
  );
}
