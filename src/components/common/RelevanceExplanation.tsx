import React from 'react';
import { CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
  matchReasons: string[];
  evidenceIds?: string[];
  onViewDetails?: () => void;
}

export const RelevanceExplanation: React.FC<Props> = ({ matchReasons, evidenceIds, onViewDetails }) => {
  return (
    <Card className="p-5 bg-white shadow-sm border-slate-200 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-900">Why this standard?</h3>
      </div>
      
      <div className="flex-1">
        {matchReasons.length > 0 ? (
          <ul className="space-y-3 mb-4">
            {matchReasons.map((reason, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic mb-4">Select a standard to see relevance details.</p>
        )}

        {evidenceIds && evidenceIds.length > 0 && (
          <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
            <div className="flex gap-2 items-start">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600">
                <span className="font-medium text-slate-800">Source Evidence:</span> Backed by {evidenceIds.length} official BIS document{evidenceIds.length > 1 ? 's' : ''}.
              </div>
            </div>
          </div>
        )}
      </div>

      {onViewDetails && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Button variant="outline" className="w-full text-sm" onClick={onViewDetails} disabled={matchReasons.length === 0}>
            View Detailed Analysis
          </Button>
        </div>
      )}
    </Card>
  );
};
