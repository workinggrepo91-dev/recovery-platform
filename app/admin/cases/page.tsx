// app/admin/cases/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Shield } from 'lucide-react';

import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic'; 

export default async function AllCasesPage() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Case Management
            </h1>
            <p className="text-slate-500 mt-1">Viewing all {cases.length} forensic records.</p>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-sm font-medium text-slate-500">Case ID</th>
                <th className="p-4 text-sm font-medium text-slate-500">Date Reported</th>
                <th className="p-4 text-sm font-medium text-slate-500">Asset</th>
                <th className="p-4 text-sm font-medium text-slate-500">Loss Amount</th>
                <th className="p-4 text-sm font-medium text-slate-500">Status</th>
                <th className="p-4 text-sm font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    No cases found.
                  </td>
                </tr>
              ) : (
                /* ✅ FIXED: Added ": any" to the variable 'c' to satisfy TypeScript */
                cases.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-900 font-mono text-xs">
                      {c.id.slice(0, 8)}...
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {c.assetType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-900 font-medium">
                      ${parseInt(c.amountLost).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        c.status === 'SUBMITTED' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                        c.status === 'INVESTIGATION' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        c.status === 'CLOSED' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link 
                        href={`/admin/cases/${c.id}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        Open Case
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}