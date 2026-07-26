// app/actions/chatActions.ts
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface ChatMessage {
  id: string;
  caseId?: string;
  userEmail?: string;
  senderName: string;
  senderRole: 'USER' | 'AGENT';
  content: string;
  createdAt: string;
}

// In-memory fallback message storage if postgres is offline during testing
const memoryCaseMessages: Record<string, ChatMessage[]> = {};
const memoryUserMessages: Record<string, ChatMessage[]> = {};

// --- FETCH MESSAGES BY USER EMAIL (FOR PRE-SUBMISSION / GENERAL ACCOUNT CHAT) ---
export async function getUserMessages(emailInput: string): Promise<ChatMessage[]> {
  const email = emailInput ? emailInput.toLowerCase().trim() : 'guest@recovery.com';
  const defaultUserWelcome: ChatMessage = {
    id: 'welcome-user-' + email,
    userEmail: email,
    senderName: 'James Thornton',
    senderRole: 'AGENT',
    content: 'Hello! I am James Thornton, Senior Asset Recovery Director at GDFAS. This is your personal encrypted communication channel. You can message our forensic division directly here at any time, even before submitting your official recovery case file!',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  };

  try {
    const dbMessages = await prisma.message.findMany({
      where: {
        OR: [
          { userEmail: email },
          { user: { email: email } }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    if (dbMessages.length === 0) {
      let userRecord = await prisma.user.findUnique({ where: { email } });
      await prisma.message.create({
        data: {
          userEmail: email,
          userId: userRecord?.id || null,
          senderName: defaultUserWelcome.senderName,
          senderRole: defaultUserWelcome.senderRole,
          content: defaultUserWelcome.content
        }
      });
      return [defaultUserWelcome];
    }

    return dbMessages.map(m => ({
      id: m.id,
      caseId: m.caseId || undefined,
      userEmail: m.userEmail || email,
      senderName: m.senderName,
      senderRole: m.senderRole as 'USER' | 'AGENT',
      content: m.content,
      createdAt: m.createdAt.toISOString()
    }));
  } catch (err) {
    if (!memoryUserMessages[email] || memoryUserMessages[email].length === 0) {
      memoryUserMessages[email] = [defaultUserWelcome];
    }
    return memoryUserMessages[email];
  }
}

// --- SEND MESSAGE BY USER EMAIL (CLIENT OR AGENT) ---
export async function sendUserMessage(
  emailInput: string,
  senderName: string,
  senderRole: 'USER' | 'AGENT',
  content: string
): Promise<{ success: boolean; message: ChatMessage }> {
  const email = emailInput ? emailInput.toLowerCase().trim() : 'guest@recovery.com';
  const newMsg: ChatMessage = {
    id: 'msg-usr-' + Date.now(),
    userEmail: email,
    senderName: senderName || (senderRole === 'AGENT' ? 'James Thornton' : 'Client'),
    senderRole: senderRole,
    content,
    createdAt: new Date().toISOString()
  };

  try {
    let userRecord = await prisma.user.findUnique({ where: { email } });
    const created = await prisma.message.create({
      data: {
        userEmail: email,
        userId: userRecord?.id || null,
        senderName: newMsg.senderName,
        senderRole: newMsg.senderRole,
        content: newMsg.content
      }
    });
    newMsg.id = created.id;
    newMsg.createdAt = created.createdAt.toISOString();
  } catch (err) {
    if (!memoryUserMessages[email]) memoryUserMessages[email] = [];
    memoryUserMessages[email].push(newMsg);
  }

  revalidatePath('/dashboard/messages');
  revalidatePath('/admin/dashboard');
  return { success: true, message: newMsg };
}

// --- FETCH MESSAGES FOR A CASE ---
export async function getCaseMessages(caseId: string): Promise<ChatMessage[]> {
  const defaultAgentWelcome: ChatMessage = {
    id: 'welcome-init-' + caseId,
    caseId,
    senderName: 'James Thornton',
    senderRole: 'AGENT',
    content: 'Hello! I am James Thornton, your senior crypto & asset recovery specialist at GDFAS. I have initiated forensic tracking on your claim and am currently examining exchange wallet logs and blockchain transaction paths. Please share any additional tx IDs or screenshots here if available!',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  };

  try {
    const dbMessages = await prisma.message.findMany({
      where: { caseId },
      orderBy: { createdAt: 'asc' }
    });

    if (dbMessages.length === 0) {
      await prisma.message.create({
        data: {
          caseId,
          senderName: defaultAgentWelcome.senderName,
          senderRole: defaultAgentWelcome.senderRole,
          content: defaultAgentWelcome.content
        }
      });
      return [defaultAgentWelcome];
    }

    return dbMessages.map(m => ({
      id: m.id,
      caseId: m.caseId || undefined,
      userEmail: m.userEmail || undefined,
      senderName: m.senderName,
      senderRole: m.senderRole as 'USER' | 'AGENT',
      content: m.content,
      createdAt: m.createdAt.toISOString()
    }));
  } catch (err) {
    if (!memoryCaseMessages[caseId] || memoryCaseMessages[caseId].length === 0) {
      memoryCaseMessages[caseId] = [defaultAgentWelcome];
    }
    return memoryCaseMessages[caseId];
  }
}

// --- SEND USER / AGENT MESSAGE TO CASE ---
export async function sendChatMessage(
  caseId: string,
  senderName: string,
  content: string,
  senderRole: 'USER' | 'AGENT' = 'USER'
): Promise<{ success: boolean; message: ChatMessage }> {
  const newMsg: ChatMessage = {
    id: 'msg-' + Date.now(),
    caseId,
    senderName: senderName || (senderRole === 'AGENT' ? 'James Thornton' : 'Client'),
    senderRole,
    content,
    createdAt: new Date().toISOString()
  };

  try {
    const created = await prisma.message.create({
      data: {
        caseId,
        senderName: newMsg.senderName,
        senderRole: newMsg.senderRole,
        content: newMsg.content
      }
    });
    newMsg.id = created.id;
    newMsg.createdAt = created.createdAt.toISOString();
  } catch (err) {
    if (!memoryCaseMessages[caseId]) memoryCaseMessages[caseId] = [];
    memoryCaseMessages[caseId].push(newMsg);
  }

  revalidatePath('/dashboard/messages');
  revalidatePath('/admin/dashboard');
  return { success: true, message: newMsg };
}
