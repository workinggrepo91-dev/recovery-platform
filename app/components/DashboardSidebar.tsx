// app/components/DashboardSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutClient, ClientSession } from '@/app/actions/clientAuth';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Activity, 
  Clock, 
  MessageSquare, 
  FolderClosed, 
  CreditCard, 
  User, 
  LogOut, 
  ShieldAlert, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  user: ClientSession;
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navItemsOverview = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: '1', badgeColor: 'bg-green-500 text-white' },
  ];

  const navItemsCases = [
    { name: 'New Case', href: '/apply', icon: PlusCircle, iconColor: 'text-blue-500' },
    { name: 'Track Case', href: '/dashboard', icon: Activity },
    { name: 'Case Timeline', href: '/dashboard#timeline', icon: Clock },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 'Live Chat', badgeColor: 'bg-blue-100 text-blue-700 font-semibold text-[10px]' },
    { name: 'Documents', href: '/dashboard#documents', icon: FolderClosed },
    { name: 'Payments', href: '/dashboard#payments', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 flex-shrink-0 z-40 select-none shadow-sm">
      
      {/* Brand & Client Dashboard Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="relative w-9 h-9 flex-shrink-0">
          <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
        </div>
        <div>
          <span className="block font-extrabold text-slate-900 text-sm tracking-tight uppercase">GDFAS</span>
          <span className="block text-[11px] font-bold text-slate-400 tracking-widest uppercase">Client Dashboard</span>
        </div>
      </div>

      {/* User Profile Card (Matches Screenshot exact layout) */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs transition hover:bg-slate-100/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-600/20">
            {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-slate-900 text-sm truncate">{user?.fullName || 'Client'}</p>
            <p className="text-[11px] text-slate-500 truncate font-mono">{user?.email}</p>
          </div>
        </div>

        {/* Verification Status Badge */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
          {user?.isVerified ? (
            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-md font-semibold border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold border border-amber-200/80">
              <ShieldAlert className="w-3.5 h-3.5" /> Unverified
            </span>
          )}
          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider flex items-center gap-0.5 hover:underline cursor-pointer" onClick={() => alert("Verification link dispatched to your email address!")}>
            Verify <ChevronRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Navigation Links Scroll area */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-6">
        
        {/* OVERVIEW */}
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
            Overview
          </p>
          <ul className="space-y-1">
            {navItemsOverview.map((item) => {
              const active = pathname === item.href && pathname !== '/dashboard/messages';
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CASE MANAGEMENT */}
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
            Case Management
          </p>
          <ul className="space-y-1">
            {navItemsCases.map((item) => {
              const active = pathname === item.href || (item.href === '/dashboard/messages' && pathname.startsWith('/dashboard/messages'));
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/70 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${active ? 'text-blue-600' : item.iconColor || 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ACCOUNT */}
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
            Account & Support
          </p>
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard#settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                <User className="w-4 h-4 text-slate-500" />
                <span>Account Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => logoutClient()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Help box */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>GDFAS v2.4 (Encrypted)</span>
        <span className="flex items-center gap-1 font-bold text-green-600">
          <Sparkles className="w-3 h-3" /> Online
        </span>
      </div>
    </aside>
  );
}
