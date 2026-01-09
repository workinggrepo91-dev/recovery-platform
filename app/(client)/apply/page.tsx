// app/(client)/apply/page.tsx
'use client';

import { createCase } from '@/app/actions'; // Import the server action
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useTransition } from 'react'; // Hook to handle loading state

export default function ApplyPage() {
  const [isPending, startTransition] = useTransition();

  // This wrapper function handles the form submission
  async function handleSubmit(formData: FormData) {
    startTransition(() => {
       createCase(formData); // Calls the backend function
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Start Recovery Case</h1>
          <p className="mt-2 text-slate-600">
            Please provide accurate details. Our forensic team will analyze the blockchain trail.
          </p>
        </div>

        {/* The Form points to our Server Action */}
        <form action={handleSubmit} className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          
          {/* Section 1: Asset Details */}
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" />
              Incident Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Type</label>
                <select name="assetType" required className="w-full rounded-md border border-slate-300 p-2.5 bg-white text-slate-900">
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="BANK">Bank Wire / Fiat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount Lost (Approx. USD)</label>
                <input type="number" name="amountLost" placeholder="5000" required className="w-full rounded-md border border-slate-300 p-2 text-slate-900" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Incident</label>
                <input type="date" name="incidentDate" required className="w-full rounded-md border border-slate-300 p-2 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Section 2: Forensic Data */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              Forensic Evidence
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Hash / TXID</label>
                <input type="text" name="transactionTx" placeholder="0x..." className="w-full rounded-md border border-slate-300 p-2 text-slate-900 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Scammer's Wallet Address</label>
                <input type="text" name="scammerAddress" placeholder="bc1q..." className="w-full rounded-md border border-slate-300 p-2 text-slate-900 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" rows={4} className="w-full rounded-md border border-slate-300 p-2 text-slate-900"></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-8 bg-slate-50 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition disabled:opacity-50 flex items-center"
            >
              {isPending ? 'Processing...' : 'Submit Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}