// app/admin/clients/[id]/page.tsx
import React from 'react';
import { getAdminClientProfile } from '@/app/actions/adminActions';
import AdminClientProfileHub from './AdminClientProfileHub';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ caseId?: string }> | { caseId?: string };
}

export default async function ClientProfilePage({ params, searchParams }: ProfilePageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams || {});

  const clientProfile = await getAdminClientProfile(resolvedParams.id);
  const targetCaseId = resolvedSearch.caseId || null;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-10">
      <AdminClientProfileHub initialClient={clientProfile} initialCaseId={targetCaseId} />
    </div>
  );
}
