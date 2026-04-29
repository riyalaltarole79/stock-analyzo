'use client';

import { ArrowRight, BarChart3, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
              V2.0 is now live with AI Insights
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Analyze the Market <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-emerald-400">
                Like a Professional
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time stock tracking, advanced analytics, and AI-powered predictions. 
              Master the market with our production-grade paper trading simulation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/market"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-xl font-bold text-lg transition-all"
              >
                View Live Market
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Real-Time Data"
              description="Streaming stock prices via high-performance WebSockets for zero-latency updates."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-indigo-400" />}
              title="Advanced Charts"
              description="Professional-grade interactive charts with multiple timeframes and technical indicators."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
              title="Safe Trading"
              description="Risk-free paper trading with virtual $100k balance to test your strategies."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-white mb-1">500+</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Global Stocks</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">10ms</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Latency</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">99.9%</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">AI-Ready</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Prediction Engine</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
