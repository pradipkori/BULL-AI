import React from 'react';
import { Settings as SettingsIcon, User, Key, Bell, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Platform Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your workspace preferences, API keys, and security settings.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex min-h-[500px]">
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-slate-100 p-4 bg-slate-50/50">
           <nav className="space-y-1">
             <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-900 font-medium text-sm">
                <User size={16} className="text-slate-500" />
                Profile
             </a>
             <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm">
                <Key size={16} className="text-slate-500" />
                API Configuration
             </a>
             <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm">
                <Shield size={16} className="text-slate-500" />
                Security
             </a>
             <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm">
                <Bell size={16} className="text-slate-500" />
                Notifications
             </a>
           </nav>
        </div>
        
        {/* Settings Content */}
        <div className="flex-1 p-8">
           <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Profile Information</h3>
           
           <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" defaultValue="Senior Analyst" className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" defaultValue="analyst@bull.ai" className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                <input type="text" defaultValue="Workspace Admin" disabled className="w-full max-w-md px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
              </div>

              <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors mt-4">
                Save Changes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
