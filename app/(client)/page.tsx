// app/(client)/page.tsx
import Link from 'next/link';
import { ShieldAlert, Search, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <header className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Digital Asset Recovery & Forensics
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Professional blockchain analysis and chain-of-custody tracking for victims of digital fraud.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/apply" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Start New Case
            </Link>
            <Link 
              href="/track" 
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold border border-slate-700 transition"
            >
              Track Status
            </Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <FileText className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">1. Submit Evidence</h3>
          <p className="text-slate-600">Securely submit TXIDs, wallet addresses, and incident details to our forensic vault.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <Search className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">2. Forensic Trace</h3>
          <p className="text-slate-600">Our investigators map the flow of funds across blockchains to identify destination exchanges.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <ShieldAlert className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">3. Recovery Action</h3>
          <p className="text-slate-600">We generate court-admissible reports and liaise with law enforcement and exchanges.</p>
        </div>
      </section>
    </div>
  );
}