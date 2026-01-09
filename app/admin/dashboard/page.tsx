// app/(admin)/dashboard/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Shield, FileText, AlertCircle, TrendingUp } from 'lucide-react';

// Initialize Prisma
const prisma = new PrismaClient();

// This ensures the page always shows fresh data (not cached)
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. Fetch real data from the database
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5 // Get the 5 most recent cases
  });

  const totalCases = await prisma.case.count();
  const pendingReview = await prisma.case.count({ where: { status: 'SUBMITTED' } });

  // Calculate total amount lost (parsing strings to integers)
  const allCases = await prisma.case.findMany({ select: { amountLost: true } });
  const totalLost = allCases.reduce((acc, curr) => acc + (parseInt(curr.amountLost) || 0), 0);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-blue-600" />
          Investigator Dashboard
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-medium">Total Active Cases</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalCases}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-medium">Pending Review</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{pendingReview}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-medium">Total Reported Loss</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ${totalLost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Cases Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Recent Submissions</h2>
            <Link href="/admin/cases" className="text-blue-600 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-sm font-medium text-slate-500">Date</th>
                <th className="p-4 text-sm font-medium text-slate-500">Asset</th>
                <th className="p-4 text-sm font-medium text-slate-500">Loss</th>
                <th className="p-4 text-sm font-medium text-slate-500">Status</th>
                <th className="p-4 text-sm font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No cases found. Waiting for submissions.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-700">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {c.assetType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-mono">
                      ${parseInt(c.amountLost).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link 
                        href={`/admin/cases/${c.id}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
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