// app/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- CASE SUBMISSION ---
export async function createCase(formData: FormData) {
  const rawData = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    country: formData.get('country') as string,
    dateOfBirth: formData.get('dateOfBirth') as string,
    amountLost: formData.get('amountLost') as string,
    timesVictim: formData.get('timesVictim') as string,
    awareOfScam: formData.get('awareOfScam') as string,
    paymentMethod: formData.get('paymentMethod') as string,
    lossYear: formData.get('lossYear') as string,
    recoveryAttempts: formData.get('recoveryAttempts') as string,
    scammerName: formData.get('scammerName') as string,
    description: formData.get('description') as string,
  };

  let newCase;

  try {
    newCase = await prisma.case.create({
      data: {
        fullName: rawData.fullName,
        email: rawData.email,
        phone: rawData.phone,
        country: rawData.country,
        dateOfBirth: rawData.dateOfBirth,
        amountLost: rawData.amountLost,
        timesVictim: rawData.timesVictim,
        awareOfScam: rawData.awareOfScam,
        paymentMethod: rawData.paymentMethod,
        lossYear: rawData.lossYear,
        recoveryAttempts: rawData.recoveryAttempts,
        scammerName: rawData.scammerName,
        description: rawData.description,
        status: "SUBMITTED",
        // Legacy fields mapping
        assetType: "N/A", 
        transactionTx: "N/A",
        scammerAddress: "N/A",
        incidentDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error('Failed to create case');
  }

  // Redirect to success page
  redirect(`/success?id=${newCase.id}`); 
}

// --- UPDATE STATUS (This was the missing export!) ---
export async function updateCaseStatus(caseId: string, newStatus: string) {
  try {
    await prisma.case.update({
      where: { id: caseId },
      data: { status: newStatus },
    });
    
    revalidatePath(`/admin/cases/${caseId}`); 
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/cases');
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