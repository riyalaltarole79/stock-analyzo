'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Wallet, TrendingUp, TrendingDown, Clock, PieChart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [holdings, setHoldings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [holdRes, transRes] = await Promise.all([
          api.get('/portfolio/holdings'),
          api.get('/portfolio/transactions')
        ]);
        setHoldings(holdRes.data);
        setTransactions(transRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (authLoading || (user && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-slate-400">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const totalPortfolioValue = holdings.reduce((acc, h) => acc + h.currentValue, 0);
  const totalInvestment = holdings.reduce((acc, h) => acc + (h.shares * h.averagePrice), 0);
  const totalPL = totalPortfolioValue - totalInvestment;
  const isPositive = totalPL >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio Overview</h1>
          <p className="text-slate-400">Welcome back, {user.name}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-indigo-600/10 p-3 rounded-xl">
            <Wallet className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Available Balance</p>
            <p className="text-2xl font-bold text-white">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard 
          label="Portfolio Value" 
          value={`$${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<PieChart className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Profit/Loss" 
          value={`${isPositive ? '+' : ''}$${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subValue={`${((totalPL / (totalInvestment || 1)) * 100).toFixed(2)}%`}
          isPositive={isPositive}
          icon={isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Investment" 
          value={`$${totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Holdings Table */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Your Holdings</h3>
            <span className="text-xs text-slate-500">{holdings.length} Positions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Asset</th>
                  <th className="px-6 py-4 font-semibold text-right">Shares</th>
                  <th className="px-6 py-4 font-semibold text-right">Avg Price</th>
                  <th className="px-6 py-4 font-semibold text-right">Market Price</th>
                  <th className="px-6 py-4 font-semibold text-right">P/L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {holdings.map((h) => (
                  <tr key={h.symbol} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{h.symbol}</div>
                      <div className="text-xs text-slate-500">Stock</div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-300">{h.shares}</td>
                    <td className="px-6 py-4 text-right text-slate-300">${h.averagePrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-white font-bold">${h.currentPrice.toFixed(2)}</td>
                    <td className={`px-6 py-4 text-right font-bold ${h.profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {h.profitLoss >= 0 ? '+' : ''}{h.profitLoss.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No active positions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {t.type === 'BUY' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.symbol}</p>
                    <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'BUY' ? '-' : '+'}${t.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-slate-500">{t.shares} shares</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-slate-500 py-10">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, icon, isPositive }: any) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex items-center gap-3 text-slate-400 mb-4">
        <div className="p-2 bg-slate-800 rounded-lg">
          {icon}
        </div>
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-bold text-white">{value}</p>
        {subValue && (
          <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            ({subValue})
          </span>
        )}
      </div>
    </div>
  );
}
