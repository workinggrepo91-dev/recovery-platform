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
  Award,
  FolderClosed,
  Clock,
  Lock,
  Shield,
  Scale
} from 'lucide-react';

function formatCurrency(val?: string) {
  if (!val) return '$0.00';
  const trimmed = val.trim();
  if (trimmed.includes(',')) return trimmed;
  const match = trimmed.match(/^([^\d-]*)(-?\d+)(\.\d+)?(.*)$/);
  if (match) {
    const prefix = match[1] !== undefined && match[1] !== '' ? match[1] : '$';
    const numPart = parseInt(match[2], 10);
    const decimalPart = match[3] || '';
    const suffix = match[4] || '';
    if (!isNaN(numPart)) {
      return `${prefix}${numPart.toLocaleString('en-US')}${decimalPart}${suffix}`;
    }
  }
  return trimmed;
}

function getAmountFontSize(str: string) {
  if (str.length >= 15) return 'text-base sm:text-lg font-black';
  if (str.length >= 12) return 'text-lg sm:text-xl font-black';
  if (str.length >= 9) return 'text-xl sm:text-2xl font-black';
  return 'text-2xl sm:text-3xl font-black';
}

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
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition overflow-hidden min-w-0">
          <div className="min-w-0">
            {(() => {
              const formatted = formatCurrency(user.balance || '$0.00');
              return (
                <p 
                  title={formatted} 
                  className={`${getAmountFontSize(formatted)} text-slate-900 tracking-tight font-mono truncate w-full`}
                >
                  {formatted}
                </p>
              );
            })()}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 truncate">Balance</p>
          </div>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-4 flex-shrink-0"></div>
        </div>

        {/* Total Cases */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition overflow-hidden min-w-0">
          <div className="min-w-0">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">{userCases.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 truncate">Total Cases</p>
          </div>
          <div className="h-1.5 w-12 bg-indigo-600 rounded-full mt-4 flex-shrink-0"></div>
        </div>

        {/* Recovered (Controlled directly by Admin) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-green-500/20 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden min-w-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -translate-y-6 translate-x-6 pointer-events-none"></div>
          <div className="min-w-0 relative z-10">
            {(() => {
              const formatted = formatCurrency(user.recovered || '$0.00');
              return (
                <p 
                  title={formatted} 
                  className={`${getAmountFontSize(formatted)} text-green-600 tracking-tight font-mono truncate w-full`}
                >
                  {formatted}
                </p>
              );
            })()}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 truncate">Recovered</p>
          </div>
          <div className="h-1.5 w-12 bg-green-500 rounded-full mt-4 flex-shrink-0 relative z-10"></div>
        </div>

        {/* 2FA Status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition overflow-hidden min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              {user.twoFactor ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-600/20 flex-shrink-0" />
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight truncate">ON</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-500 fill-amber-500/20 flex-shrink-0" />
                  <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">OFF</p>
                </>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 truncate">2FA Status</p>
          </div>
          <div className={`h-1.5 w-12 ${user.twoFactor ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full mt-4 flex-shrink-0`}></div>
        </div>

        {/* ID Verification Status Card */}
        <Link href="/dashboard/verify" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between col-span-2 sm:col-span-1 hover:shadow-md hover:border-blue-300 transition group overflow-hidden min-w-0">
          <div className="min-w-0">
            {user.isVerified || user.verificationStatus === 'VERIFIED' ? (
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-600/20 flex-shrink-0" />
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight truncate">Verified</p>
              </div>
            ) : user.verificationStatus === 'SUBMITTED' ? (
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-5 h-5 text-amber-500 fill-amber-500/20 flex-shrink-0" />
                <p className="text-lg sm:text-xl font-black text-amber-600 tracking-tight truncate">In Review</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <ShieldAlert className="w-5 h-5 text-blue-600 fill-blue-600/20 group-hover:scale-110 transition transform flex-shrink-0" />
                <p className="text-xl sm:text-2xl font-bold text-blue-600 tracking-tight truncate">Unverified</p>
              </div>
            )}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 flex items-center justify-between min-w-0">
              <span className="truncate mr-1">ID Verification</span>
              <span className="text-[10px] text-blue-600 group-hover:underline flex-shrink-0">Manage &rarr;</span>
            </p>
          </div>
          <div className={`h-1.5 w-12 ${user.isVerified ? 'bg-emerald-500' : user.verificationStatus === 'SUBMITTED' ? 'bg-amber-500' : 'bg-blue-400'} rounded-full mt-4 flex-shrink-0`}></div>
        </Link>
      </div>

      {/* Identity Verification Alert Banner */}
      {!user.isVerified && user.verificationStatus !== 'VERIFIED' ? (
        <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs transition ${
          user.verificationStatus === 'SUBMITTED' 
            ? 'bg-amber-50/90 border-amber-200 text-amber-950' 
            : 'bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-50 border-blue-200 text-blue-950'
        }`}>
          <div className="flex items-center gap-3 font-semibold text-sm sm:text-base">
            <div className={`w-9 h-9 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow-sm ${
              user.verificationStatus === 'SUBMITTED' ? 'bg-amber-600' : 'bg-blue-600'
            }`}>
              {user.verificationStatus === 'SUBMITTED' ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              {user.verificationStatus === 'SUBMITTED' ? (
                <span>Your verification portfolio (Gov ID, Payment Proof, & Selfie) is currently under administrative audit. </span>
              ) : (
                <span>Identity KYC verification required (Gov ID, Proof of Payment & Live Selfie). </span>
              )}
              <Link 
                href="/dashboard/verify" 
                className="text-blue-700 hover:text-blue-900 underline font-extrabold inline-flex items-center gap-1 transition ml-1"
              >
                {user.verificationStatus === 'SUBMITTED' ? 'View submitted file records &rarr;' : 'Upload documents & verify account &rarr;'}
              </Link>
            </div>
          </div>
          <Link
            href="/dashboard/verify" 
            className="text-xs bg-white hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-xl font-extrabold border border-slate-200 shadow-sm flex-shrink-0 transition transform active:scale-95"
          >
            {user.verificationStatus === 'SUBMITTED' ? '🔍 CHECK REVIEW VAULT' : '🛡️ SUBMIT REQUIRED DOCS'}
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-emerald-950 font-semibold text-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>Identity KYC verified and approved by Global Digital Forensic Administration.</span>
          </div>
          <Link href="/dashboard/verify" className="text-xs bg-white hover:bg-slate-50 text-emerald-800 font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
            COMPLIANCE APPROVED ✓
          </Link>
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
                          Disputed Amount: <span className="text-amber-700 font-extrabold font-mono">{formatCurrency(c.disputedAmount || user.balance || '$0.00')}</span>
                        </p>
                        <p className="text-sm font-bold text-slate-500 mt-1">
                          Recovered Amount: <span className="text-green-600 font-extrabold font-mono">{formatCurrency(c.recoveredAmount || user.recovered || '$0.00')}</span>
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
                  <div id="timeline" className="pt-8">
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

      {/* --- DOCUMENTS & COMPLIANCE VAULT MODULE (#documents) --- */}
      <div id="documents" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <FolderClosed className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Compliance & Case Document Vault</span>
                </h2>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              All identity records, payment receipts, and investigative file exhibits are isolated inside our encrypted SOC-2 compliance repository.
            </p>
          </div>
          <Link
            href="/dashboard/verify"
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-2 flex-shrink-0 transform active:scale-95"
          >
            <span>🛡️ Manage Document Vault &rarr;</span>
          </Link>
        </div>

        {/* 4 Required Document Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Government Issued ID */}
          <div className={`p-5 rounded-2xl border transition flex flex-col justify-between shadow-xs relative ${
            user.govIdDoc ? 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-300' : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                  user.govIdDoc ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  🆔
                </div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  user.govIdDoc ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200/80 animate-pulse'
                }`}>
                  {user.govIdDoc ? 'Uploaded ✓' : 'Action Needed'}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Government Issued ID</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                {user.govIdDoc ? `File secured: ${user.govIdDoc}` : 'Passport, Driver’s License, or National Identity Card required.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {user.govIdDoc ? (user.kycSubmittedAt ? new Date(user.kycSubmittedAt).toLocaleDateString() : 'Secure Vault') : 'Pending File'}
              </span>
              <Link
                href="/dashboard/verify"
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 underline transition flex items-center gap-0.5"
              >
                <span>{user.govIdDoc ? 'Inspect File' : 'Upload File'}</span> &rarr;
              </Link>
            </div>
          </div>

          {/* 2. Proof of Payment */}
          <div className={`p-5 rounded-2xl border transition flex flex-col justify-between shadow-xs relative ${
            user.proofOfPaymentDoc ? 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-300' : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                  user.proofOfPaymentDoc ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  💳
                </div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  user.proofOfPaymentDoc ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200/80 animate-pulse'
                }`}>
                  {user.proofOfPaymentDoc ? 'Uploaded ✓' : 'Action Needed'}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Proof of Payment</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                {user.proofOfPaymentDoc ? `File secured: ${user.proofOfPaymentDoc}` : 'Bank transfers, blockchain TX hashes, or debit statements.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {user.proofOfPaymentDoc ? (user.kycSubmittedAt ? new Date(user.kycSubmittedAt).toLocaleDateString() : 'Secure Vault') : 'Pending File'}
              </span>
              <Link
                href="/dashboard/verify"
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 underline transition flex items-center gap-0.5"
              >
                <span>{user.proofOfPaymentDoc ? 'Inspect File' : 'Upload File'}</span> &rarr;
              </Link>
            </div>
          </div>

          {/* 3. Live Selfie Holding ID */}
          <div className={`p-5 rounded-2xl border transition flex flex-col justify-between shadow-xs relative ${
            user.selfieDoc ? 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-300' : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                  user.selfieDoc ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  📸
                </div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  user.selfieDoc ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200/80 animate-pulse'
                }`}>
                  {user.selfieDoc ? 'Uploaded ✓' : 'Action Needed'}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Live Selfie & Phone</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                {user.selfieDoc ? `File secured: ${user.selfieDoc}` : 'Photo holding your ID & mobile phone with today’s date.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {user.selfieDoc ? (user.kycSubmittedAt ? new Date(user.kycSubmittedAt).toLocaleDateString() : 'Secure Vault') : 'Pending File'}
              </span>
              <Link
                href="/dashboard/verify"
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 underline transition flex items-center gap-0.5"
              >
                <span>{user.selfieDoc ? 'Inspect File' : 'Upload File'}</span> &rarr;
              </Link>
            </div>
          </div>

          {/* 4. Other Supporting Documents */}
          <div className={`p-5 rounded-2xl border transition flex flex-col justify-between shadow-xs relative ${
            user.otherDoc ? 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-300' : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                  user.otherDoc ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  📂
                </div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  user.otherDoc ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {user.otherDoc ? 'Uploaded ✓' : 'Optional File'}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Supporting Exhibits</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                {user.otherDoc ? `File secured: ${user.otherDoc}` : 'Police fraud reports, scammer chat histories, or court claims.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {user.otherDoc ? (user.kycSubmittedAt ? new Date(user.kycSubmittedAt).toLocaleDateString() : 'Secure Vault') : 'Optional'}
              </span>
              <Link
                href="/dashboard/verify"
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 underline transition flex items-center gap-0.5"
              >
                <span>{user.otherDoc ? 'Inspect File' : 'Attach File'}</span> &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Audit status badge */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Document security protocol: 256-Bit AES TLS-1.3 Encryption active. Verified documents are directly linked to your master client identity for release of recovered escrow funds.</span>
          </div>
          <Link href="/dashboard/verify" className="font-extrabold text-blue-600 hover:underline flex-shrink-0">
            View Compliance Log &rarr;
          </Link>
        </div>
      </div>

      {/* --- ESCROW PAYMENTS & ASSET DISBURSEMENT MODULE (#payments) --- */}
      <div id="payments" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Escrow Payments & Asset Disbursement</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Manage recovered funds, review financial settlements, and track restitution payout channels.
              </p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
            Escrow Secured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-lg flex flex-col justify-between space-y-4 overflow-hidden min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block truncate">Current Available Balance</span>
              {(() => {
                const formatted = formatCurrency(user.balance || '$0.00');
                return (
                  <p title={formatted} className={`${getAmountFontSize(formatted)} font-mono font-extrabold text-white mt-1 truncate w-full`}>
                    {formatted}
                  </p>
                );
              })()}
              <p className="text-xs text-slate-300 font-medium mt-1 truncate">Ready for verified bank wire or cold-wallet routing.</p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => {
                  if (!user.isVerified && user.verificationStatus !== 'VERIFIED') {
                    alert("Verification Required: You must submit your Gov ID, Proof of Payment, and Live Selfie before requesting escrow funds disbursement.");
                    router.push('/dashboard/verify');
                  } else {
                    alert("Disbursement request submitted! Your assigned forensic director will contact you to confirm transfer routing.");
                  }
                }}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 transform active:scale-95"
              >
                <span>Request Asset Withdrawal &rarr;</span>
              </button>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 overflow-hidden min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block truncate">Total Restitution Recovered</span>
              {(() => {
                const formatted = formatCurrency(user.recovered || '$0.00');
                return (
                  <p title={formatted} className={`${getAmountFontSize(formatted)} font-mono font-extrabold text-slate-900 mt-1 truncate w-full`}>
                    {formatted}
                  </p>
                );
              })()}
              <p className="text-xs text-slate-500 font-medium mt-1 truncate">Aggregate forensic recoveries achieved by GDFAS legal action.</p>
            </div>
            <div className="pt-2">
              <Link 
                href="/dashboard"
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>View Recovery Statements</span>
              </Link>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block">Disbursement Gatekeeper</span>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-sm font-extrabold text-slate-900 mt-2">
                {user.isVerified || user.verificationStatus === 'VERIFIED' ? '🟢 Gatekeeper Unlocked' : '🟠 Gatekeeper Locked'}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {user.isVerified || user.verificationStatus === 'VERIFIED' 
                  ? 'Your account identity is completely verified. Immediate payouts are authorized.' 
                  : 'For protection against unauthorized wire redirects, escrow funds cannot be released until all 3 KYC document types are approved by Admin.'}
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/dashboard/verify"
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs rounded-xl border border-blue-200 transition flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>{user.isVerified || user.verificationStatus === 'VERIFIED' ? 'Review KYC Vault ✓' : 'Complete Verification &rarr;'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
