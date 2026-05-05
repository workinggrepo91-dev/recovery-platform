// app/(client)/success/page.tsx
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ArrowRight, Copy } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  // If someone visits this page without an ID, send them back to home
  if (!id) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          Application Submitted Successfully
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Your official recovery claim has been received by the Global Digital Forensic Asset Service. Our investigation team will begin reviewing your evidence shortly.
        </p>

        {/* Tracking Code Box */}
        <div className="bg-slate-900 rounded-xl p-6 mb-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Important: Save Your Tracking Code
          </p>
          <p className="text-slate-300 text-sm mb-4">
            You will need this secure ID to check the status of your recovery and communicate with your assigned agent.
          </p>
          
          <div className="bg-black/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
            <code className="text-white font-mono text-sm sm:text-base break-all select-all">
              {id}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/track`} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            Go to Tracking Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/" 
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition flex items-center justify-center"
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}