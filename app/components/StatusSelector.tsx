// app/components/StatusSelector.tsx
'use client';

import { useState } from 'react';
import { updateCaseStatus } from '@/app/actions';
import { Loader2 } from 'lucide-react';

export default function StatusSelector({ 
  caseId, 
  currentStatus 
}: { 
  caseId: string, 
  currentStatus: string 
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setIsUpdating(true);
    setStatus(newStatus); // Optimistic UI update

    // Call the server action
    await updateCaseStatus(caseId, newStatus);
    
    setIsUpdating(false);
  }

  return (
    <div className="flex items-center gap-3">
      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
      
      <select 
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`
          px-4 py-2 rounded-lg font-medium border-none outline-none cursor-pointer transition
          ${status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${status === 'INVESTIGATION' ? 'bg-blue-100 text-blue-800' : ''}
          ${status === 'RECOVERY' ? 'bg-purple-100 text-purple-800' : ''}
          ${status === 'CLOSED' ? 'bg-green-100 text-green-800' : ''}
        `}
      >
        <option value="SUBMITTED">SUBMITTED</option>
        <option value="TRIAGE">TRIAGE</option>
        <option value="INVESTIGATION">INVESTIGATION</option>
        <option value="RECOVERY">RECOVERY</option>
        <option value="CLOSED">CLOSED</option>
      </select>
    </div>
  );
}