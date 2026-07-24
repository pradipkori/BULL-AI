import React from 'react';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

export default function MarketAnalysis() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Market Analysis</h2>
        <p className="text-slate-500 text-sm mt-1">Live market data, trends, and macro-economic indicators.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity size={20} /></div>
              <h3 className="font-semibold text-slate-700">S&P 500</h3>
           </div>
           <div className="text-3xl font-bold text-slate-900 mb-1">5,123.41</div>
           <div className="text-sm font-semibold text-emerald-600">+1.2% Today</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><TrendingUp size={20} /></div>
              <h3 className="font-semibold text-slate-700">NASDAQ</h3>
           </div>
           <div className="text-3xl font-bold text-slate-900 mb-1">16,234.12</div>
           <div className="text-sm font-semibold text-emerald-600">+1.8% Today</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><BarChart2 size={20} /></div>
              <h3 className="font-semibold text-slate-700">VIX</h3>
           </div>
           <div className="text-3xl font-bold text-slate-900 mb-1">14.21</div>
           <div className="text-sm font-semibold text-rose-600">-2.1% Today</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
         <h3 className="text-lg font-bold text-slate-700 mb-2">Advanced Charting</h3>
         <p className="text-sm max-w-md mx-auto">This module will connect directly to the Bloomberg Terminal API in the next release to provide real-time candlestick charts and technical indicators.</p>
      </div>
    </div>
  );
}
