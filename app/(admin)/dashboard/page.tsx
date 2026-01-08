// app/Admin/dashboard/page.tsx
import Link from 'next/link';
import { Activity, Users, FileText } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Investigator Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Cases</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Clients</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cases Placeholder */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-lg">Recent Submissions</h3>
        </div>
        <div className="p-8 text-center text-slate-500">
          No cases found yet. (Database connection pending)
        </div>
      </div>
    </div>
  );
}