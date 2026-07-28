// app/(client)/success/page.tsx
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; email?: string }>;
}) {
  const { id, email } = await searchParams;

  if (!id) {
    redirect('/');
  }

  const signupUrl = email ? `/signup?email=${encodeURIComponent(email)}` : '/signup';
  const loginUrl = email ? `/login?email=${encodeURIComponent(email)}` : '/login';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-10 text-center relative z-10">
        
        {/* Success Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/5 animate-in zoom-in duration-500">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <span className="text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-3">
          Step 1 Complete: Claim Filed
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">
          Application Received Successfully
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto font-medium">
          Your recovery claim has been logged with GDFAS under case reference <span className="font-mono text-emerald-400 font-bold px-1.5 py-0.5 bg-slate-800 rounded">{id}</span>. Our forensic investigation team will begin reviewing your submitted evidence.
        </p>

        {/* Action Callout: Mandatory Registration */}
        <div className="bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/80 rounded-2xl p-6 sm:p-8 mb-8 border border-blue-500/30 text-left relative overflow-hidden shadow-inner">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-1">
                Step 2 Required: Open Client Account
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                To secure your forensic evidence, monitor real-time recovery progress, communicate with your assigned forensic specialist, and upload mandatory KYC documents, you must complete account registration now.
              </p>

              {email && (
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 mb-4 inline-flex items-center gap-2 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Application Email Detected:</span>
                  <span className="font-mono font-bold text-white">{email}</span>
                </div>
              )}

              <p className="text-emerald-400 text-xs font-bold mb-6">
                ✨ Upon creating your account with your application email, this claim will automatically link directly inside your client dashboard!
              </p>

              <Link 
                href={signupUrl} 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base rounded-xl transition shadow-lg shadow-blue-600/30 inline-flex items-center justify-center gap-2 transform active:scale-98"
              >
                <span>Complete Account Setup Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-xs text-slate-400 font-semibold pt-2 border-t border-slate-800/80">
          <span>Already have an active client account?</span>
          <Link href={loginUrl} className="text-blue-400 hover:text-blue-300 underline font-bold transition">
            Sign In to Dashboard &rarr;
          </Link>
          <span className="hidden sm:inline text-slate-700">•</span>
          <Link href={`/track?code=${id}`} className="text-slate-500 hover:text-slate-400 underline transition">
            Check via standalone tracker
          </Link>
        </div>

      </div>
    </div>
  );
}