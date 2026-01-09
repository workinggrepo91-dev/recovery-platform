// app/(client)/track/page.tsx
'use client';

import { useState } from 'react';
import { getCaseStatus } from '@/app/actions';
import { Search, Loader2, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function TrackPage() {
  const [caseId, setCaseId] = useState('');
  const [statusResult, setStatusResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheck() {
    if (!caseId) return;
    setLoading(true);
    setError('');
    setStatusResult(null);

    const result = await getCaseStatus(caseId);
    
    if (result.error) {
      setError(result.error);
    } else {
      setStatusResult(result.data);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Track Your Case</h1>
          <p className="text-slate-500 mt-2">Enter your secure Case ID to check investigation progress.</p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input 
            type="text" 
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="e.g. 550e8400-e29b..." 
            className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>

        <button 
          onClick={handleCheck}
          disabled={loading || !caseId}
          className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Searching Database...' : 'Check Status'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Success Result */}
        {statusResult && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Current Status</h3>
            
            <div className={`p-4 rounded-xl border flex items-center gap-4 ${
              statusResult.status === 'SUBMITTED' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              statusResult.status === 'INVESTIGATION' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              statusResult.status === 'CLOSED' ? 'bg-green-50 border-green-200 text-green-800' :
              'bg-slate-50 border-slate-200'
            }`}>
              {statusResult.status === 'CLOSED' ? <CheckCircle className="w-6 h-6" /> : 
               statusResult.status === 'INVESTIGATION' ? <ShieldAlert className="w-6 h-6" /> :
               <Clock className="w-6 h-6" />}
              
              <div>
                <p className="font-bold text-lg">{statusResult.status}</p>
                <p className="text-xs opacity-75">Updated just now</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 underline">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}