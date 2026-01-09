// app/admin/cases/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { ArrowLeft, Shield, Clock, AlertTriangle, Wallet, FileText, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import StatusSelector from '@/app/components/StatusSelector';

const prisma = new PrismaClient();

export default async function CaseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Get the Case ID from the URL
  const { id } = await params;

  // 2. Fetch the full case details
  const caseDetail = await prisma.case.findUnique({
    where: { id: id },
  });

  // 3. Handle 404 if ID is wrong
  if (!caseDetail) {
    notFound();
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">Case #{caseDetail.id.slice(0, 8)}...</h1>
              <StatusSelector caseId={caseDetail.id} currentStatus={caseDetail.status} />
            </div>
            <p className="text-slate-500 text-sm flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Submitted on {new Date(caseDetail.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Action Buttons (Placeholder for now) */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition">
              Download PDF
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              Update Status
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Incident Data */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Incident Description
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {caseDetail.description || "No description provided."}
              </p>
            </div>

            {/* Forensic Data Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-500" />
                Forensic Data
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Hash (TXID)</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded font-mono text-sm text-slate-700 break-all select-all">
                    {caseDetail.transactionTx || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suspect Wallet Address</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded font-mono text-sm text-slate-700 break-all select-all">
                    {caseDetail.scammerAddress || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Stats */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Summary</h3>
              
              <div className="space-y-4">
                
                {/* ✅ NEW: Full Copyable Case ID */}
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    Full Case ID (For Client)
                  </div>
                  <div className="font-mono text-sm text-blue-900 break-all select-all cursor-text">
                    {caseDetail.id}
                  </div>
                </div>

                {/* Existing Asset Row */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center text-slate-600">
                    <Wallet className="w-5 h-5 mr-3" />
                    <span className="font-medium">Asset</span>
                  </div>
                  <span className="font-bold text-slate-900">{caseDetail.assetType}</span>
                </div>

                {/* Existing Loss Row */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center text-slate-600">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <span className="font-medium">Loss Amount</span>
                  </div>
                  <span className="font-bold text-red-600">
                    ${parseInt(caseDetail.amountLost).toLocaleString()}
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
}