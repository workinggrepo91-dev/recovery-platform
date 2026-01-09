// app/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

// Prevent multiple instances of Prisma in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function createCase(formData: FormData) {
  // 1. Extract data from the form
  const rawData = {
    assetType: formData.get('assetType') as string,
    amountLost: formData.get('amountLost') as string,
    transactionTx: formData.get('transactionTx') as string,
    scammerAddress: formData.get('scammerAddress') as string,
    description: formData.get('description') as string,
    incidentDate: new Date(formData.get('incidentDate') as string || new Date().toISOString()),
  };

  console.log("Saving Case to DB:", rawData);

  // 2. Save to Database
  try {
    const newCase = await prisma.case.create({
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

    console.log("Success! Case ID:", newCase.id);
    
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error('Failed to create case');
  }

  // 3. Redirect user to the "Tracking" page (or success page)
  // We will create this page next.
  redirect('/track?success=true');
}

// Add this to the bottom of app/actions.ts

import { revalidatePath } from 'next/cache';

export async function updateCaseStatus(caseId: string, newStatus: string) {
  try {
    await prisma.case.update({
      where: { id: caseId },
      data: { status: newStatus },
    });
    
    // This tells Next.js to refresh the dashboard data immediately
    revalidatePath('/admin/cases/[id]'); 
    revalidatePath('/admin/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false };
  }
}

// Add this to the bottom of app/actions.ts

export async function getCaseStatus(caseId: string) {
  try {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { 
        status: true, 
        assetType: true,
        incidentDate: true 
      } // Only select safe public data
    });

    if (!caseData) return { error: "Case not found" };
    
    return { success: true, data: caseData };
  } catch (error) {
    return { error: "Failed to fetch status" };
  }
}

// Add to app/actions.ts
import { cookies } from 'next/headers';

export async function loginAdmin(email: string, pass: string) {
  // Check against env variables
  if (
    email === process.env.ADMIN_EMAIL && 
    pass === process.env.ADMIN_PASSWORD
  ) {
    // Set a cookie that expires in 1 day
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

// Add a Logout function too
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}