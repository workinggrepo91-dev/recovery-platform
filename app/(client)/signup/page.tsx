// app/(client)/signup/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { registerOrLoginClient } from '@/app/actions/clientAuth';
import { Shield, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [error, setError] = useState('');

  // Manual Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await registerOrLoginClient({
      email,
      fullName,
      password,
      authProvider: 'MANUAL'
    });

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError('An error occurred during registration.');
      setLoading(false);
    }
  }

  function handleGoogleSignUp() {
    setGmailLoading(true);
    setError('');
    // Redirect directly to authentic Google OAuth endpoint to capture verified name & email
    window.location.href = '/api/auth/google';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-3 justify-center group">
          <div className="relative w-12 h-12 bg-white rounded-xl p-1.5 shadow-lg group-hover:scale-105 transition">
            <Image src="/logo.png" alt="GDFAS Logo" fill className="object-contain p-1" priority />
          </div>
          <div className="text-left leading-tight">
            <span className="block text-lg font-extrabold text-white tracking-tight">GDFAS</span>
            <span className="block text-xs font-semibold text-blue-400 uppercase tracking-wider">Client Portal</span>
          </div>
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
          Create Your Client Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-800/80 backdrop-blur-md py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-700/80">
          
          {/* Automatic Claim Linkage Advisory */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 mb-6 flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-white">Automatic Claim Linking Active</p>
              <p className="text-emerald-400/90">Sign up using the same email address you applied with, and your recovery claim will be automatically placed in your secure workspace dashboard upon entry!</p>
            </div>
          </div>

          {/* GMAIL / GOOGLE SIGN-UP BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={gmailLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-[0.99] disabled:opacity-70 text-sm"
            >
              {gmailLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span>Redirecting to Google Authentication...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7 8.9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 10.9 0 12.5s.6 3.1 1.6 5.1l3.7-2.8z"/>
                    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2-6.7-5.2l-3.7 2.8C3.5 20.4 7.4 23 12 23z"/>
                  </svg>
                  <span>Sign Up with Gmail / Google</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-3 text-slate-400 font-medium tracking-wider">Or register manually</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold text-center animate-in fade-in">
              {error}
            </div>
          )}

          {/* MANUAL REGISTER FORM */}
          <form className="mt-6 space-y-5" onSubmit={handleManualSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Full Legal Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. James Thornton"
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Create Secure Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || gmailLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99] disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Benefits Bullet Points */}
          <div className="mt-8 border-t border-slate-700/80 pt-6 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-time cryptocurrency & wire recovery tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct encrypted chat with assigned recovery agent</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
