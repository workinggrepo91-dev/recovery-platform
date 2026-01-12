// app/admin/cases/[id]/page.tsx
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Phone, Globe, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { notFound } from 'next/navigation';
import StatusSelector from '@/app/components/StatusSelector';

export const dynamic = 'force-dynamic';

export default async function CaseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const caseDetail = await prisma.case.findUnique({
    where: { id: id },
  });

  if (!caseDetail) {
    notFound();
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
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
              <h1 className="text-2xl font-bold text-slate-900">{caseDetail.fullName}</h1>
              <StatusSelector caseId={caseDetail.id} currentStatus={caseDetail.status} />
            </div>
            <p className="text-slate-500 text-sm flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Applied on {new Date(caseDetail.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3">
             <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-right">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  CASE ID
                </div>
                <div className="font-mono text-sm text-blue-900 break-all select-all cursor-text">
                  {caseDetail.id}
                </div>
              </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Personal Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Personal Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Full Name</span>
                  <span className="font-medium text-slate-900 text-right">{caseDetail.fullName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Phone className="w-3 h-3"/> Phone</span>
                  <span className="font-medium text-slate-900 text-right">{caseDetail.phone}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Email</span>
                  <span className="font-medium text-slate-900 text-right break-all">{caseDetail.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Globe className="w-3 h-3"/> Country</span>
                  <span className="font-medium text-slate-900 text-right">{caseDetail.country}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Calendar className="w-3 h-3"/> DOB</span>
                  <span className="font-medium text-slate-900 text-right">{caseDetail.dateOfBirth}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Loss Summary
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                <p className="text-sm text-red-600 mb-1 font-medium">Total Amount Lost</p>
                <p className="text-2xl font-bold text-red-700">{caseDetail.amountLost}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Case Questionnaire */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-500" />
                Incident Questionnaire
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scammer / Platform Name</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium">
                    {caseDetail.scammerName}
                  </div>
                </div>
                 <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Year of Loss</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium">
                    {caseDetail.lossYear}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Method</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium">
                    {caseDetail.paymentMethod}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Times Victim</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium">
                    {caseDetail.timesVictim}
                  </div>
                </div>
                 <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aware it was a scam?</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium">
                    {caseDetail.awareOfScam}
                  </div>
                </div>
                 <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recovery Attempts</label>
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium">
                    {caseDetail.recoveryAttempts}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brief Description</label>
                 <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {caseDetail.description}
                 </div>
              </div>

            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
}