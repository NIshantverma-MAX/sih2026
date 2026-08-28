import React from 'react';
import { Bot, User } from 'lucide-react';
import { AssistantMessage as AssistantMessageType } from '../../types';
import { StandardCard } from './StandardCard';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/helpers';

export interface AssistantMessageProps {
  message: AssistantMessageType;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-3xl", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "ml-3 bg-blue-900 text-white" : "mr-3 bg-blue-100 text-blue-900"
        )}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
        
        {/* Message Content */}
        <div className={cn(
          "rounded-2xl px-5 py-4 shadow-sm",
          isUser ? "bg-blue-900 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
        )}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.content}
          </div>
          
          {/* Structured Content (if assistant) */}
          {!isUser && message.response && (
            <div className="mt-4 space-y-4">
              
              {/* Recommended Standards */}
              {message.response.standards && message.response.standards.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Recommended Standards:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {message.response.standards.map((recommendation, idx) => (
                      <StandardCard 
                        key={recommendation.standard.id || idx} 
                        standard={recommendation.standard}
                        relevanceScore={recommendation.relevanceScore}
                        relevance={recommendation.relevance}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sources */}
              {message.response.sources && message.response.sources.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.response.sources.map((source, idx) => (
                      <Badge key={source.id || idx} variant="info" className="text-xs">
                        {source.documentName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};