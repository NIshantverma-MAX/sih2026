import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { SourceCitation as SourceCitationType } from '../../types';

export interface SourceCitationProps {
  source: SourceCitationType;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ source }) => {
  return (
    <Card className="p-4 bg-gray-50 border-gray-200">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-900 mt-0.5">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {source.citationLabel && <span className="mr-1 text-blue-800">[{source.citationLabel}]</span>}
            {source.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{source.documentName}</p>
          {(source.section || source.page || source.clause) && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
              {source.section && <span>Section: {source.section}</span>}
              {source.page && <span>Page: {source.page}</span>}
              {source.clause && <span>Clause: {source.clause}</span>}
            </div>
          )}
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-shrink-0 items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          View
        </a>
      </div>
    </Card>
  );
};
