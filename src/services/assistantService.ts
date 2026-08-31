import type { AssistantMessage, AssistantResponse, Language } from '../types';
import { insforge } from '../lib/insforge';

export async function askQuestion(question: string, language: Language): Promise<AssistantResponse> {
  if (!insforge) {
    throw new Error('BIS assistant backend is not configured.');
  }

  const { data, error } = await insforge.functions.invoke('ask-bis', {
    body: { question, language },
  });

  if (error) {
    throw error;
  }

  if (!data || typeof data.answer !== 'string') {
    throw new Error('BIS assistant returned an invalid response.');
  }

  return data as AssistantResponse;
}

export async function getConversation(_id: string): Promise<AssistantMessage[]> {
  return [];
}
