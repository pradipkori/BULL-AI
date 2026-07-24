"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  FileText, 
  TrendingUp, 
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const [companyName, setCompanyName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("Standby");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports");
      setReports(res.data);
    } catch (e) {
      console.error("Failed to fetch reports", e);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateReport = async () => {
    if (!companyName || !file) {
      alert("Please enter a company name and select a file.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading Document...");
    setPdfUrl(null);

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("document", file);

    try {
      const response = await axios.post("http://localhost:5000/api/generate-report", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(response.data);
      setUploadStatus("Report Generated Successfully");
      
      if (response.data.pdfUrl) {
          setPdfUrl(response.data.pdfUrl);
          fetchReports(); // Refresh the reports list
          window.open(response.data.pdfUrl, '_blank');
      }
    } catch (error) {
      console.error(error);
      setUploadStatus("Error generating report");
      alert("An error occurred during report generation. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 flex gap-8">
      
      <div className="flex-1 max-w-3xl flex flex-col gap-8">
        {/* REPORT GENERATOR SECTION */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Report Generator</h2>
              <p className="text-slate-500 text-sm mt-1">Configure parameters to generate high-fidelity financial intelligence.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Enter Company Name or Ticker (e.g., AAPL, NVDA, Tesla)
              </label>
              <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Enter company name..."
                disabled={isUploading}
              />
            </div>

            <div className="p-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                DATA SOURCE DIRECTORY
              </label>
              
              <div 
                className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.txt"
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                        <FileText className="text-emerald-600" size={24} />
                      </div>
                      <p className="text-sm font-bold text-emerald-700">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="text-slate-700" size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">Drop supporting documents</p>
                    <p className="text-xs text-slate-500 mb-4">Accepts PDF, CSV, TXT (Max 50MB per file)</p>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                      Or browse files
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleGenerateReport}
                disabled={isUploading || !file || !companyName}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                {isUploading ? "Processing..." : "Generate Intelligence Report"}
              </button>
            </div>
          </div>
        </section>

        {/* RECENT REPORTS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Reports</h3>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">View All</a>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No reports generated yet.
                    </td>
                  </tr>
                ) : (
                  reports.slice(0, 5).map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => window.open(report.pdfUrl, '_blank')}>
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                          {report.companyName.substring(0, 3).toUpperCase()}
                        </div>
                        {report.companyName}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{report.date}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">{report.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <CheckCircle2 className="inline-block text-emerald-500 w-5 h-5" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* RIGHT SIDEBAR CONTENT */}
      <div className="w-80 shrink-0 flex flex-col gap-6">
        {/* LIVE EXTRACTING METRICS */}
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
          <div className="p-5 border-b border-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${isUploading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'text-amber-500' : 'text-emerald-500'}`}>LIVE EXTRACTING METRICS</h3>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">STATUS</div>
              <div className="text-xl font-light text-slate-200">{uploadStatus}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">ACTIVE SOURCES</div>
              <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-medium border border-slate-700">Document Upload</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-medium border border-slate-700">OpenAI Processor</span>
              </div>
            </div>
            
            <div className="h-32 mt-6 flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-lg text-slate-500">
              {isUploading ? (
                  <>
                    <Loader2 className="mb-2 text-amber-500 animate-spin" size={24} />
                    <p className="text-xs font-medium text-center px-4">Parsing Document... <br/> <span className="opacity-70 font-normal">Extracting financial data tables and summary points.</span></p>
                  </>
              ) : pdfUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={32} />
                    <a 
                      href={pdfUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      View Generated Report
                    </a>
                  </div>
              ) : (
                  <>
                    <AlertTriangle className="mb-2 opacity-50" size={24} />
                    <p className="text-xs font-medium text-center px-4">Awaiting Input Stream... <br/> <span className="opacity-70 font-normal">Data extraction begins automatically upon file confirmation.</span></p>
                  </>
              )}
              
            </div>
          </div>
        </div>

        {/* MARKET PULSE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Market Pulse</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Tech Sector Aggregation</p>
                <p className="text-xs font-semibold text-emerald-600">+1.4% Momentum</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
