// app/(client)/dashboard/verify/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentClient, submitClientKYCDocuments } from '@/app/actions/clientAuth';
import { 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Camera, 
  CreditCard, 
  FolderPlus, 
  Lock, 
  Loader2, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function KYCVerifyPage() {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Document state (filename tracking)
  const [govId, setGovId] = useState<string>('');
  const [proofOfPayment, setProofOfPayment] = useState<string>('');
  const [selfie, setSelfie] = useState<string>('');
  const [otherDoc, setOtherDoc] = useState<string>('');

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const user = await getCurrentClient();
      setClient(user || { email: 'client@recovery.com', isVerified: false, verificationStatus: 'UNVERIFIED' });
      
      if (user?.govIdDoc) setGovId(user.govIdDoc);
      if (user?.proofOfPaymentDoc) setProofOfPayment(user.proofOfPaymentDoc);
      if (user?.selfieDoc) setSelfie(user.selfieDoc);
      if (user?.otherDoc) setOtherDoc(user.otherDoc);
      
      setLoading(false);
    }
    loadUser();
  }, []);

  function getDocDisplayName(val?: string) {
    if (!val) return '';
    try {
      const parsed = JSON.parse(val);
      if (parsed && parsed.name) return parsed.name;
    } catch (e) {}
    return val.length > 50 ? 'Uploaded_Document.pdf' : val;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, setFile: (val: string) => void) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("File exceeds maximum allowance (15MB). Please compress or choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const payload = JSON.stringify({
        name: file.name,
        type: file.type,
        dataUrl: reader.result
      });
      setFile(payload);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!govId || !proofOfPayment || !selfie) {
      setError('Please upload your Government ID, Proof of Payment, and Selfie photo to continue.');
      return;
    }

    setSubmitting(true);
    const res = await submitClientKYCDocuments({
      email: client?.email || '',
      govIdDoc: govId,
      proofOfPaymentDoc: proofOfPayment,
      selfieDoc: selfie,
      otherDoc: otherDoc || undefined
    });

    if (res && res.success) {
      setSuccessMessage(res.message || 'Documents submitted successfully!');
      setClient((prev: any) => ({ ...prev, verificationStatus: 'SUBMITTED' }));
    } else {
      setError(res?.error || 'Transmission failed. Please verify your connection and try again.');
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-slate-400 gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-blue-600" />
        <p className="font-extrabold text-sm tracking-wide">Loading encrypted verification vault...</p>
      </div>
    );
  }

  const isApproved = client?.isVerified || client?.verificationStatus === 'VERIFIED';
  const isPending = !isApproved && client?.verificationStatus === 'SUBMITTED';
  const isRejected = client?.verificationStatus === 'REJECTED';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 min-h-[85vh]">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Regulatory KYC Compliance & Asset Authentication
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Identity Verification Portal
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            To prevent illicit withdrawals and satisfy international anti-money laundering (AML) protocols, Global Digital Forensic Asset Services (GDFAS) requires verifiable Proof of Identity before finalizing fund disbursement or authoring binding legal affidavits.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase">Current Account Status:</span>
            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Verified & Approved
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl font-extrabold text-xs">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                Submitted — Pending Admin Review
              </span>
            ) : isRejected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Rejected — Re-submission Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-extrabold text-xs">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Unverified (Action Required)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* STATE 1: ALREADY APPROVED */}
      {isApproved && (
        <div className="bg-white rounded-3xl border border-green-200 p-8 text-center space-y-5 max-w-2xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
            🎉
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Account is Fully Verified!</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Congratulations! Your identity documents and payment records have been rigorously inspected and approved by GDFAS compliance directors. Your wallet recovery channel is unlocked and ready for escrow asset releases.
          </p>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-lg transition">
              Return to Recovery Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* STATE 2: SUBMITTED AND PENDING REVIEW */}
      {isPending && !successMessage && (
        <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center space-y-5 max-w-2xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Verification Under Administrative Review</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Your verification documents (<b className="text-slate-900">Gov ID, Payment Proof, & Live Selfie</b>) are safely stored in our encrypted compliance vault. A senior administrator is currently auditing your submission. You will be notified the moment verification is approved.
          </p>
          
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-700 font-mono">
            <p><strong>Government ID:</strong> {getDocDisplayName(govId) || "Uploaded"}</p>
            <p><strong>Proof of Payment:</strong> {getDocDisplayName(proofOfPayment) || "Uploaded"}</p>
            <p><strong>Selfie Photo:</strong> {getDocDisplayName(selfie) || "Uploaded"}</p>
            {otherDoc && <p><strong>Supporting Doc:</strong> {getDocDisplayName(otherDoc)}</p>}
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <button 
              onClick={() => setClient((prev: any) => ({ ...prev, verificationStatus: 'UNVERIFIED' }))} 
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 underline"
            >
              Replace / Update Documents
            </button>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-md transition">
              Return to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* STATE 3: UPLOAD FORM (UNVERIFIED OR REJECTED OR RESUBMITTING) */}
      {!isApproved && (!isPending || successMessage || client?.verificationStatus === 'UNVERIFIED' || isRejected) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Submit Verification Portfolio</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Please provide clear, high-resolution documentation for all three mandatory regulatory criteria below.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-bold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-5 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-sm font-bold flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="space-y-1">
                <p>{successMessage}</p>
                <Link href="/dashboard" className="text-xs text-blue-700 underline font-extrabold block">
                  Click here to return to your dashboard overview &rarr;
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* DOCUMENT 1: GOV ISSUED ID */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition flex flex-col justify-between group relative">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">1. Government-Issued ID *</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload an unexpired Passport, National ID Card, or Driver's License showing your legally recognized full name and date of birth.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <label className="cursor-pointer block w-full">
                  <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, setGovId)} />
                  <div className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                    govId ? 'bg-green-50 border-green-300 text-green-800 shadow-xs' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}>
                    {govId ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-blue-600" />}
                    <span className="truncate max-w-[200px]">{govId ? `Selected: ${getDocDisplayName(govId)}` : 'Select Document File...'}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* DOCUMENT 2: PROOF OF PAYMENT */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition flex flex-col justify-between group relative">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">2. Proof of Payment *</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload wire transfer receipts, bank debit statements, exchange withdrawal confirmations, or blockchain TX hash records confirming fund origin.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <label className="cursor-pointer block w-full">
                  <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, setProofOfPayment)} />
                  <div className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                    proofOfPayment ? 'bg-green-50 border-green-300 text-green-800 shadow-xs' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}>
                    {proofOfPayment ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-indigo-600" />}
                    <span className="truncate max-w-[200px]">{proofOfPayment ? `Selected: ${getDocDisplayName(proofOfPayment)}` : 'Select Receipt / TX File...'}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* DOCUMENT 3: SELFIE HOLDING PHONE / ID */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition flex flex-col justify-between group relative">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">3. Selfie Holding Device / ID *</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Provide a clear liveness photo of yourself holding your mobile phone (displaying this platform or transaction logs) or holding your Government ID next to your face.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <label className="cursor-pointer block w-full">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, setSelfie)} />
                  <div className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                    selfie ? 'bg-green-50 border-green-300 text-green-800 shadow-xs' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}>
                    {selfie ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-purple-600" />}
                    <span className="truncate max-w-[200px]">{selfie ? `Selected: ${getDocDisplayName(selfie)}` : 'Upload Live Selfie Photo...'}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* DOCUMENT 4: OTHER SUPPORTING DOCS */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/30 hover:bg-slate-50 transition flex flex-col justify-between group relative">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">4. Other Supporting Documents</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">Optional</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Attach supplementary evidentiary materials: law enforcement crime incident reports, communication logs with perpetrators, or affidavit drafts.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <label className="cursor-pointer block w-full">
                  <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, setOtherDoc)} />
                  <div className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                    otherDoc ? 'bg-green-50 border-green-300 text-green-800 shadow-xs' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}>
                    {otherDoc ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <UploadCloud className="w-4 h-4 text-slate-600" />}
                    <span className="truncate max-w-[200px]">{otherDoc ? `Selected: ${getDocDisplayName(otherDoc)}` : 'Attach Optional Files...'}</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Security & Submission Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold max-w-sm">
              <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>All files are securely protected by 256-bit AES encryption and accessible exclusively by certified GDFAS legal auditors.</span>
            </div>

            <button
              type="submit"
              disabled={submitting || !govId || !proofOfPayment || !selfie}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Encrypting & Transmitting Docs...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-blue-200" />
                  <span>Transmit for Admin Verification</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
