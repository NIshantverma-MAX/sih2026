import React from 'react';
import { BookMarked, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { getCertificationSources } from '../../data/certificationSources';

export interface OfficialSourcesPanelProps {
  sourceIds: string[];
  /** Limit the list; the rest stay reachable through the step-level citations. */
  limit?: number;
}

const TYPE_LABEL: Record<string, string> = {
  regulation: 'Regulation',
  guideline: 'Guideline',
  notification: 'Notification',
  website: 'BIS page',
  standard: 'Standard'
};

/**
 * Every claim on this page is traceable. This panel is the "what sources support these
 * answers?" question, answered with real links to bis.gov.in / crsbis.in only.
 */
export const OfficialSourcesPanel: React.FC<OfficialSourcesPanelProps> = ({ sourceIds, limit = 8 }) => {
  const sources = getCertificationSources(sourceIds);
  if (sources.length === 0) return null;

  const shown = sources.slice(0, limit);
  const remaining = sources.length - shown.length;

  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <BookMarked className="h-4 w-4 text-blue-900" />
        <h3 className="text-sm font-bold text-gray-900">Official sources</h3>
      </div>
      <p className="mb-3 text-xs text-gray-500">
        Only bis.gov.in, crsbis.in and the BIS portals — nothing on this page comes from a blog.
      </p>

      <ul className="space-y-3">
        {shown.map((source) => (
          <li key={source.id}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-md border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium leading-snug text-gray-900 group-hover:text-blue-900">
                  {source.title}
                </span>
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400 group-hover:text-blue-900" />
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                {TYPE_LABEL[source.type] ?? source.type}
                {source.page ? ` · page ${source.page}` : ''} · {source.documentName}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          {remaining} more source{remaining === 1 ? '' : 's'} are cited inside the individual steps above.
        </p>
      )}
    </Card>
  );
};
