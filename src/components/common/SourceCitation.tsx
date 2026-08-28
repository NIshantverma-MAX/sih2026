import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
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
          <h4 className="text-sm font-semibold text-gray-900">{source.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{source.documentName}</p>
          {(source.section || source.page || source.clause) && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
              {source.section && <span>Section: {source.section}</span>}
              {source.page && <span>Page: {source.page}</span>}
              {source.clause && <span>Clause: {source.clause}</span>}
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" className="flex-shrink-0">
          <ExternalLink className="w-4 h-4 mr-1" />
          View
        </Button>
      </div>
    </Card>
  );
};