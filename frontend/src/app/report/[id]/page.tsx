"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';
import { Printer, ArrowLeft, Loader2, Building, Calendar, FileText } from 'lucide-react';

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/reports/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load report.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p>Loading Intelligence Report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-red-500 mb-4">{error || 'Report not found'}</p>
        <button onClick={() => router.push('/')} className="text-emerald-600 font-medium">Return to Dashboard</button>
      </div>
    );
  }

  const data = report.dataPreview;

  // Prepare chart data
  const parseNum = (str: string) => parseFloat(str?.replace(/,/g, '')) || 0;
  
  const chartData = [
    {
      name: data.YEAR_1,
      Revenue: parseNum(data.REV_1),
      EBITDA: parseNum(data.EBITDA_1),
      PAT: parseNum(data.PAT_1)
    },
    {
      name: data.YEAR_2,
      Revenue: parseNum(data.REV_2),
      EBITDA: parseNum(data.EBITDA_2),
      PAT: parseNum(data.PAT_2)
    },
    {
      name: data.YEAR_3,
      Revenue: parseNum(data.REV_3),
      EBITDA: parseNum(data.EBITDA_3),
      PAT: parseNum(data.PAT_3)
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 print:p-0 print:bg-white">
      {/* Header Controls - Hidden when printing */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          <Printer size={16} />
          Save as PDF
        </button>
      </div>

      {/* A4 Document Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:max-w-none">
        
        {/* Report Header */}
        <div className="bg-slate-900 text-white p-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{report.companyName}</h1>
              <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1.5"><Building size={16}/> Ticker: {data.TICKER || 'N/A'}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Calendar size={16}/> {report.date}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recommendation</div>
              <div className={`text-2xl font-black uppercase ${data.RECOMMENDATION === 'BUY' ? 'text-emerald-400' : data.RECOMMENDATION === 'SELL' ? 'text-red-400' : 'text-amber-400'}`}>
                {data.RECOMMENDATION || 'HOLD'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-slate-700/50 pt-8">
             <div>
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Price</div>
               <div className="text-2xl font-light">{data.CURRENT_PRICE || 'N/A'}</div>
             </div>
             <div>
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Price</div>
               <div className="text-2xl font-light">{data.TARGET_PRICE || 'N/A'}</div>
             </div>
          </div>
        </div>

        <div className="p-10 space-y-12">
          {/* Executive Summary */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
              <FileText className="text-emerald-600" size={20} />
              Executive Summary
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
              {data.EXECUTIVE_SUMMARY || 'No executive summary provided.'}
            </p>
          </section>

          {/* Key Financials Table */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
              Financial Highlights (Cr.)
            </h2>
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4 border-b border-slate-200">Metric</th>
                    <th className="p-4 border-b border-slate-200 text-right">{data.YEAR_1 || 'Year 1'}</th>
                    <th className="p-4 border-b border-slate-200 text-right">{data.YEAR_2 || 'Year 2'}</th>
                    <th className="p-4 border-b border-slate-200 text-right">{data.YEAR_3 || 'Year 3'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="p-4 bg-slate-50/50">Revenue</td>
                    <td className="p-4 text-right">{data.REV_1}</td>
                    <td className="p-4 text-right">{data.REV_2}</td>
                    <td className="p-4 text-right">{data.REV_3}</td>
                  </tr>
                  <tr>
                    <td className="p-4 bg-slate-50/50">EBITDA</td>
                    <td className="p-4 text-right">{data.EBITDA_1}</td>
                    <td className="p-4 text-right">{data.EBITDA_2}</td>
                    <td className="p-4 text-right">{data.EBITDA_3}</td>
                  </tr>
                  <tr>
                    <td className="p-4 bg-slate-50/50">PAT</td>
                    <td className="p-4 text-right">{data.PAT_1}</td>
                    <td className="p-4 text-right">{data.PAT_2}</td>
                    <td className="p-4 text-right">{data.PAT_3}</td>
                  </tr>
                  <tr>
                    <td className="p-4 bg-slate-50/50">EPS</td>
                    <td className="p-4 text-right">{data.EPS_1}</td>
                    <td className="p-4 text-right">{data.EPS_2}</td>
                    <td className="p-4 text-right">{data.EPS_3}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-8 pt-4 page-break-inside-avoid">
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-6 text-center">Revenue Trend</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="Revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-6 text-center">Margin Profile</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="EBITDA" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="PAT" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            GENERATED BY BULL-AI INTELLIGENCE PLATFORM • {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </div>
  );
}
