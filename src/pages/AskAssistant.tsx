import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from '../hooks/useTranslation';
import { askQuestion } from '../services/assistantService';
import type { AssistantMessage as AssistantMessageType } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { AssistantMessage } from '../components/common/AssistantMessage';
import { Send, Globe } from 'lucide-react';

export default function AskAssistant() {
  const { language } = useStore();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
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

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: AssistantMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
      language
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await askQuestion(query, language);
      const assistantMsg: AssistantMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        language,
        response: response
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
