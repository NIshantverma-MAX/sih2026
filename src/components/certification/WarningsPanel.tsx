import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';

export interface WarningsPanelProps {
  warnings: string[];
}

/** What commonly goes wrong, and what happens if the requirement is not met. */
export const WarningsPanel: React.FC<WarningsPanelProps> = ({ warnings }) => {
  if (warnings.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <h3 className="text-sm font-bold text-amber-900">Watch out for</h3>
      </div>
      <ul className="space-y-2.5">
        {warnings.map((warning, index) => (
          <li key={index} className="flex gap-2 text-sm leading-relaxed text-amber-900">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
            <span>{warning}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
