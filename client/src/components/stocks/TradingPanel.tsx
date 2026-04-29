'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { ShoppingCart, DollarSign, Loader2 } from 'lucide-react';

export default function TradingPanel({ symbol, currentPrice }: { symbol: string, currentPrice: number }) {
  const [shares, setShares] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updateBalance } = useAuth();

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/portfolio/trade', {
        symbol,
        type,
        shares,
        price: currentPrice
      });
      updateBalance(data.balance);
      setSuccess(`${type} successful!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const total = shares * currentPrice;

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-indigo-400" />
        Trading Panel
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Quantity</label>
          <input
            type="number"
            min="1"
            value={shares}
            onChange={(e) => setShares(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Current Price</span>
            <span className="text-white font-medium">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-slate-200">Total Est.</span>
            <span className="text-white">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {error && <p className="text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">{error}</p>}
        {success && <p className="text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">{success}</p>}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTrade('BUY')}
            disabled={loading || !user}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buy'}
          </button>
          <button
            onClick={() => handleTrade('SELL')}
            disabled={loading || !user}
            className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sell'}
          </button>
        </div>
        
        {!user && <p className="text-center text-xs text-slate-500">Sign in to start trading</p>}
      </div>
    </div>
  );
}
