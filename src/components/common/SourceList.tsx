import React from 'react';
import { SourceCitation } from './SourceCitation';
import { SourceCitation as SourceCitationType } from '../../types';

export interface SourceListProps {
  sources: SourceCitationType[];
  title?: string;
}

export const SourceList: React.FC<SourceListProps> = ({ sources, title = "Sources" }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="flex flex-col gap-3">
        {sources.map((source, index) => (
          <SourceCitation key={source.id || index} source={source} />
        ))}
      </div>
    </div>
  );
};