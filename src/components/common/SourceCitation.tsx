import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { SourceCitation as SourceCitationType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

export interface SourceCitationProps {
  source: SourceCitationType;
  /** The quoted extract, where one is held. Off by default so cards stay compact. */
  showSnippet?: boolean;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ source, showSnippet = false }) => {
  const { t } = useTranslation();

  return (
    <Card className="p-4 bg-gray-50 border-gray-200">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-900 mt-0.5">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900">
            {source.citationLabel && <span className="mr-1 text-blue-800">[{source.citationLabel}]</span>}
            {source.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 break-words">{source.documentName}</p>
          {(source.section || source.page || source.clause) && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
              {source.clause && (
                <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5">
                  {t('standards.evidence.clause')} {source.clause}
                </span>
              )}
              {source.section && (
                <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5">
                  {t('standards.evidence.section')} {source.section}
                </span>
              )}
              {source.page && (
                <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5">
                  {t('standards.evidence.page')} {source.page}
                </span>
              )}
            </div>
          )}
          {showSnippet && source.snippet && (
            <blockquote className="mt-2 border-l-2 border-blue-300 pl-3 text-xs text-gray-700 italic">
              {source.snippet}
            </blockquote>
          )}
        </div>
        {/*
          A real link to the document. This was a button with no handler, which read as an
          action and did nothing; the citation is only useful if the user can reach the source.
        */}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-medium text-blue-900 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
        >
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          {t('standards.evidence.viewSource')}
        </a>
      </div>
    </Card>
  );
};
