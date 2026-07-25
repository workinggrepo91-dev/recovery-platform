// app/(client)/setup-password/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setClientPassword, getCurrentClient } from '@/app/actions/clientAuth';
import { 
  Lock, 
  KeyRound, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Mail
} from 'lucide-react';

export default function SetupPasswordPage() {
  const router = useRouter();
  const [clientSession, setClientSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function initSession() {
      try {
        const session = await getCurrentClient();
        if (!session) {
          router.push('/login');
          return;
        }
        setClientSession(session);
      } catch (err) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, [router]);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("For high-security compliance, your password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify your typing and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setClientPassword(password);
      if (res && res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard?password_set=true');
        }, 1800);
      } else {
        setErrorMessage(res?.error || "Unable to update password. Please check your connection.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage("A network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">Securing Cryptographic Credential Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Ambient background illumination */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full mx-auto space-y-8 relative z-10 animate-in fade-in duration-300">
        
        {/* Header Badging */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-3xl flex items-center justify-center mx-auto text-blue-400 shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 font-extrabold text-[11px] tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Google Profile Successfully Verified
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight">
            Create Your Portal Password
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            By setting up a manual password below, you can access your client dashboard in the future using either <strong className="text-white">Google Sign-In</strong> OR directly with your email and password.
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-slate-800/80 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">

          {/* SUCCESS SCREEN OVERLAY */}
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-white">Password Encrypted & Stored!</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your dual-authentication protocol is now active. Transferring you directly into your secure client dashboard...
              </p>
              <div className="pt-4 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
            </div>
          ) : (
            <>
              {/* Verified Gmail Identity Box */}
              {clientSession?.email && (
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex items-center gap-3 text-xs">
                  <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-400 font-medium block">Verified Portal Email</span>
                    <strong className="text-white font-mono text-sm truncate block">{clientSession.email}</strong>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-xs font-semibold animate-in shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Create Password Input */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                    Create Secure Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter minimum 6 characters..."
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3.5 pl-11 pr-12 text-white font-semibold placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition focus:outline-none"
                      title={showPassword ? "Hide Password" : "Show Password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-blue-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && password.length < 6 && (
                    <span className="text-[11px] font-bold text-amber-400 mt-1 block">⚠ Need {6 - password.length} more characters</span>
                  )}
                  {password.length >= 6 && (
                    <span className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 inline" /> Length requirement fulfilled
                    </span>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                    Confirm Secure Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password..."
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3.5 pl-11 pr-12 text-white font-semibold placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition focus:outline-none"
                      title={showConfirmPassword ? "Hide Password" : "Show Password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-blue-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && confirmPassword === password && (
                    <span className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 inline" /> Passwords match!
                    </span>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting || password.length < 6 || password !== confirmPassword}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition transform active:scale-[0.98] flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Encrypting & Saving Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 fill-white/20" />
                      <span>Save Password & Access Dashboard &rarr;</span>
                    </>
                  )}
                </button>

              </form>

              {/* Optional skip footer */}
              <div className="text-center pt-2 border-t border-slate-700/80">
                <Link 
                  href="/dashboard" 
                  className="text-xs font-semibold text-slate-400 hover:text-slate-300 transition"
                >
                  Skip for now and enter dashboard directly &rarr;
                </Link>
              </div>
            </>
          )}

        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            256-Bit Cryptographic Hashing & Secure Session Storage
          </p>
        </div>

      </div>
    </div>
  );
}
