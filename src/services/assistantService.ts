import type {
  AssistantConversation,
  AssistantMessage,
  AssistantResponse,
  Language,
} from '../types';
import { insforge } from '../lib/insforge';

interface ConversationRow {
  id: string;
  title: string;
  language: Language;
  created_at: string;
  updated_at: string;
}

interface MessageRow {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: Language;
  response: AssistantResponse | null;
  created_at: string;
}

function requireInsForge() {
  if (!insforge) {
    throw new Error('BIS assistant backend is not configured.');
  }

  return insforge;
}

function mapConversation(row: ConversationRow): AssistantConversation {
  return {
    id: row.id,
    title: row.title,
    language: row.language,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function askQuestion(question: string, language: Language): Promise<AssistantResponse> {
  const client = requireInsForge();

  const { data, error } = await client.functions.invoke('ask-bis', {
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

export async function listConversations(): Promise<AssistantConversation[]> {
  const client = requireInsForge();
  const { data, error } = await client.database
    .from('assistant_conversations')
    .select('id, title, language, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return ((data ?? []) as ConversationRow[]).map(mapConversation);
}

export async function createConversation(
  title: string,
  language: Language,
): Promise<AssistantConversation> {
  const client = requireInsForge();
  const { data, error } = await client.database
    .from('assistant_conversations')
    .insert([{ title, language }])
    .select('id, title, language, created_at, updated_at');

  if (error) {
    throw error;
  }

  const row = (data as ConversationRow[] | null)?.[0];
  if (!row) {
    throw new Error('InsForge did not return the new conversation.');
  }

  return mapConversation(row);
}

export async function getConversation(id: string): Promise<AssistantMessage[]> {
  const client = requireInsForge();
  const { data, error } = await client.database
    .from('assistant_messages')
    .select('id, role, content, language, response, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(200);

  if (error) {
    throw error;
  }

  return ((data ?? []) as MessageRow[])
    .reverse()
    .map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      timestamp: row.created_at,
      language: row.language,
      response: row.response ?? undefined,
    }));
}

export async function saveMessage(
  conversationId: string,
  message: AssistantMessage,
): Promise<AssistantMessage> {
  const client = requireInsForge();
  const { data, error } = await client.database
    .from('assistant_messages')
    .insert([{
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      language: message.language,
      response: message.response ?? null,
    }])
    .select('id, role, content, language, response, created_at');

  if (error) {
    throw error;
  }

  const row = (data as MessageRow[] | null)?.[0];
  if (!row) {
    throw new Error('InsForge did not return the saved message.');
  }

  return {
    id: row.id,
    role: row.role,
    content: row.content,
    timestamp: row.created_at,
    language: row.language,
    response: row.response ?? undefined,
  };
}
