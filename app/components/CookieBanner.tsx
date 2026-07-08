// app/components/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none">
      <div className="mx-auto max-w-4xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-6 pointer-events-auto flex flex-col sm:flex-row items-center gap-6 justify-between animate-in slide-in-from-bottom-10">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full hidden sm:block">
            <Cookie className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-200 text-sm leading-relaxed">
              We use cookies and similar technologies to enhance your experience, ensure security, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as described in our{' '}
              <Link href="/privacy" className="text-blue-400 hover:underline font-medium">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={handleAccept}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition"
          >
            Accept All
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}