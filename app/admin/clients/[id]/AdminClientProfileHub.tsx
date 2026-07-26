// app/admin/clients/[id]/AdminClientProfileHub.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  updateUserKYCStatus, 
  updateUserFinancials, 
  updateCaseStatus 
} from '@/app/actions/adminActions';
import { getUserMessages, sendUserMessage, ChatMessage } from '@/app/actions/chatActions';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  FolderPlus, 
  CreditCard, 
  Camera, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Award,
  Clock,
  Ban,
  Lock,
  ChevronDown,
  Sparkles,
  Scale
} from 'lucide-react';

export default function AdminClientProfileHub({ 
  initialClient, 
  initialCaseId 
}: { 
  initialClient: any; 
  initialCaseId: string | null; 
}) {
  const [client, setClient] = useState<any>(initialClient || {
    id: 'unknown',
    email: 'client@domain.com',
    fullName: 'Client Account',
    cases: [],
    balance: '$0.00',
    recovered: '$0.00'
  });

  // Tab control: 'OVERVIEW' | 'KYC' | 'CASES' | 'CHAT'
  const [activeTab, setActiveTab] = useState<string>(initialCaseId ? 'CASES' : 'OVERVIEW');

  // Financial inputs
  const [balanceInput, setBalanceInput] = useState(client.balance || '$0.00');
  const [recoveredInput, setRecoveredInput] = useState(client.recovered || '$0.00');
  const [savingFinance, setSavingFinance] = useState(false);

  // KYC state
  const [kycLoading, setKycLoading] = useState(false);

  // Case editing state (tracking edits per case ID)
  const [caseEdits, setCaseEdits] = useState<{ [key: string]: any }>({});
  const [savingCaseId, setSavingCaseId] = useState<string | null>(null);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(initialCaseId);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to target case if arriving from admin dashboard link
  const targetCaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCaseId && targetCaseRef.current) {
      setTimeout(() => {
        targetCaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [initialCaseId]);

  useEffect(() => {
    if (activeTab === 'CHAT') {
      loadThread();
    }
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingChat]);

  async function loadThread() {
    setLoadingChat(true);
    const msgs = await getUserMessages(client.email);
    setMessages(msgs);
    setLoadingChat(false);
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || sendingReply) return;

    const text = replyText.trim();
    setReplyText('');
    setSendingReply(true);
    const res = await sendUserMessage(client.email, 'James Thornton (Senior Director)', 'AGENT', text);
    if (res.success && res.message) {
      setMessages(prev => [...prev, res.message]);
    }
    setSendingReply(false);
  }

  async function handleSaveFinancials() {
    setSavingFinance(true);
    const res = await updateUserFinancials(client.email, balanceInput, recoveredInput);
    setClient((prev: any) => ({ ...prev, balance: balanceInput, recovered: recoveredInput }));
    setSavingFinance(false);
    alert(res.message || 'Balances updated successfully!');
  }

  async function handleKYCDecision(status: 'VERIFIED' | 'REJECTED' | 'UNVERIFIED', isVerified: boolean) {
    setKycLoading(true);
    const res = await updateUserKYCStatus(client.email, status, isVerified);
    setClient((prev: any) => ({ ...prev, verificationStatus: status, isVerified }));
    setKycLoading(false);
    alert(res.message);
  }

  function handleCaseInputChange(caseId: string, field: string, value: string) {
    setCaseEdits(prev => ({
      ...prev,
      [caseId]: {
        ...prev[caseId],
        [field]: value
      }
    }));
  }

  async function handleSaveCase(c: any) {
    setSavingCaseId(c.id);
    const edits = caseEdits[c.id] || {};
    const updatedStatus = edits.status || c.status || 'INVESTIGATING';
    const updatedStep = edits.progressStep || c.progressStep || 'INVESTIGATING';
    const updatedDisputed = edits.disputedAmount || c.disputedAmount || c.amountLost || '$0.00';
    const updatedRecovered = edits.recoveredAmount || c.recoveredAmount || '$0.00';

    await updateCaseStatus(c.id, {
      status: updatedStatus,
      progressStep: updatedStep,
      disputedAmount: updatedDisputed,
      recoveredAmount: updatedRecovered,
      assignedAgent: edits.assignedAgent || c.assignedAgent || 'James Thornton',
      agentTitle: edits.agentTitle || c.agentTitle || 'Senior Recovery Director'
    });

    // Update state directly
    setClient((prev: any) => ({
      ...prev,
      cases: prev.cases.map((item: any) => item.id === c.id ? {
        ...item,
        status: updatedStatus,
        progressStep: updatedStep,
        disputedAmount: updatedDisputed,
        recoveredAmount: updatedRecovered,
        assignedAgent: edits.assignedAgent || c.assignedAgent || 'James Thornton'
      } : item)
    }));

    setSavingCaseId(null);
    alert(`Case ${c.caseReference || c.id} successfully updated! Changes are instantly live on client dashboard.`);
  }

  const isVerified = client.isVerified || client.verificationStatus === 'VERIFIED';
  const isSubmitted = !isVerified && client.verificationStatus === 'SUBMITTED';
  const isRejected = client.verificationStatus === 'REJECTED';

  const progressOptions = [
    { label: 'Step 1: Application Submitted', value: 'SUBMITTED' },
    { label: 'Step 2: Compliance In Review', value: 'IN_REVIEW' },
    { label: 'Step 3: Forensic Investigation', value: 'INVESTIGATING' },
    { label: 'Step 4: Legal Affidavit Action', value: 'LEGAL_ACTION' },
    { label: 'Step 5: Asset Escrow Recovered', value: 'RECOVERED' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Admin Control Center
        </Link>

        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-200 px-3 py-1 rounded-md">
          Profile UUID: {client.id}
        </span>
      </div>

      {/* EXECUTIVE CLIENT HERO HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
            {(client.fullName || client.email)[0].toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {client.fullName || 'Verified Client'}
              </h1>
              {client.authProvider === 'LEGACY' && (
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-extrabold px-2.5 py-0.5 rounded-full border border-purple-400/30 uppercase tracking-wider">
                  ⚡ SYNTHESIZED LEGACY CLAIM
                </span>
              )}
              {client.authProvider === 'GMAIL' && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-400/30 uppercase tracking-wider">
                  🟢 GMAIL OAUTH
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-mono">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{client.email}</span>
            </div>

            <p className="text-xs text-slate-400">
              Account Onboarding: {new Date(client.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Status & Quick Action Summary */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 w-full md:w-auto min-w-[280px] space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">KYC Compliance:</span>
            {isVerified ? (
              <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Approved
              </span>
            ) : isSubmitted ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Pending Review
              </span>
            ) : isRejected ? (
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-extrabold flex items-center gap-1">
                <Ban className="w-3.5 h-3.5 text-red-400" /> Rejected
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-extrabold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Unverified
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-t border-slate-700/80 pt-2.5">
            <span>Attached Recovery Claims:</span>
            <span className="font-mono text-white font-black bg-blue-600 px-2 py-0.5 rounded-md text-sm">{client.cases?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* MASTER HUB TABS */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === 'OVERVIEW' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <DollarSign className="w-4 h-4 text-blue-500" />
          <span>1. Profile & Financials</span>
        </button>

        <button
          onClick={() => setActiveTab('KYC')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition relative ${
            activeTab === 'KYC' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-500" />
          <span>2. KYC Documents Vault</span>
          {isSubmitted && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-2 right-3" />}
        </button>

        <button
          onClick={() => setActiveTab('CASES')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === 'CASES' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-4 h-4 text-green-500" />
          <span>3. Attached Cases ({client.cases?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('CHAT')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === 'CHAT' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          <span>4. Live Support Chat</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & FINANCIALS */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Client Account Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 lg:col-span-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-blue-600" />
              Account Specifications
            </h3>

            <div className="space-y-4 text-sm font-semibold text-slate-700">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="font-extrabold text-slate-900">{client.fullName || 'Verified Client'}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Registered Email</span>
                <span className="font-mono text-slate-900">{client.email}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Authentication Engine</span>
                <span className="font-extrabold text-indigo-700">{client.authProvider || 'MANUAL SIGNUP'}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Attached Claims</span>
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 font-black px-2.5 py-1 rounded-lg text-xs mt-1">
                  {client.cases?.length || 0} Formal Case Filing(s)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Executive Financial Command Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600 bg-green-50 p-1 rounded-lg" />
                Executive Financial Balance Controller
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Directly configure the real-time monetary balances displayed on this client's user workspace dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              
              {/* Balance Control */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  Total Active Balance
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-mono font-black text-slate-900 text-lg shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="$0.00"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Appears inside the primary blue card on `/dashboard`.</p>
              </div>

              {/* Recovered Control */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  Total Recovered Funds
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recoveredInput}
                    onChange={(e) => setRecoveredInput(e.target.value)}
                    className="w-full bg-white border border-green-300 rounded-xl px-4 py-3 font-mono font-black text-green-600 text-lg shadow-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="$0.00"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Appears inside the green escrow recovery stat card.</p>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveFinancials}
                disabled={savingFinance}
                className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-green-500/25 transition flex items-center gap-2.5 disabled:opacity-50"
              >
                {savingFinance ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Financial Balances Live</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: KYC DOCUMENT AUDIT SUITE */}
      {activeTab === 'KYC' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                Know-Your-Customer (KYC) Portfolio Audit
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Inspect identification files and transfer confirmations submitted by the client before authorising asset disbursements.
              </p>
            </div>

            <span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border shadow-xs ${
              isVerified 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : isSubmitted 
                  ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              Status: {client.verificationStatus || (isVerified ? 'VERIFIED' : 'UNVERIFIED')}
            </span>
          </div>

          {/* Document File Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gov ID */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" /> 1. Government-Issued ID
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-md uppercase">Mandatory</span>
              </div>
              
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 font-mono text-xs font-bold text-slate-700">
                {client.govIdDoc ? `📁 ${client.govIdDoc}` : '⚠️ No Government ID document submitted yet.'}
              </div>

              {client.govIdDoc && (
                <button 
                  onClick={() => alert(`Opening secure regulatory viewer for file: ${client.govIdDoc}`)}
                  className="text-xs font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Download & verify passport / license PDF &rarr;
                </button>
              )}
            </div>

            {/* Proof of Payment */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> 2. Proof of Payment / TX Hash
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-black px-2 py-0.5 rounded-md uppercase">Mandatory</span>
              </div>
              
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 font-mono text-xs font-bold text-slate-700">
                {client.proofOfPaymentDoc ? `📑 ${client.proofOfPaymentDoc}` : '⚠️ No wire receipt or transaction record submitted.'}
              </div>

              {client.proofOfPaymentDoc && (
                <button 
                  onClick={() => alert(`Opening secure regulatory viewer for file: ${client.proofOfPaymentDoc}`)}
                  className="text-xs font-extrabold text-indigo-600 hover:underline inline-flex items-center gap-1"
                >
                  Inspect wire statement / crypto hash &rarr;
                </button>
              )}
            </div>

            {/* Selfie Photo */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" /> 3. Live Selfie Holding Device / ID
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded-md uppercase">Mandatory</span>
              </div>
              
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 font-mono text-xs font-bold text-slate-700">
                {client.selfieDoc ? `🤳 ${client.selfieDoc}` : '⚠️ No liveness authentication selfie submitted.'}
              </div>

              {client.selfieDoc && (
                <button 
                  onClick={() => alert(`Opening high-resolution visual inspection for photo: ${client.selfieDoc}`)}
                  className="text-xs font-extrabold text-purple-600 hover:underline inline-flex items-center gap-1"
                >
                  Confirm live facial comparison photo &rarr;
                </button>
              )}
            </div>

            {/* Other Supporting Docs */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-slate-700" /> 4. Supplementary Evidence
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-black px-2 py-0.5 rounded-md uppercase">Optional</span>
              </div>
              
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 font-mono text-xs font-bold text-slate-700">
                {client.otherDoc ? `📂 ${client.otherDoc}` : 'No supplementary police reports or affidavits attached.'}
              </div>

              {client.otherDoc && (
                <button 
                  onClick={() => alert(`Opening supplementary folder for file: ${client.otherDoc}`)}
                  className="text-xs font-extrabold text-slate-600 hover:underline inline-flex items-center gap-1"
                >
                  Download supporting evidentiary file &rarr;
                </button>
              )}
            </div>

          </div>

          {/* Admin Decision Toolbar */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-base text-white">Execute Final KYC Compliance Determination</h4>
                <p className="text-xs text-slate-300 mt-0.5">Authorizing verification instantly removes the action required alert on the client's dashboard.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => handleKYCDecision('VERIFIED', true)}
                disabled={kycLoading}
                className="py-4 px-6 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-green-600/25 transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                {kycLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                <span>Authorize & Mark Verified</span>
              </button>

              <button
                onClick={() => handleKYCDecision('REJECTED', false)}
                disabled={kycLoading}
                className="py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/25 transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Ban className="w-5 h-5" />
                <span>Reject & Demand Re-upload</span>
              </button>

              <button
                onClick={() => handleKYCDecision('UNVERIFIED', false)}
                disabled={kycLoading}
                className="py-4 px-6 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Unverified</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ATTACHED RECOVERY CASES */}
      {activeTab === 'CASES' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                <Scale className="w-6 h-6 text-green-600" />
                Attached Asset Recovery Claims ({client.cases?.length || 0})
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Every recovery case filed by or linked to this client profile is displayed below. Alter stages and financial metrics directly.
              </p>
            </div>

            {initialCaseId && (
              <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-blue-200 shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Arrived from Dashboard Case Link
              </span>
            )}
          </div>

          {client.cases && client.cases.length > 0 ? (
            client.cases.map((c: any) => {
              const isTargeted = initialCaseId && (initialCaseId === c.id || initialCaseId === c.caseReference);
              const edits = caseEdits[c.id] || {};
              const currentStep = edits.progressStep || c.progressStep || c.status || 'INVESTIGATING';

              return (
                <div 
                  key={c.id}
                  ref={isTargeted ? targetCaseRef : null}
                  className={`bg-white rounded-3xl border transition shadow-sm overflow-hidden ${
                    isTargeted ? 'ring-4 ring-blue-500 border-blue-500 shadow-xl' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isTargeted && (
                    <div className="bg-blue-600 text-white font-black text-xs px-6 py-2 uppercase tracking-wider flex items-center justify-between">
                      <span>📍 Targeted Recovery Claim from Admin Control Center</span>
                      <span className="text-blue-200 text-[11px] font-mono">Case Reference: {c.caseReference}</span>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-6">
                    
                    {/* Case Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-400 block">UUID: {c.id}</span>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                          Claim #{c.caseReference} — {c.scammerName || 'Cryptocurrency Asset Fraud'}
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-xs">
                          Stage: {c.status || 'INVESTIGATION'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Financial Overview inside Case */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 font-mono text-sm">
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-sans font-bold">Reported Loss:</span>
                        <span className="font-extrabold text-red-600">{c.amountLost || '$0.00'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-sans font-bold">Disputed Value:</span>
                        <span className="font-black text-slate-900">{c.disputedAmount || c.amountLost || '$0.00'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-sans font-bold">Escrow Recovered:</span>
                        <span className="font-extrabold text-green-600">{c.recoveredAmount || '$0.00'}</span>
                      </div>
                    </div>

                    {/* Inline Admin Controls */}
                    <div className="space-y-4 pt-2">
                      <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Modify Live Case Metrics & Progress:</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        {/* Progress Step Selector */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Progress Timeline Stage</label>
                          <select
                            value={currentStep}
                            onChange={(e) => {
                              handleCaseInputChange(c.id, 'progressStep', e.target.value);
                              handleCaseInputChange(c.id, 'status', e.target.value);
                            }}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-slate-900 shadow-xs focus:ring-2 focus:ring-blue-500"
                          >
                            {progressOptions.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Disputed Amount Input */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Disputed Claim Amount</label>
                          <input
                            type="text"
                            defaultValue={c.disputedAmount || c.amountLost || '$0.00'}
                            onChange={(e) => handleCaseInputChange(c.id, 'disputedAmount', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-black text-slate-900 shadow-xs focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Recovered Amount Input */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Recovered Asset Value</label>
                          <input
                            type="text"
                            defaultValue={c.recoveredAmount || '$0.00'}
                            onChange={(e) => handleCaseInputChange(c.id, 'recoveredAmount', e.target.value)}
                            className="w-full bg-white border border-green-300 rounded-xl px-3.5 py-2 text-xs font-mono font-black text-green-600 shadow-xs focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          onClick={() => handleSaveCase(c)}
                          disabled={savingCaseId === c.id}
                          className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 flex items-center gap-2"
                        >
                          {savingCaseId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span>Commit Updates to Client Portal</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-black text-base text-slate-700">No active formal recovery claims found for this profile.</p>
              <p className="text-xs text-slate-500">When the client completes an application on `/apply`, it will automatically bind here!</p>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: DIRECT CLIENT SUPPORT CHAT */}
      {activeTab === 'CHAT' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          
          <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                Encrypted Support Line: {client.fullName || client.email}
              </h3>
              <p className="text-xs text-slate-400 font-mono">1-on-1 direct channel linked to client dashboard at `/dashboard/messages`</p>
            </div>
            <button onClick={loadThread} className="p-2 text-slate-400 hover:text-white rounded-xl transition" title="Refresh Chat">
              <RefreshCw className={`w-5 h-5 ${loadingChat ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
            {loadingChat ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-xs font-extrabold">Loading Conversation Log...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                <MessageSquare className="w-12 h-12 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No correspondence established with this client yet.</p>
                <p className="text-xs text-slate-500">Send an authoritative introduction below to engage their dashboard directly!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isAdmin = m.senderRole === 'AGENT';
                return (
                  <div key={m.id} className={`flex gap-3 max-w-lg ${isAdmin ? 'ml-auto justify-end' : 'justify-start'}`}>
                    <div className={`space-y-1 ${isAdmin ? 'text-right' : 'text-left'}`}>
                      <span className="text-[10px] text-slate-400 font-bold px-1">{m.senderName}</span>
                      <div className={`p-4 rounded-2xl text-sm shadow-xs leading-relaxed ${
                        isAdmin 
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleSendReply} className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type an official admin reply as James Thornton..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || sendingReply}
                className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Message
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
