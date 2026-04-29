'use client';

import { BrainCircuit, Info } from 'lucide-react';

interface PredictionProps {
  prediction: {
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reason: string;
  };
}

export default function PredictionCard({ prediction }: PredictionProps) {
  const getColors = () => {
    switch (prediction.signal) {
      case 'BUY': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'SELL': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BrainCircuit className="w-24 h-24" />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">AI Analysis</h3>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Recommendation</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getColors()}`}>
            {prediction.signal}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full" 
                style={{ width: `${prediction.confidence}%` }} 
              />
            </div>
            <span className="text-white text-sm font-medium">{prediction.confidence}%</span>
          </div>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            {prediction.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
