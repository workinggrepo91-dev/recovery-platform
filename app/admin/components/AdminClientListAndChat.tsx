// app/admin/components/AdminClientListAndChat.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getUserMessages, sendUserMessage, ChatMessage } from '@/app/actions/chatActions';
import { 
  User, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  X, 
  Loader2, 
  Clock, 
  Sparkles,
  Lock,
  AlertTriangle,
  ShieldAlert,
  Ban,
  RefreshCw
} from 'lucide-react';

interface ClientRecord {
  id: string;
  email: string;
  fullName: string | null;
  authProvider: string;
  isVerified: boolean;
  verificationStatus?: string;
  govIdDoc?: string | null;
  proofOfPaymentDoc?: string | null;
  selfieDoc?: string | null;
  otherDoc?: string | null;
  balance: string;
  cases: any[];
  createdAt: string;
  hasNewMessage?: boolean;
  lastMessageSnippet?: string | null;
}

export default function AdminClientListAndChat({ initialUsers }: { initialUsers: ClientRecord[] }) {
  const [users, setUsers] = useState<ClientRecord[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<ClientRecord | null>(null);
  
  // Modal state for direct live chat popup
  const [chatOpen, setChatOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    if (chatOpen && selectedUser) {
      loadUserThread(selectedUser.email);
    }
  }, [chatOpen, selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingChat]);

  async function loadUserThread(email: string) {
    setLoadingChat(true);
    const msgs = await getUserMessages(email);
    setMessages(msgs);
    setLoadingChat(false);
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || sending || !selectedUser) return;

    const text = replyText.trim();
    setReplyText('');
    setSending(true);

    const res = await sendUserMessage(
      selectedUser.email,
      'James Thornton (Senior Director)',
      'AGENT',
      text
    );

    if (res.success && res.message) {
      setMessages(prev => [...prev, res.message]);
    }
    setSending(false);
  }

  function openChatModal(user: ClientRecord) {
    setSelectedUser(user);
    setChatOpen(true);
    // Automatically clear new message notification badge once opened
    if (user.hasNewMessage) {
      setUsers(prev => prev.map(item => item.id === user.id || item.email === user.email ? { ...item, hasNewMessage: false } : item));
    }
  }

  return (
    <div id="clients-suite" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-10">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-600" />
            Registered Clients & Workspace Profiles
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage registered accounts, open master profile dashboards, or initiate direct 1-on-1 encrypted support chats.
          </p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs px-3.5 py-1 rounded-full font-black flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          {users.length} Registered Accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Identity & Email</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Auth Provider</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cases Filed</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Admin Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                  No registered users found yet. As clients register with Gmail or manual signups, their profiles will appear here immediately!
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isGmail = u.authProvider === 'GMAIL' || u.email.endsWith('@gmail.com');
                const isLegacy = u.authProvider === 'LEGACY' || u.authProvider === 'LEGACY_CLAIM';
                const caseCount = u.cases?.length || 0;
                const isVerified = u.isVerified || u.verificationStatus === 'VERIFIED';
                const isSubmitted = !isVerified && u.verificationStatus === 'SUBMITTED';
                const isRejected = u.verificationStatus === 'REJECTED';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition group">
                    
                    {/* Full Name & Email Combo */}
                    <td className="p-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition transform flex-shrink-0">
                          {(u.fullName || u.email)[0].toUpperCase()}
                        </div>
                        <div className="space-y-1 min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-none">
                              {u.fullName || 'Verified Client'}
                            </p>
                            {u.hasNewMessage && (
                              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm animate-pulse flex-shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                💬 NEW MESSAGE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                            <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="truncate max-w-xs font-medium">{u.email}</span>
                          </div>
                          {u.hasNewMessage && u.lastMessageSnippet && (
                            <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200/60 font-semibold px-2 py-1 rounded-lg truncate max-w-xs block shadow-2xs">
                              &ldquo;{u.lastMessageSnippet}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Auth Provider */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider border shadow-xs ${
                        isGmail 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : isLegacy
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {isGmail ? '🟢 Gmail OAuth' : isLegacy ? '⚡ Legacy Claim' : '🔵 Manual Signup'}
                      </span>
                    </td>

                    {/* Cases Filed */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full border shadow-xs ${
                        caseCount > 0 ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {caseCount} {caseCount === 1 ? 'Claim' : 'Claims'}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="p-4">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                          Verified & Approved
                        </span>
                      ) : isSubmitted ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-xs animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                          Pending KYC Review
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                          <Ban className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                          Rejected Docs
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          <ShieldAlert className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Admin Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2.5">
                        
                        <Link
                          href={`/admin/clients/${u.id || u.email}`}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow-md hover:shadow-lg inline-flex items-center gap-1.5 transform active:scale-95"
                        >
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          <span>Full Profile</span>
                        </Link>

                        <button
                          onClick={() => openChatModal(u)}
                          className={`px-4 py-2.5 font-extrabold text-xs rounded-xl transition shadow-md hover:shadow-lg inline-flex items-center gap-1.5 transform active:scale-95 ${
                            u.hasNewMessage
                              ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-rose-500/30 ring-2 ring-rose-300 animate-bounce-subtle'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{u.hasNewMessage ? 'Reply Now 🔴' : 'Chat &rarr;'}</span>
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* LIVE CLIENT CHAT MODAL */}
      {chatOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl h-[600px] flex flex-col overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {(selectedUser.fullName || selectedUser.email)[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg tracking-tight">
                    Chat with {selectedUser.fullName || 'Client'}
                  </h3>
                  <p className="text-xs text-blue-400 font-mono">
                    {selectedUser.email} • {selectedUser.cases?.length || 0} Case(s) Filed
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setChatOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                title="Close Chat Panel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50">
              {loadingChat ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-xs font-extrabold uppercase tracking-wider">Loading End-to-End Client Conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                  <MessageSquare className="w-12 h-12 text-slate-300" />
                  <p className="text-sm font-extrabold text-slate-700">No message history with this account yet.</p>
                  <p className="text-xs text-slate-500">Send an introduction below to engage this user directly!</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isAdmin = m.senderRole === 'AGENT';
                  const dateStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={m.id} className={`flex gap-3 max-w-lg ${isAdmin ? 'justify-end ml-auto' : 'justify-start'}`}>
                      {!isAdmin && (
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center mt-1 flex-shrink-0">
                          {m.senderName[0]}
                        </div>
                      )}

                      <div className={`space-y-1 ${isAdmin ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-1.5 px-1 text-[10px] text-slate-400 font-bold">
                          <span>{m.senderName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-2 h-2" /> {dateStr}</span>
                        </div>

                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                          isAdmin 
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Admin Message Reply Bar */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official admin reply as James Thornton (Senior Director)..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className="px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Reply
                </button>
              </form>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold mt-2.5">
                <Lock className="w-3 h-3 text-blue-500" />
                <span>Replies instantly transmit to client portal at <b className="text-slate-600">/dashboard/messages</b></span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
