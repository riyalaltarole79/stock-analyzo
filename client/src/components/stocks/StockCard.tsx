'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function StockCard({ symbol, name, price, change, changePercent }: StockCardProps) {
  const isPositive = change >= 0;

  return (
    <Link href={`/stock/${symbol}`}>
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-indigo-500/50 transition-all group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{symbol}</h3>
            <p className="text-sm text-slate-400 truncate max-w-[120px]">{name}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(changePercent).toFixed(2)}%
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className={`text-xs ${isPositive ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </p>
          </div>
          <div className="w-24 h-12 bg-slate-800/50 rounded-md overflow-hidden">
            {/* Minimal sparkline placeholder */}
            <div className={`h-full w-full opacity-20 bg-gradient-to-t ${isPositive ? 'from-emerald-500' : 'from-rose-500'} to-transparent`} />
          </div>
        </div>
      </div>
    </Link>
  );
}
