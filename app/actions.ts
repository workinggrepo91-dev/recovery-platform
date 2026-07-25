// app/actions.ts
'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- CASE SUBMISSION WITH CLIENT SESSION LINKAGE ---
export async function createCase(formData: FormData) {
  const rawData = {
    fullName: formData.get('fullName') as string,
    email: (formData.get('email') as string).toLowerCase().trim(),
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

  // Check if user is actively logged in via client_session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('client_session');
  let loggedInUserId: string | null = null;
  let isLoggedIn = false;

  if (sessionCookie && sessionCookie.value) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (sessionData && sessionData.id) {
        loggedInUserId = sessionData.id;
        isLoggedIn = true;
      }
    } catch (e) {
      // Ignore session JSON parse error
    }
  }

  // Also check if an account exists with this email if not explicitly linked yet
  if (!loggedInUserId) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: rawData.email } });
      if (existingUser) {
        loggedInUserId = existingUser.id;
      }
    } catch (e) {}
  }

  // Generate unique forensic case reference ID
  const randomAlpha = Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const caseRef = `RE-${randomAlpha}${randomNum}`;

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
        // Enhanced Client and Admin linkage fields
        userId: loggedInUserId,
        caseReference: caseRef,
        disputedAmount: rawData.amountLost,
        recoveredAmount: "$0.00",
        progressStep: "SUBMITTED",
        assignedAgent: "James Thornton",
        agentTitle: "Senior Crypto Recovery Specialist",
        priority: "high",
        legalStatus: "Pending Assessment",
        // Legacy fields mapping
        assetType: rawData.paymentMethod || "N/A", 
        transactionTx: "N/A",
        scammerAddress: rawData.scammerName || "N/A",
        incidentDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Error on Create Case:", error);
    // If external DB offline, proceed cleanly so client experiences uninterrupted submission flow
  }

  revalidatePath('/dashboard');
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/cases');

  // If user is actively logged into their dashboard, return straight to dashboard to view their new case!
  if (isLoggedIn) {
    redirect('/dashboard?submitted=true');
  } else {
    redirect(`/success?id=${newCase?.id || caseRef}`); 
  }
}

// --- UPDATE STATUS ---
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
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid admin credentials' };
}

// --- ADMIN LOGOUT ---
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}