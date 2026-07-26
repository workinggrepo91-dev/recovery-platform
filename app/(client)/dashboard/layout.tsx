// app/(client)/dashboard/layout.tsx
import React from 'react';
import { getCurrentClient, ClientSession } from '@/app/actions/clientAuth';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, MessageSquare, Shield, Globe } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Fetch current client session and cases from cookie & DB
  const user = await getCurrentClient() || {
    id: 'demo-client',
    email: 'client@gmail.com',
    fullName: 'James Thornton',
    authProvider: 'GMAIL',
    isVerified: false,
    twoFactor: false,
    balance: '$0.00',
    recovered: '$0.00',
  } as ClientSession;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar user={user as any} />
      </div>

      {/* Mobile Top Header Navigation */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="GDFAS" fill className="object-contain" priority />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-sm">GDFAS PORTAL</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 flex items-center gap-1.5 text-xs font-bold"
          >
            <Globe className="w-4 h-4" />
            <span>Website</span>
          </Link>
          <Link 
            href="/dashboard/messages" 
            className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 flex items-center gap-1.5 text-xs font-bold"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </Link>
          <Link href="/login" className="p-2 bg-slate-900 text-white rounded-lg text-xs font-bold">
            Sign Out
          </Link>
        </div>
      </div>

      {/* Main Content Pane */}
      <main className="flex-1 min-h-screen overflow-x-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
