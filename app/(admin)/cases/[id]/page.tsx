import Link from 'next/link';
import { ArrowLeft, User, Calendar } from 'lucide-react';

export default async function CaseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/Admin/dashboard" 
          className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Case #{id}</h1>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                New Submission
              </span>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>Status: Pending Review</p>
            </div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Incident Description</h3>
              <p className="text-slate-500 italic">No description provided yet.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Client Info</h3>
              <div className="flex items-center text-slate-600 mb-3">
                <User className="w-4 h-4 mr-2" />
                <span>Unknown User</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Date: Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}