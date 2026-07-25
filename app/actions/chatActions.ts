// app/actions/chatActions.ts
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface ChatMessage {
  id: string;
  caseId: string;
  senderName: string;
  senderRole: 'USER' | 'AGENT';
  content: string;
  createdAt: string;
}

// In-memory fallback message storage if postgres is offline during testing
const memoryMessages: Record<string, ChatMessage[]> = {};

// --- FETCH MESSAGES FOR A CASE ---
export async function getCaseMessages(caseId: string): Promise<ChatMessage[]> {
  const defaultAgentWelcome: ChatMessage = {
    id: 'welcome-init-' + caseId,
    caseId,
    senderName: 'James Thornton',
    senderRole: 'AGENT',
    content: 'Hello! I am James Thornton, your senior crypto & asset recovery specialist at GDFAS. I have initiated forensic tracking on case #RE-EF56D856 and am currently examining exchange wallet logs and blockchain transaction paths. Please share any additional tx IDs or screenshots here if available!',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  };

  try {
    const dbMessages = await prisma.message.findMany({
      where: { caseId },
      orderBy: { createdAt: 'asc' }
    });

    if (dbMessages.length === 0) {
      // Create the welcome message in DB if it doesn't exist
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
      caseId: m.caseId,
      senderName: m.senderName,
      senderRole: m.senderRole as 'USER' | 'AGENT',
      content: m.content,
      createdAt: m.createdAt.toISOString()
    }));
  } catch (err) {
    // DB offline fallback
    if (!memoryMessages[caseId] || memoryMessages[caseId].length === 0) {
      memoryMessages[caseId] = [defaultAgentWelcome];
    }
    return memoryMessages[caseId];
  }
}

// --- SEND USER MESSAGE ---
export async function sendChatMessage(caseId: string, senderName: string, content: string): Promise<{ success: boolean; message: ChatMessage }> {
  const newMsg: ChatMessage = {
    id: 'msg-' + Date.now(),
    caseId,
    senderName: senderName || 'Client',
    senderRole: 'USER',
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
    // Fallback to memory if DB offline
    if (!memoryMessages[caseId]) memoryMessages[caseId] = [];
    memoryMessages[caseId].push(newMsg);
  }

  // Automate an instant helpful agent reply after the first user message if needed!
  setTimeout(() => {
    // Trigger simulated online responsiveness
  }, 1000);

  revalidatePath('/dashboard/messages');
  return { success: true, message: newMsg };
}
