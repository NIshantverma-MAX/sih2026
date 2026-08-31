import { useEffect, useRef, useState } from 'react';
import { Globe, History, Loader2, MessageSquare, Plus, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { AssistantMessage } from '../components/common/AssistantMessage';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { useStore } from '../lib/store';
import {
  askQuestion,
  createConversation,
  getConversation,
  listConversations,
  saveMessage,
} from '../services/assistantService';
import type {
  AssistantConversation,
  AssistantMessage as AssistantMessageType,
  Language,
} from '../types';

const welcomeMessageId = 'welcome';

function createWelcomeMessage(language: Language): AssistantMessageType {
  return {
    id: welcomeMessageId,
    role: 'assistant',
    content: language === 'hi'
      ? 'बीआईएस स्मार्टगाइड में आपका स्वागत है! मैं आपकी बीआईएस संबंधित किसी भी समस्या में मदद कर सकता हूं।'
      : 'Welcome to BIS SmartGuide! I can help you find relevant Indian Standards, understand certification processes, and more. Ask me anything related to BIS.',
    timestamp: new Date().toISOString(),
    language,
  };
}

function createConversationTitle(question: string): string {
  const normalized = question.replace(/\s+/g, ' ').trim();
  return normalized.length > 72 ? `${normalized.slice(0, 69)}...` : normalized;
}

function formatConversationDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
}

