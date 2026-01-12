// app/(client)/apply/page.tsx
import { Shield, Lock, FileText, User } from 'lucide-react';
import { createCase } from '@/app/actions';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Official Recovery Application</h1>
          <p className="text-slate-600 mt-2">Submit your details for official assessment by our forensic team.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            <span className="text-slate-200 text-sm font-medium">Secure SSL Encrypted Connection</span>
          </div>

          <form action={createCase} className="p-8 space-y-8">
            
            {/* Section 1: Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-800 mb-2">Full Name</label>
                  <input type="text" name="fullName" required placeholder="e.g. Amanullah Khan" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Email Address</label>
                  <input type="email" name="email" required placeholder="name@example.com" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Phone Number</label>
                  <input type="text" name="phone" required placeholder="+91 9906..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Country</label>
                  <input type="text" name="country" required placeholder="e.g. India" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Date of Birth</label>
                  <input type="date" name="dateOfBirth" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium bg-white" />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section 2: Case Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                Case Questionnaire
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">
                    State the total amount of money you have lost
                  </label>
                  <input type="text" name="amountLost" required placeholder="e.g. 6.10 Lac" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      How many times have you been a victim?
                    </label>
                    <input type="number" name="timesVictim" required placeholder="e.g. 3" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">
                      Are you aware it was a scam?
                    </label>
                    <select name="awareOfScam" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium bg-white">
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Payment Method Used
                    </label>
                    <select name="paymentMethod" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium bg-white">
                      <option value="BANK TRANSFER">BANK TRANSFER</option>
                      <option value="CRYPTOCURRENCY">CRYPTOCURRENCY</option>
                      <option value="CREDIT CARD">CREDIT CARD</option>
                      <option value="CASH APP / UPI">UPI / WALLET</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      In what year did you lose funds?
                    </label>
                    <input type="text" name="lossYear" required placeholder="e.g. 2020" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Have you recovered any money so far? (If yes, state how much)
                  </label>
                  <input type="text" name="recoveryAttempts" required placeholder="e.g. No" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Name of Individual / Agent / Company you lost funds to
                  </label>
                  <input type="text" name="scammerName" required placeholder="e.g. Delhi Platform" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Brief Description of how the scam occurred
                  </label>
                  <textarea name="description" required rows={4} placeholder="Via message..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium bg-white"></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                Submit Official Claim
              </button>
              <p className="text-center text-slate-500 text-xs mt-4">
                By submitting this form, you certify that the information provided is accurate and agree to our investigation terms.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}