// app/(client)/apply/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createCase } from '@/app/actions';
import { getCurrentClient } from '@/app/actions/clientAuth';
import { 
  Shield, 
  Lock, 
  User, 
  FileText, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  HelpCircle
} from 'lucide-react';

export default function EnhancedApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSession, setClientSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States / Global',
    dateOfBirth: '1988-05-12',
    amountLost: '$15,000.00',
    timesVictim: '1',
    awareOfScam: 'YES',
    paymentMethod: 'CRYPTOCURRENCY',
    lossYear: '2026',
    recoveryAttempts: 'No prior recovery attempted',
    scammerName: '',
    description: '',
  });

  useEffect(() => {
    async function initClient() {
      try {
        const session = await getCurrentClient();
        if (session && session.email) {
          setClientSession(session);
          setFormData(prev => ({
            ...prev,
            fullName: (session.fullName && session.fullName !== 'Client') ? session.fullName : prev.fullName,
            email: session.email || prev.email
          }));
        } else {
          setClientSession(null);
        }
      } catch (e) {
        setClientSession(null);
      } finally {
        setIsLoadingSession(false);
      }
    }
    initClient();
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleNextStep(e: React.MouseEvent) {
    e.preventDefault();
    if (step === 1 && (!formData.fullName || !formData.email || !formData.phone)) {
      alert("Please provide your full legal name, valid email, and contact number to initialize the file.");
      return;
    }
    if (step === 2 && (!formData.amountLost || !formData.scammerName)) {
      alert("Please state the estimated loss amount and the target entity / platform name.");
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePrevStep() {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    // Build FormData payload for server action
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.append(key, val);
    });

    try {
      await createCase(payload);
    } catch (err) {
      setIsSubmitting(false);
      alert("Error occurred while transmitting case details. Please check your network or try again.");
    }
  }

  // --- 1. LOADING STATE ---
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-slate-100 p-6">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-xs sm:text-sm font-extrabold text-slate-400 tracking-wider uppercase">Verifying Client Workspace Authorization...</p>
      </div>
    );
  }

  // --- 2. AUTHENTICATION REQUIRED GATE FOR ANONYMOUS VISITORS ---
  if (!clientSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
        {/* Background Ambient Lighting */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="max-w-xl w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-8 relative z-10 animate-in fade-in">
          
          {/* Header Icon */}
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-blue-500 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-[11px] font-extrabold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" /> Client Profile Required
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to File Your Claim
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              To ensure your recovery file is securely linked to your profile for live 5-stage tracking and direct chat with your assigned specialist, please sign into your client workspace first.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Direct Google OAuth Trigger */}
            <button
              onClick={() => { window.location.href = '/api/auth/google'; }}
              className="w-full py-4 px-6 bg-white hover:bg-slate-100 text-slate-950 font-extrabold rounded-2xl shadow-xl transition transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 10.9 0 12.5s.6 3.1 1.6 5.1l3.7-2.8z"/>
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2-6.7-5.2l-3.7 2.8C3.5 20.4 7.4 23 12 23z"/>
              </svg>
              <span>Instant Sign-In / Up with Gmail &rarr;</span>
            </button>

            <Link
              href="/signup"
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-600/30 transition transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm block"
            >
              <span>Register Portal Account Manually</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-4 border-t border-slate-700/80">
              <Link href="/login" className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4 transition">
                Already registered? Sign directly into your existing dashboard &rarr;
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold pt-2">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>GDFAS Client Account Encryption & Permanent Dossier Binding</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. AUTHENTICATED WIZARD INTAKE FORM ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> 
            <span>Cancel & Return to Client Dashboard</span>
          </Link>

          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-full text-xs font-semibold text-emerald-400">
            <Shield className="w-4 h-4 fill-emerald-400/20" />
            <span>256-Bit TLS Encrypted & Account Bound</span>
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 font-extrabold text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Official GDFAS Claim Intake Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Submit Your Recovery Application
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
            Provide comprehensive details of your financial loss to initialize high-priority asset tracing, blockchain profiling, and specialist arbitration.
          </p>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-2 relative">
            
            {/* Step 1 */}
            <div className={`flex flex-col items-center text-center gap-2 pb-3 border-b-2 transition duration-300 ${step >= 1 ? 'border-blue-500 text-blue-400' : 'border-slate-700 text-slate-500'}`}>
              <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-500'}`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">1. Claimant Profile</span>
            </div>

            {/* Step 2 */}
            <div className={`flex flex-col items-center text-center gap-2 pb-3 border-b-2 transition duration-300 ${step >= 2 ? 'border-blue-500 text-blue-400' : 'border-slate-700 text-slate-500'}`}>
              <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-500'}`}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">2. Asset & Loss Taxonomy</span>
            </div>

            {/* Step 3 */}
            <div className={`flex flex-col items-center text-center gap-2 pb-3 border-b-2 transition duration-300 ${step === 3 ? 'border-blue-500 text-blue-400' : 'border-slate-700 text-slate-500'}`}>
              <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition ${step === 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-500'}`}>
                3
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">3. Forensic Narrative</span>
            </div>

          </div>
        </div>

        {/* WIZARD CARD */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
          
          <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              GDFAS Compliance Intelligence Node
            </span>
            <span className="text-slate-400 font-semibold">Step {step} of 3</span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            
            {/* STEP 1: CLAIMANT PROFILE */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-700/80 pb-4">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-500" />
                    Personal & Contact Identification
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Your assigned recovery team will utilize these confidential communication channels to relay recovery updates.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                      Full Legal Name <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="fullName" 
                      required 
                      value={formData.fullName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. James Thornton" 
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                      Registered Email Address <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      readOnly={!!clientSession}
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="name@example.com" 
                      className={`w-full border rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition ${clientSession ? 'bg-slate-900/50 border-slate-700 text-slate-300 cursor-not-allowed' : 'bg-slate-900/90 border-slate-700'}`}
                    />
                    {clientSession && <span className="text-[11px] font-bold text-emerald-400 mt-1.5 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Verified via active portal workspace account</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                      Primary Contact Number (with country code) <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="+1 (555) 019-2834" 
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                      Country of Jurisdiction <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="country" 
                      required 
                      value={formData.country} 
                      onChange={handleInputChange} 
                      placeholder="e.g. United Kingdom" 
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                      Date of Birth
                    </label>
                    <input 
                      type="date" 
                      name="dateOfBirth" 
                      required 
                      value={formData.dateOfBirth} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/30 transition transform active:scale-95 flex items-center gap-2 text-sm"
                  >
                    <span>Proceed to Asset Taxonomy</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ASSET & LOSS TAXONOMY */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-700/80 pb-4">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    Asset Taxonomy & Financial Valuation
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Specify the disputed financial valuation and target payment conduits involved in the transaction.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
                      Estimated Total Financial Loss (in USD / Local Currency) <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="amountLost" 
                      required 
                      value={formData.amountLost} 
                      onChange={handleInputChange} 
                      placeholder="e.g. $45,000.00 or 6.10 Lac" 
                      className="w-full bg-slate-900/90 border-2 border-amber-500/50 rounded-xl p-4 text-white text-lg font-mono font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                        Primary Transfer Method Used <span className="text-red-400">*</span>
                      </label>
                      <select 
                        name="paymentMethod" 
                        value={formData.paymentMethod} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                      >
                        <option value="CRYPTOCURRENCY">CRYPTOCURRENCY (BTC / USDT / ETH)</option>
                        <option value="BANK WIRE TRANSFER">BANK WIRE TRANSFER / SWIFT</option>
                        <option value="CREDIT / DEBIT CARD">CREDIT / DEBIT CARD TRANSACTIONS</option>
                        <option value="WALLET / CASH APP / UPI">ONLINE WALLET (CASH APP / UPI / PAYPAL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                        Target Entity / Scammer / Platform Name <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="scammerName" 
                        required 
                        value={formData.scammerName} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Apex Crypto Trading, Fake Broker Name" 
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                        Year of Incident Occurrence
                      </label>
                      <input 
                        type="text" 
                        name="lossYear" 
                        required 
                        value={formData.lossYear} 
                        onChange={handleInputChange} 
                        placeholder="e.g. 2025 or 2026" 
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                        How many times were you deceived by this group?
                      </label>
                      <input 
                        type="number" 
                        name="timesVictim" 
                        required 
                        value={formData.timesVictim} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                        Are you aware this transaction was illicit / fraudulent?
                      </label>
                      <select 
                        name="awareOfScam" 
                        value={formData.awareOfScam} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                      >
                        <option value="YES">YES - CONFIRMED FRAUDULENT SCHEME</option>
                        <option value="NO">NO - SUSPICIOUS UNRESPONSIVE PLATFORM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                        Prior Recovery Attempts or Partial Withdrawals
                      </label>
                      <input 
                        type="text" 
                        name="recoveryAttempts" 
                        required 
                        value={formData.recoveryAttempts} 
                        onChange={handleInputChange} 
                        placeholder="e.g. $0 recovered so far" 
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-slate-700/80">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/30 transition transform active:scale-95 flex items-center gap-2 text-sm"
                  >
                    <span>Proceed to Forensic Narrative</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: FORENSIC NARRATIVE & SUBMISSION */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-700/80 pb-4">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-400" />
                    Forensic Narrative & Evidence Declaration
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Describe how the scam occurred, including any communication apps used (Telegram, WhatsApp), wallet deposit hashes, or agent aliases.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                    Detailed Account of Transaction History & Scam Tactics <span className="text-red-400">*</span>
                  </label>
                  <textarea 
                    name="description" 
                    required 
                    rows={6} 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Provide timeline of deposits, platform URLs, customer support messages, and wallet addresses involved in this claim..." 
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition leading-relaxed"
                  ></textarea>
                </div>

                {/* Compliance Statement Box */}
                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5 text-xs text-slate-400 leading-relaxed space-y-2">
                  <p className="font-extrabold text-slate-200 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-400 inline" />
                    What happens next after transmission?
                  </p>
                  <p>
                    Once submitted, your dossier is assigned a cryptographic case reference ID and immediately routed to an authorized Senior Crypto Recovery Specialist in our Admin Division. You can track progress across our 5-stage timeline directly in your client workspace.
                  </p>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-700/80">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Valuation</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.description}
                    className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/30 transition transform active:scale-95 flex items-center justify-center gap-3 text-sm disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Transmitting Claim Dossier...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 fill-white/20" />
                        <span>Transmit to Forensic Division &rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>

      </div>
    </div>
  );
}