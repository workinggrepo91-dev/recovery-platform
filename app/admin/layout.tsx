import Link from "next/link";
import { Shield, LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg">ForensicsOS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/cases" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <FileText className="w-5 h-5" />
            All Cases
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <form action={async () => {
            'use server';
            // Import these at the top if needed, or just use dynamic import for simplicity
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}