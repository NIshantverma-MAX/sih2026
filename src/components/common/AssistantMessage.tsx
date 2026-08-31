import React from 'react';
import {
  ArrowRight,
  Bot,
  ExternalLink,
  FileText,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AssistantMessage as AssistantMessageType } from '../../types';
import { StandardCard } from './StandardCard';
import { cn } from '../../utils/helpers';

export interface AssistantMessageProps {
  message: AssistantMessageType;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const response = message.response;
  const hasStructuredAnswer = !isUser && Boolean(response?.summary && response?.title);

  return (
    <div className={cn('mb-6 flex w-full min-w-0', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex w-full min-w-0 max-w-3xl', isUser ? 'flex-row-reverse' : 'flex-row')}>
        <div className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
          isUser ? 'ml-3 bg-blue-900 text-white' : 'mr-3 bg-blue-100 text-blue-900',
        )}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        <div className={cn(
          'min-w-0 max-w-[calc(100%-2.75rem)] break-words rounded-lg px-5 py-4 shadow-sm',
          isUser
            ? 'rounded-tr-none bg-blue-900 text-white'
            : 'rounded-tl-none border border-gray-200 bg-white text-gray-800',
        )}>
          {!hasStructuredAnswer && (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap dark:prose-invert">
              {message.content}
            </div>
          )}

          {hasStructuredAnswer && response && (
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                <span>{response.status === 'refused' ? 'No verified match' : 'Official BIS record'}</span>
              </div>

              <h3 className="text-base font-semibold text-gray-950">{response.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-gray-700">{response.summary}</p>

              {response.facts && response.facts.length > 0 && (
                <dl className="mt-4 grid border-y border-gray-200 sm:grid-cols-2">
                  {response.facts.map((fact, index) => (
                    <div
                      key={`${fact.label}-${fact.value}-${index}`}
                      className="min-w-0 border-b border-gray-100 py-3 last:border-b-0 sm:px-3 sm:first:pl-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                    >
                      <dt className="text-xs font-medium text-gray-500">{fact.label}</dt>
                      <dd className="mt-1 text-sm font-semibold leading-5 text-gray-900">
                        {fact.value}
                        {fact.citationLabels.length > 0 && (
                          <span className="ml-1.5 whitespace-nowrap text-xs font-medium text-blue-800">
                            [{fact.citationLabels.join(', ')}]
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {response.nextSteps && response.nextSteps.length > 0 && (
                <div className="mt-4 border-l-2 border-blue-700 pl-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">Next action</p>
                  {response.nextSteps.map((step, index) => (
                    <div key={`${step}-${index}`} className="mt-1 flex gap-2 text-sm leading-5 text-gray-700">
                      <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-800" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isUser && response && (
            <div className="mt-4 space-y-4">
              {response.standards && response.standards.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-900">Recommended Standards</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {response.standards.map((recommendation, index) => (
                      <StandardCard
                        key={recommendation.standard.id || index}
                        standard={recommendation.standard}
                        relevanceScore={recommendation.relevanceScore}
                        relevance={recommendation.relevance}
                      />
                    ))}
                  </div>
                </div>
              )}

              {response.sources && response.sources.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Official sources</p>
                  <div className="divide-y divide-gray-200 border-y border-gray-200">
                    {response.sources.map((source, index) => (
                      <a
                        key={source.id || index}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-w-0 items-center gap-3 py-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-700"
                      >
                        <FileText className="h-4 w-4 flex-shrink-0 text-blue-800" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900">
                            {source.citationLabel && (
                              <span className="mr-1 text-blue-800">[{source.citationLabel}]</span>
                            )}
                            {source.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-gray-500">
                            {source.documentName}
                            {source.page ? ` - Page ${source.page}` : ''}
                            {source.section ? ` - ${source.section}` : ''}
                          </span>
                        </span>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {response.warnings && response.warnings.length > 0 && (
                <p className="border-t border-amber-200 pt-3 text-xs leading-5 text-amber-800">
                  {response.warnings[0]}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
