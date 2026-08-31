import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useTranslation } from '../hooks/useTranslation';
import { askQuestion } from '../services/assistantService';
import { getStandard } from '../services/standardsService';
import type { AssistantMessage as AssistantMessageType, Standard } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { AssistantMessage } from '../components/common/AssistantMessage';
import { Send, Globe, FileText } from 'lucide-react';

export default function AskAssistant() {
  const { language } = useStore();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  // Context handed over by the Standards workflow. Read once — the conversation then owns
  // itself, so typing here never rewrites the Standards page's own search.
  const standardId = searchParams.get('standardId') ?? '';
  const seedQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState('');
  const [contextStandard, setContextStandard] = useState<Standard | null>(null);
  const [messages, setMessages] = useState<AssistantMessageType[]>([{
    id: '1',
    role: 'assistant',
    content: t('assistant.welcome') || 'Welcome to BIS SmartGuide! I can help you find relevant Indian Standards, understand certification processes, and more. Ask me anything related to BIS.',
    timestamp: new Date().toISOString(),
    language
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: AssistantMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
      language
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await askQuestion(
        trimmed,
        language,
        standardId ? { standardId } : undefined
      );
      const assistantMsg: AssistantMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        language,
        response: response
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Surfaced in the thread rather than only in the console, so a failure is not
      // indistinguishable from the assistant having nothing to say.
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('assistant.errorMessage'),
        timestamp: new Date().toISOString(),
        language
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [language, standardId, t]);

  const handleSend = () => {
    void send(query);
  };

  // The handover from a standard: the question is asked for the user so the journey
  // continues instead of dropping them at an empty box.
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    if (!standardId && !seedQuery.trim()) return;
    seededRef.current = true;

    void (async () => {
      let question = seedQuery.trim();
      if (standardId) {
        const standard = await getStandard(standardId);
        if (standard) {
          setContextStandard(standard);
          if (!question) {
            question = `${t('assistant.standardQuestion')} ${standard.standardNumber}?`;
          }
        }
      }
      if (question) await send(question);
    })();
    // `send` and `t` are stable enough here; re-running would re-ask the same question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardId, seedQuery]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
          title={t('assistant.title') || 'Ask BIS SmartGuide'} 
          subtitle={t('assistant.subtitle') || 'Your AI assistant for all BIS related queries.'} 
        />
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border dark:border-slate-700 shadow-sm h-10">
          <Globe className="w-4 h-4" />
          <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
        </div>
      </div>

      {/* What the conversation is anchored to, so the handover from Standards is visible. */}
      {contextStandard && (
        <div className="mb-4 flex items-center gap-2 text-sm text-blue-900 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg px-3 py-2">
          <FileText className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="font-medium">{t('assistant.contextLabel')}</span>
          <span className="truncate">
            {contextStandard.standardNumber} — {contextStandard.title}
          </span>
        </div>
      )}

      <div className="flex-1 bg-gray-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700 overflow-hidden flex flex-col shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => (
            <AssistantMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[80%]">
                <div className="flex space-x-2 items-center h-6">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('assistant.placeholder') || 'Type your question here...'}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading || !query.trim()} className="bg-blue-900 hover:bg-blue-800 text-white flex-shrink-0">
              <Send className="w-4 h-4 mr-2" />
              {t('assistant.send') || 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
