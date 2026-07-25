// app/admin/components/AdminCaseControlPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { updateAdminCaseControls, getAdminChatHistory, adminPostChatMessage } from '@/app/actions/adminActions';
import { 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  Save, 
  Check, 
  MessageSquare, 
  Send, 
  Loader2,
  Sparkles,
  Scale,
  Award
} from 'lucide-react';

interface AdminControlProps {
  caseId: string;
  email: string;
  initialData: {
    status?: string;
    progressStep?: string;
    disputedAmount?: string;
    recoveredAmount?: string;
    priority?: string;
    legalStatus?: string;
    assignedAgent?: string;
    agentTitle?: string;
    amountLost?: string;
    caseReference?: string;
  };
}

export default function AdminCaseControlPanel({ caseId, email, initialData }: AdminControlProps) {
  const [progressStep, setProgressStep] = useState(initialData.progressStep || 'INVESTIGATING');
  const [status, setStatus] = useState(initialData.status || 'INVESTIGATING');
  const [balance, setBalance] = useState(initialData.disputedAmount || initialData.amountLost || '$0.00');
  const [disputedAmount, setDisputedAmount] = useState(initialData.disputedAmount || initialData.amountLost || '$0.00');
  const [recoveredAmount, setRecoveredAmount] = useState(initialData.recoveredAmount || '$0.00');
  const [priority, setPriority] = useState(initialData.priority || 'high');
  const [legalStatus, setLegalStatus] = useState(initialData.legalStatus || 'Legal Action');
  const [assignedAgent, setAssignedAgent] = useState(initialData.assignedAgent || 'James Thornton');
  const [agentTitle, setAgentTitle] = useState(initialData.agentTitle || 'Crypto Recovery Expert');
  const [isVerified, setIsVerified] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Live Admin Chat State
  const caseRef = initialData.caseReference || caseId.slice(0, 8).toUpperCase();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [adminInput, setAdminInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loadingChat, setLoadingChat] = useState(true);

  useEffect(() => {
    async function loadChat() {
      setLoadingChat(true);
      const msgs = await getAdminChatHistory(caseRef);
      setChatMessages(msgs);
      setLoadingChat(false);
    }
    loadChat();
  }, [caseRef]);

  async function handleSaveControls(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    const res = await updateAdminCaseControls(caseId, email, {
      progressStep,
      status,
      disputedAmount,
      recoveredAmount,
      priority,
      legalStatus,
      assignedAgent,
      agentTitle,
      isVerified,
      balance
    });

    setSaving(false);
    setSaveMessage(res.message);
    setTimeout(() => setSaveMessage(null), 4000);
  }

  async function handleAdminSendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!adminInput.trim() || sendingMsg) return;

    const text = adminInput.trim();
    setAdminInput('');
    setSendingMsg(true);

    const res = await adminPostChatMessage(caseRef, assignedAgent, text);
    if (res.success) {
      setChatMessages(prev => [...prev, res.message]);
    }
    setSendingMsg(false);
  }

  const stageOptions = [
    { value: 'SUBMITTED', label: '1. Submitted' },
    { value: 'IN_REVIEW', label: '2. In Review' },
    { value: 'INVESTIGATING', label: '3. Investigating' },
    { value: 'LEGAL_ACTION', label: '4. Legal Action' },
    { value: 'RECOVERED', label: '5. Recovered (Success)' },
  ];

  return (
    <div className="space-y-6">
      
      {/* MASTER FINANCIAL & TIMELINE COMMAND CENTER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2.5 text-blue-400">
              <Sparkles className="w-6 h-6 animate-pulse text-blue-400" />
              Admin Mastery & Control Command
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              Directly dictate account balance, recovered totals, 5-stage tracking timeline, and KYC verification on the client dashboard.
            </p>
          </div>
          {saveMessage && (
            <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4 stroke-[3]" />
              {saveMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSaveControls} className="mt-6 space-y-6">
          
          {/* SECTION 1: ACCOUNT BALANCES & RECOVERED AMOUNTS */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Client Financial Override
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Client Total Balance</label>
                <input 
                  type="text"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 font-mono text-lg font-black text-white focus:outline-none focus:border-blue-500"
                  placeholder="$0.00"
                />
                <p className="text-[11px] text-slate-400 mt-1">Rendered directly on client balance widget.</p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Case Disputed Amount</label>
                <input 
                  type="text"
                  value={disputedAmount}
                  onChange={(e) => setDisputedAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 font-mono text-lg font-black text-amber-400 focus:outline-none focus:border-amber-500"
                  placeholder="$0.00"
                />
                <p className="text-[11px] text-slate-400 mt-1">Disputed claim on active case card.</p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border-2 border-emerald-500/40 shadow-sm">
                <label className="text-xs font-bold text-emerald-300 block mb-1.5">Recovered Funds Amount</label>
                <input 
                  type="text"
                  value={recoveredAmount}
                  onChange={(e) => setRecoveredAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-500/60 rounded-lg p-2.5 font-mono text-lg font-black text-emerald-400 focus:outline-none focus:border-emerald-400"
                  placeholder="$0.00"
                />
                <p className="text-[11px] text-slate-400 mt-1">Highlights green recovery success on dashboard.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: 5-STAGE RECOVERY TRACKER & STATUS */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3">
              <Activity className="w-4 h-4 text-blue-400" />
              Recovery Progress Stage (Controls Client 5-Stage Timeline Bar)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Progress Timeline Selector */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 col-span-1 lg:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-2">Active Timeline Progress Stage</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {stageOptions.map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => setProgressStep(st.value)}
                      className={`p-2 rounded-lg text-xs font-bold transition border text-center ${
                        progressStep === st.value
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md font-extrabold scale-[1.02]'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID Verification Switch */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <label className="text-xs font-bold text-slate-300 block mb-2">Client KYC ID Verification</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVerified(true)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 border transition ${
                      isVerified 
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500' 
                        : 'bg-slate-900 text-slate-500 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVerified(false)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 border transition ${
                      !isVerified 
                        ? 'bg-amber-600/30 text-amber-300 border-amber-500' 
                        : 'bg-slate-900 text-slate-500 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" /> Unverified
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3: SPECIALIST PROFILE & LEGAL TAGS */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3">
              <UserCheck className="w-4 h-4 text-purple-400" />
              Assigned Recovery Specialist & Badges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Specialist Name</label>
                <input 
                  type="text" 
                  value={assignedAgent} 
                  onChange={(e) => setAssignedAgent(e.target.value)} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white font-bold outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Specialist Title</label>
                <input 
                  type="text" 
                  value={agentTitle} 
                  onChange={(e) => setAgentTitle(e.target.value)} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-blue-400 font-bold outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Priority Tag</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white font-bold outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Escalated</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Legal Action Status Tag</label>
                <input 
                  type="text" 
                  value={legalStatus} 
                  onChange={(e) => setLegalStatus(e.target.value)} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-purple-300 font-bold outline-none focus:border-purple-400" 
                />
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Synchronize Changes with Client Portal
            </button>
          </div>

        </form>
      </div>

      {/* LIVE ADMIN CHAT COMMUNICATOR */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Live Specialist Chat Communicator ({assignedAgent})
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Interact directly with the client in real-time. All replies appear in their dashboard chat box instantly.
            </p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Online Chat Link
          </span>
        </div>

        <div className="mt-4 h-64 overflow-y-auto p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200/80 flex flex-col">
          {loadingChat ? (
            <div className="m-auto text-slate-400 text-xs font-semibold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Fetching case message history...
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="m-auto text-slate-400 text-xs font-medium text-center">
              No messages exchanged on case #{caseRef} yet.<br/> Send an administrative greeting below!
            </div>
          ) : (
            chatMessages.map((m: any) => {
              const isAdmin = m.senderRole === 'AGENT';
              return (
                <div key={m.id} className={`flex gap-2 max-w-lg ${isAdmin ? 'ml-auto justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs sm:text-sm font-medium ${
                    isAdmin 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}>
                    <span className="block text-[10px] opacity-75 font-bold mb-0.5">{m.senderName} ({m.senderRole})</span>
                    {m.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleAdminSendChat} className="mt-3 flex items-center gap-2">
          <input 
            type="text"
            value={adminInput}
            onChange={(e) => setAdminInput(e.target.value)}
            placeholder={`Type reply message as ${assignedAgent}...`}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!adminInput.trim() || sendingMsg}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 transition"
          >
            {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Reply
          </button>
        </form>
      </div>

    </div>
  );
}
