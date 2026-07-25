// app/(client)/reset-password/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { generatePasswordResetOTP, verifyOTPAndLogin } from '@/app/actions/clientAuth';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Mail,
  Smartphone,
  Sparkles
} from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();

  // Workflow Stages: 'REQUEST' -> 'VERIFY_OTP'
  const [stage, setStage] = useState<'REQUEST' | 'VERIFY_OTP'>('REQUEST');
  const [email, setEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  // Status flags
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await generatePasswordResetOTP(email);
      if (res.success) {
        setStage('VERIFY_OTP');
        setSuccessMsg(res.message || "A verification code has been sent directly to your email inbox.");
      } else {
        setError(res.error || "Unable to locate an active verified profile registered with this email address.");
      }
    } catch (err) {
      setError("Network connection timeout. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length < 6) {
      setError("Please enter the complete 6-digit security verification code from your email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await verifyOTPAndLogin(email, enteredOtp);
      if (res.success) {
        setSuccessMsg("Verification Code Confirmed! Transferring to secure password replacement vault...");
        setTimeout(() => {
          router.push('/setup-password');
        }, 1200);
      } else {
        setError(res.error || "Incorrect security verification code entered.");
        setLoading(false);
      }
    } catch (err) {
      setError("Verification exception occurred. Please verify your code and try again.");
      setLoading(false);
    }
  }

  function handleGoogleInstantReset() {
    setGoogleLoading(true);
    setError(null);
    window.location.href = '/api/auth/google';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Ambient illumination */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full mx-auto space-y-8 relative z-10 animate-in fade-in duration-300">
        
        {/* Navigation & Header */}
        <div>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition font-bold text-xs uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> 
            <span>Return to Login</span>
          </Link>

          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-blue-400 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-400 font-extrabold text-[11px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" /> GDFAS Identity Recovery Protocol
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Reset Portal Password
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Verify your identity via Google Authentication or request an encrypted 6-digit security code to be delivered to your inbox.
            </p>
          </div>
        </div>

        {/* CARD BODY */}
        <div className="bg-slate-800/80 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-400 text-xs font-semibold animate-in shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-emerald-400 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STAGE 1: MODE SELECTION & EMAIL FORM */}
          {stage === 'REQUEST' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* INSTANT GOOGLE OAUTH RESET */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleInstantReset}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform active:scale-[0.99] disabled:opacity-70 text-sm"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span>Authenticating Identity via Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7 8.9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 10.9 0 12.5s.6 3.1 1.6 5.1l3.7-2.8z"/>
                        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2-6.7-5.2l-3.7 2.8C3.5 20.4 7.4 23 12 23z"/>
                      </svg>
                      <span>1-Click Verify via Gmail & Reset &rarr;</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] font-bold text-slate-400 block text-center">
                  Recommended: Bypass email delays via verified Google session
                </span>
              </div>

              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-700/80" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-slate-800 px-3 text-slate-400">Or Receive Google OTP by Email</span>
                </div>
              </div>

              {/* EMAIL OTP REQUEST FORM */}
              <form onSubmit={handleRequestOTP} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white font-semibold placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading || !email}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Dispatching Email Security Code...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Send 6-Digit Verification Email &rarr;</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* STAGE 2: VERIFY EMAIL OTP PINPAD */}
          {stage === 'VERIFY_OTP' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* CHECK EMAIL INBOX INSTRUCTION CARD (NO ON-SCREEN OTP DISCLOSURE!) */}
              <div className="bg-slate-900/95 border border-blue-500/40 rounded-2xl p-5 text-xs shadow-inner space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Check Your Email Inbox</h4>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3" /> Security Code Successfully Transmitted
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                  We have dispatched a confidential 6-digit One-Time Security Code directly to your registered inbox: <span className="text-white font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded">{email}</span>.
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  * Note: If you don't see the email within 60 seconds, please verify your spam or promotions folder. Code expires in 10 minutes.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 text-center">
                    Enter 6-Digit Verification Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="w-full bg-slate-900/90 border-2 border-blue-500/50 rounded-2xl py-4 text-center text-white font-mono font-extrabold text-3xl tracking-[0.5em] placeholder:text-slate-600 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading || enteredOtp.length !== 6}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/30 transition transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Confirm Code & Set New Password &rarr;</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStage('REQUEST'); setEnteredOtp(''); }}
                    className="text-xs font-extrabold text-slate-400 hover:text-white transition py-2"
                  >
                    &larr; Request a replacement code or change email address
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            Zero-Knowledge Credential Replacement & Encrypted Transmission
          </p>
        </div>

      </div>
    </div>
  );
}
