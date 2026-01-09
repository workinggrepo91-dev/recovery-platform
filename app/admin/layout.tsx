// app/admin/layout.tsx
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { LayoutDashboard, FileText, Settings, LogOut, Shield } from 'lucide-react';
import { logoutAdmin } from '@/app/actions';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-xl z-50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* ✅ NEW: Your Logo */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="GDF Logo" 
                fill 
                className="object-contain"
              />
            </div>
            
            {/* ✅ NEW: Organization Name */}
            <div className="leading-tight">
              <span className="block text-sm font-bold text-white tracking-tight">
                Global Digital
              </span>
              <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Forensic Assets
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/cases" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <FileText className="w-5 h-5" />
            Case Files
          </Link>
          <div className="px-4 py-3 text-slate-500 cursor-not-allowed flex items-center gap-3">
            <Settings className="w-5 h-5" />
            Settings
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={async () => {
            'use server';
            const { logoutAdmin } = await import('@/app/actions'); 
            const { redirect } = await import('next/navigation');
            await logoutAdmin();
            redirect('/admin/login');
          }}>
            <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 w-full rounded-lg transition">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}