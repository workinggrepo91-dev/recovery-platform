// app/actions.ts
'use server';

import { prisma } from '@/lib/db'; // 👈 Use the safe singleton import
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- CASE SUBMISSION ---
export async function createCase(formData: FormData) {
  const rawData = {
    assetType: formData.get('assetType') as string,
    amountLost: formData.get('amountLost') as string,
    transactionTx: formData.get('transactionTx') as string,
    scammerAddress: formData.get('scammerAddress') as string,
    description: formData.get('description') as string,
    incidentDate: new Date(formData.get('incidentDate') as string || new Date().toISOString()),
  };

  try {
    await prisma.case.create({
      data: {
        assetType: rawData.assetType,
        amountLost: rawData.amountLost,
        transactionTx: rawData.transactionTx,
        scammerAddress: rawData.scammerAddress,
        description: rawData.description,
        incidentDate: rawData.incidentDate,
        status: "SUBMITTED",
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error('Failed to create case');
  }

  redirect('/track?success=true');
}

// --- UPDATE STATUS ---
export async function updateCaseStatus(caseId: string, newStatus: string) {
  try {
    await prisma.case.update({
      where: { id: caseId },
      data: { status: newStatus },
    });
    
    revalidatePath('/admin/cases/[id]'); 
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// --- PUBLIC TRACKING ---
export async function getCaseStatus(caseId: string) {
  try {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { 
        status: true, 
        assetType: true,
        incidentDate: true 
      }
    });

    if (!caseData) return { error: "Case not found" };
    return { success: true, data: caseData };
  } catch (error) {
    return { error: "Failed to fetch status" };
  }
}

// --- ADMIN AUTH ---
export async function loginAdmin(email: string, pass: string) {
  if (
    email === process.env.ADMIN_EMAIL && 
    pass === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 
    });
    return { success: true };
  }
  return { success: false };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}