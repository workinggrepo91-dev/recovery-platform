// app/admin/cases/page.tsx
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Shield, AlertCircle } from 'lucide-react';
import { syncAndLinkOrphanedCases } from '@/app/actions/adminActions';

export const dynamic = 'force-dynamic'; 

const fallbackCaseRecords = [
  {
    id: 'case-ref-1',
    fullName: 'James Thornton',
    phone: '+1 (555) 019-2834',
    amountLost: '$50,000.00',
    scammerName: 'Deceptive Crypto Trading Platform',
    status: 'INVESTIGATION',
    createdAt: new Date('2026-07-20')
  },
  {
    id: 'case-ref-2',
    fullName: 'Sarah Jenkins',
    phone: '+44 20 7946 0921',
    amountLost: '$18,500.00',
    scammerName: 'Unregulated Foreign Wire Scheme',
    status: 'SUBMITTED',
    createdAt: new Date('2026-07-24')
  }
];

export default async function AllCasesPage() {
  let cases: any[] = [];
  let isOffline = false;

  try {
    await syncAndLinkOrphanedCases();
    cases = await prisma.case.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (cases.length === 0) {
      cases = fallbackCaseRecords;
    }
  } catch (err) {
    console.warn("Database offline during case search, serving sample records:", err);
    cases = fallbackCaseRecords;
    isOffline = true;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {isOffline && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>External database server connection offline. Displaying fallback forensic records for control management testing.</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Case Management Console
            </h1>
            <p className="text-slate-500 mt-1">Viewing all {cases.length} forensic recovery records.</p>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-sm font-medium text-slate-500">Full Name</th>
                <th className="p-4 text-sm font-medium text-slate-500">Phone</th>
                <th className="p-4 text-sm font-medium text-slate-500">Loss Amount</th>
                <th className="p-4 text-sm font-medium text-slate-500">Scammer / Target</th>
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
                cases.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-900 font-extrabold">
                      {c.fullName || "Unknown Client"}
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-medium">
                      {c.phone || "N/A"}
                    </td>
                    <td className="p-4 text-red-600 font-black font-mono">
                      {c.amountLost || "$0.00"}
                    </td>
                    <td className="p-4 text-slate-700 text-sm font-semibold">
                       {c.scammerName || "N/A"}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase border ${
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
                        href={`/admin/clients/${c.userId || c.email || 'legacy-' + c.id}?caseId=${c.id}`} 
                        className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl transition inline-flex items-center shadow-xs gap-1.5"
                      >
                        <span>Client Profile & Case</span> &rarr;
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