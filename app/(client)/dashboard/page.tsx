// app/(client)/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentClient } from '@/app/actions/clientAuth';
import { 
  Copy, 
  Check, 
  MessageCircle, 
  CreditCard, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  Scale,
  Award
} from 'lucide-react';

export default function DashboardHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    async function loadData() {
      const clientData = await getCurrentClient();
      if (!clientData) {
        // Fallback initialized to clean zero balances with zero initial cases
        setUser({
          id: 'demo-user-1',
          fullName: 'Client Workspace',
          email: 'client@gmail.com',
          authProvider: 'GMAIL',
          isVerified: false,
          twoFactor: false,
          balance: '$0.00',
          recovered: '$0.00',
          cases: []
        });
      } else {
        setUser({
          ...clientData,
          cases: clientData.cases || []
        });
      }
    }
    loadData();
  }, []);

  function handleCopy(refId: string) {
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleStartVerification() {
    setIsVerifying(true);
    setTimeout(() => {
      alert("ID Verification request transmitted! Your dedicated Admin can finalize and approve your KYC status from the Admin Control Center.");
      setIsVerifying(false);
    }, 800);
  }

  const progressSteps = [
    { label: 'SUBMITTED', id: 'SUBMITTED' },
    { label: 'IN REVIEW', id: 'IN_REVIEW' },
    { label: 'INVESTIGATING', id: 'INVESTIGATING' },
    { label: 'LEGAL ACTION', id: 'LEGAL_ACTION' },
    { label: 'RECOVERED', id: 'RECOVERED' }
  ];

  function getStepIndex(step: string) {
    switch(step) {
      case 'SUBMITTED': return 0;
      case 'IN_REVIEW': case 'IN REVIEW': return 1;
      case 'INVESTIGATING': return 2;
      case 'LEGAL_ACTION': case 'LEGAL ACTION': return 3;
      case 'RECOVERED': return 4;
      default: return 2;
    }
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading Client Workspace...</p>
        </div>
      </div>
    );
  }

  const displayName = (user.fullName || user.email || 'Client').split(' ')[0];
  const userCases = user.cases || [];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          Welcome back, {displayName} <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
          Manage your recovery cases, track progress, and handle payments
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Balance (Controlled directly by Admin) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">{user.balance || '$0.00'}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Balance</p>
          </div>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-4"></div>
        </div>

        {/* Total Cases */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{userCases.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Cases</p>
          </div>
          <div className="h-1.5 w-12 bg-indigo-600 rounded-full mt-4"></div>
        </div>

        {/* Recovered (Controlled directly by Admin) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-green-500/20 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -translate-y-6 translate-x-6 pointer-events-none"></div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-green-600 tracking-tight font-mono">{user.recovered || '$0.00'}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Recovered</p>
          </div>
          <div className="h-1.5 w-12 bg-green-500 rounded-full mt-4"></div>
        </div>

        {/* 2FA Status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center gap-2">
              {user.twoFactor ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">ON</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                  <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">OFF</p>
                </>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">2FA Status</p>
          </div>
          <div className={`h-1.5 w-12 ${user.twoFactor ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full mt-4`}></div>
        </div>

        {/* ID Verification (Controlled directly by Admin switch) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between col-span-2 sm:col-span-1 hover:shadow-md transition">
          <div>
            {user.isVerified ? (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight">Verified</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600 fill-blue-600/20" />
                <p className="text-xl sm:text-2xl font-bold text-blue-600 tracking-tight">Unverified</p>
              </div>
            )}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">ID Verification</p>
          </div>
          <div className={`h-1.5 w-12 ${user.isVerified ? 'bg-emerald-500' : 'bg-blue-400'} rounded-full mt-4`}></div>
        </div>
      </div>

      {/* Identity Verification Alert Banner */}
      {!user.isVerified ? (
        <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-blue-950 font-semibold text-sm sm:text-base">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span>Identity verification required. </span>
              <button 
                onClick={handleStartVerification} 
                disabled={isVerifying}
                className="text-blue-600 hover:text-blue-800 underline font-extrabold inline-flex items-center gap-1 transition"
              >
                Verify your account &rarr;
              </button>
            </div>
          </div>
          <div className="text-xs bg-white px-3 py-1 rounded-full font-bold text-blue-800 border border-blue-200 shadow-xs flex-shrink-0">
            REQUIRED FOR PAYMENT RETRIEVAL
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-emerald-950 font-semibold text-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>Identity KYC verified and approved by Global Digital Forensic Administration.</span>
          </div>
          <span className="text-xs bg-white text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
            COMPACT SECURED
          </span>
        </div>
      )}

      {/* YOUR CASES SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-slate-700" />
            Your Cases
          </h2>
          <Link 
            href="/apply" 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5"
          >
            + File New Case
          </Link>
        </div>

        {/* Case Cards or Clean Empty State */}
        {userCases.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 md:p-14 text-center max-w-3xl mx-auto my-6 space-y-6">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Active Recovery Cases Filed Yet</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Your client account is initialized and ready. To begin a forensic trace on a fraudulent cryptocurrency transaction or bank wire transfer, submit your case claim below.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition hover:scale-105 active:scale-95"
              >
                + Submit Your First Recovery Claim &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {userCases.map((c: any, index: number) => {
              const refId = c.caseReference || `RE-EF56D856`;
              const currentStepIdx = getStepIndex(c.progressStep || 'INVESTIGATING');

              return (
                <div 
                  key={c.id || index} 
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden transition hover:shadow-md"
                >
                  {/* Top Grid Area */}
                  <div className="flex flex-col lg:flex-row justify-between gap-6 pb-8 border-b border-slate-100">
                    
                    {/* Left Column: Title & Actions */}
                    <div className="space-y-4 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                          {refId}
                        </span>
                        <button 
                          onClick={() => handleCopy(refId)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center gap-1 transition"
                        >
                          {copiedId === refId ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === refId ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{c.scammerName || 'Cryptocurrency Recovery Claim'}</h3>
                        <p className="text-slate-500 text-sm mt-0.5 font-medium">{c.description || 'Case file awaiting administrative financial check.'}</p>
                      </div>

                      {/* Action Buttons (Yellow Pay & Blue Chat Pill Buttons matching Image 1) */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button 
                          onClick={() => alert(user.isVerified ? "Initializing payment compliance ledger with assigned recovery specialist..." : "Please ensure your ID verification is verified before processing transactions.")}
                          className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition transform active:scale-95"
                        >
                          <CreditCard className="w-4 h-4" />
                          Make Payment
                        </button>
                        
                        <Link 
                          href={`/dashboard/messages?ref=${refId}`}
                          className="px-6 py-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-sm border border-blue-200 flex items-center gap-2 shadow-sm transition"
                        >
                          <MessageCircle className="w-4 h-4 fill-blue-700 text-blue-50" />
                          Chat with {c.assignedAgent ? c.assignedAgent.split(' ')[0] : 'James'}
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Amounts & Status Tags (Directly set by Admin) */}
                    <div className="flex flex-col lg:items-end justify-between space-y-4 text-left lg:text-right">
                      <div>
                        <p className="text-sm font-bold text-slate-500">
                          Disputed Amount: <span className="text-amber-700 font-extrabold font-mono">{c.disputedAmount || user.balance || '$0.00'}</span>
                        </p>
                        <p className="text-sm font-bold text-slate-500 mt-1">
                          Recovered Amount: <span className="text-green-600 font-extrabold font-mono">{c.recoveredAmount || user.recovered || '$0.00'}</span>
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap lg:justify-end gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          Priority: {c.priority || 'low'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                          <Scale className="w-3.5 h-3.5 text-purple-600" />
                          {c.legalStatus || 'Legal Action'}
                        </span>
                      </div>

                      {/* Assigned Specialist Stamp (Configured by Admin) */}
                      <div className="pt-2">
                        <p className="text-xs text-slate-400 font-semibold mb-1">{c.dateStr || '20 Jul 2026'}</p>
                        <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                          <div className="w-6 h-6 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center shadow-sm">
                            {(c.assignedAgent || 'James')[0]}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-extrabold text-slate-800 leading-tight">{c.assignedAgent || 'James Thornton'}</p>
                            <p className="text-[10px] font-semibold text-blue-600 leading-tight">{c.agentTitle || 'Crypto Recovery Expert'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* BOTTOM: RECOVERY PROGRESS BAR (Driven directly by Admin stage setting) */}
                  <div className="pt-8">
                    <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-8">
                      RECOVERY PROGRESS TIMELINE
                    </p>

                    <div className="relative">
                      {/* Connecting background bar */}
                      <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 rounded-full z-0 hidden sm:block">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${(currentStepIdx / (progressSteps.length - 1)) * 100}%` }}
                        ></div>
                      </div>

                      {/* Step nodes */}
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                        {progressSteps.map((step, idx) => {
                          const isCompleted = idx < currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={step.id} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center group">
                              
                              {/* Node icon */}
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 transition shadow-sm ${
                                isCompleted 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : isCurrent 
                                  ? 'bg-amber-400 text-slate-950 border-amber-500 scale-110 shadow-lg shadow-amber-400/30 animate-pulse' 
                                  : 'bg-white text-slate-400 border-slate-300'
                              }`}>
                                {isCompleted ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : isCurrent ? (
                                  <Sparkles className="w-4 h-4 fill-slate-950" />
                                ) : (
                                  idx + 1
                                )}
                              </div>

                              {/* Label */}
                              <div>
                                <p className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition ${
                                  isCurrent ? 'text-slate-950 underline decoration-amber-400 decoration-2 underline-offset-4' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                                }`}>
                                  {step.label}
                                </p>
                                {isCurrent && (
                                  <span className="inline-block sm:hidden text-[10px] font-bold text-blue-600 ml-2">(Current Stage)</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
