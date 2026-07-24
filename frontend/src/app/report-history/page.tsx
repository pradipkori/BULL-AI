import React from 'react';
import { FileText, Clock, Download } from 'lucide-react';

export default function ReportHistory() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Report History</h2>
        <p className="text-slate-500 text-sm mt-1">Access and download previously generated intelligence reports.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
           <FileText className="w-16 h-16 text-slate-200 mb-4" />
           <h3 className="text-lg font-bold text-slate-700 mb-2">No Reports Generated Yet</h3>
           <p className="text-sm max-w-sm mx-auto">Once you generate a report from the Dashboard, it will be securely archived and accessible here.</p>
        </div>
      </div>
    </div>
  );
}
