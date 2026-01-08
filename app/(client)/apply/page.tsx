// app/(client)/apply/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation for now
    setTimeout(() => {
      alert("Application Simulated!");
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Start Recovery Case</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden p-8">
            {/* Asset Details */}
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Incident Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Type</label>
                <select name="assetType" className="w-full border border-slate-300 rounded p-2 text-slate-900">
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount Lost (USD)</label>
                <input type="number" name="amountLost" required className="w-full border border-slate-300 rounded p-2 text-slate-900" />
              </div>
            </div>

            {/* Evidence */}
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Forensic Evidence</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Hash (TXID)</label>
                <input type="text" name="transactionTx" className="w-full border border-slate-300 rounded p-2 text-slate-900 font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" rows={3} className="w-full border border-slate-300 rounded p-2 text-slate-900"></textarea>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700">
              {isSubmitting ? 'Submitting...' : 'Submit Case'}
            </button>
        </form>
      </div>
    </div>
  );
}