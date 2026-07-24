"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, TrendingUp, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors";
    return pathname === path 
      ? `${base} bg-emerald-50 text-emerald-700` 
      : `${base} text-slate-600 hover:bg-slate-50 hover:text-slate-900`;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 print:hidden">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">B</span>
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight">Bull AI</h1>
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Intelligence Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        <Link href="/" className={getLinkClasses('/')}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link href="/report-history" className={getLinkClasses('/report-history')}>
          <FileText size={18} />
          Report History
        </Link>
        <Link href="/market-analysis" className={getLinkClasses('/market-analysis')}>
          <TrendingUp size={18} />
          Market Analysis
        </Link>
        <Link href="/settings" className={getLinkClasses('/settings')}>
          <Settings size={18} />
          Settings
        </Link>
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">SA</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Senior Analyst</p>
            <p className="text-xs text-slate-500">Workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