function AssistantChat() {
  const { language, user, isAuthenticated, authHydrated } = useStore();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<AssistantMessageType[]>([]);
  const [conversations, setConversations] = useState<AssistantConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!authHydrated || !isAuthenticated || !user) {
      return;
    }

    let cancelled = false;

    async function restoreHistory() {
      setIsHistoryLoading(true);

      try {
        const savedConversations = await listConversations();
        if (cancelled) return;

        setConversations(savedConversations);
        const latest = savedConversations[0];

        if (!latest) {
          setMessages([]);
          setSelectedConversationId(null);
          return;
        }

        const savedMessages = await getConversation(latest.id);
        if (cancelled) return;

        setSelectedConversationId(latest.id);
        setMessages(savedMessages);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          toast.error('Your saved chats could not be loaded.');
        }
      } finally {
        if (!cancelled) {
          setIsHistoryLoading(false);
        }
      }
    }

    void restoreHistory();

    return () => {
      cancelled = true;
    };
  }, [authHydrated, isAuthenticated, user]);

  const startNewChat = () => {
    if (isLoading) return;
    setSelectedConversationId(null);
    setMessages([]);
    setQuery('');
  };

  const openConversation = async (conversationId: string) => {
    if (isLoading || conversationId === selectedConversationId) return;

    setSelectedConversationId(conversationId);
    setIsHistoryLoading(true);

    try {
      const savedMessages = await getConversation(conversationId);
      setMessages(savedMessages);
    } catch (error) {
      console.error(error);
      toast.error('This chat could not be loaded.');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const moveConversationToTop = (conversationId: string, timestamp: string) => {
    setConversations((current) => {
      const conversation = current.find((item) => item.id === conversationId);
      if (!conversation) return current;

      return [
        { ...conversation, updatedAt: timestamp },
        ...current.filter((item) => item.id !== conversationId),
      ];
    });
  };

  const replaceMessage = (temporaryId: string, savedMessage: AssistantMessageType) => {
    setMessages((current) => current.map((message) => (
      message.id === temporaryId ? savedMessage : message
    )));
  };

  const handleSend = async () => {
    const question = query.trim();
    if (!question || isLoading || !authHydrated) return;

    const userMessage: AssistantMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
      language,
    };

    setMessages((current) => [...current, userMessage]);
    setQuery('');
    setIsLoading(true);

    let conversationId = selectedConversationId;
    let historyWritable = isAuthenticated && Boolean(user);

    if (historyWritable) {
      try {
        if (!conversationId) {
          const conversation = await createConversation(
            createConversationTitle(question),
            language,
          );
          conversationId = conversation.id;
          setSelectedConversationId(conversation.id);
          setConversations((current) => [
            conversation,
            ...current.filter((item) => item.id !== conversation.id),
          ]);
        }

        const savedUserMessage = await saveMessage(conversationId, userMessage);
        replaceMessage(userMessage.id, savedUserMessage);
        moveConversationToTop(conversationId, savedUserMessage.timestamp);
      } catch (error) {
        console.error(error);
        historyWritable = false;
        toast.error('This reply will not be saved to chat history.');
      }
    }

    let assistantMessage: AssistantMessageType;

    try {
      const response = await askQuestion(question, language);
      assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        language,
        response,
      };
    } catch (error) {
      console.error(error);
      assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: language === 'hi'
          ? 'BIS SmartGuide अभी आधिकारिक BIS स्रोतों से उत्तर नहीं ला पा रहा है। कृपया कुछ देर बाद फिर कोशिश करें।'
          : 'BIS SmartGuide could not retrieve an official-source answer right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        language,
        response: {
          answer: '',
          warnings: ['The assistant failed closed instead of returning an unsourced answer.'],
        },
      };
    }

    setMessages((current) => [...current, assistantMessage]);

    if (historyWritable && conversationId) {
      try {
        const savedAssistantMessage = await saveMessage(conversationId, assistantMessage);
        replaceMessage(assistantMessage.id, savedAssistantMessage);
        moveConversationToTop(conversationId, savedAssistantMessage.timestamp);
      } catch (error) {
        console.error(error);
        toast.error('The latest reply could not be saved.');
      }
    }

    setIsLoading(false);
  };

  const isChatBusy = isLoading || isHistoryLoading;

  return (
    <div className="flex h-[calc(100vh-6rem)] min-h-[34rem] flex-col">
      <PageHeader
        title="Ask BIS SmartGuide"
        subtitle="Your AI assistant for BIS-related queries."
        actions={(
          <>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 shadow-sm">
              <Globe className="h-4 w-4" />
              <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
            </div>
            <Button
              variant="outline"
              icon={Plus}
              onClick={startNewChat}
              disabled={isChatBusy}
            >
              {language === 'hi' ? 'नई चैट' : 'New chat'}
            </Button>
          </>
        )}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
          <div className="flex h-14 items-center gap-2 border-b border-gray-200 px-4">
            <History className="h-4 w-4 text-blue-900" />
            <h2 className="text-sm font-semibold text-gray-900">Chat history</h2>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {isHistoryLoading && conversations.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading chat history" />
              </div>
            ) : !isAuthenticated ? (
              <p className="px-2 py-4 text-sm text-gray-500">Sign in to access saved chats.</p>
            ) : conversations.length === 0 ? (
              <p className="px-2 py-4 text-sm text-gray-500">No saved chats yet.</p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => void openConversation(conversation.id)}
                    disabled={isChatBusy}
                    className={`w-full rounded-md px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      selectedConversationId === conversation.id
                        ? 'bg-blue-50 text-blue-950'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="block truncate text-sm font-medium">{conversation.title}</span>
                    <time className="mt-1 block text-xs text-gray-500" dateTime={conversation.updatedAt}>
                      {formatConversationDate(conversation.updatedAt)}
                    </time>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {isAuthenticated && conversations.length > 0 && (
            <div className="border-b border-gray-200 bg-white p-3 lg:hidden">
              <label htmlFor="mobile-chat-history" className="sr-only">Chat history</label>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 flex-shrink-0 text-blue-900" />
                <select
                  id="mobile-chat-history"
                  value={selectedConversationId ?? ''}
                  onChange={(event) => {
                    if (event.target.value) {
                      void openConversation(event.target.value);
                    } else {
                      startNewChat();
                    }
                  }}
                  disabled={isChatBusy}
                  className="h-9 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-blue-900 focus:ring-blue-900"
                >
                  <option value="">New chat</option>
                  {conversations.map((conversation) => (
                    <option key={conversation.id} value={conversation.id}>
                      {conversation.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {isHistoryLoading && selectedConversationId ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin" aria-label="Loading conversation" />
              </div>
            ) : (
              <>
                <AssistantMessage message={createWelcomeMessage(language)} />
                {messages.map((message) => (
                  <AssistantMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm border bg-white p-4 shadow-sm">
                      <div className="flex h-6 items-center space-x-2" aria-label="BIS SmartGuide is responding">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                disabled={isChatBusy || !authHydrated}
                placeholder={language === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Type your question here...'}
                className="min-w-0 flex-1"
              />
              <Button
                onClick={() => void handleSend()}
                disabled={isChatBusy || !authHydrated || !query.trim()}
                className="flex-shrink-0 bg-blue-900 text-white hover:bg-blue-800"
                icon={Send}
              >
                <span className="hidden sm:inline">{language === 'hi' ? 'भेजें' : 'Send'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AskAssistant() {
  const { authHydrated, user } = useStore();
  const sessionKey = authHydrated ? (user?.id ?? 'guest') : 'loading';

  return <AssistantChat key={sessionKey} />;
}
