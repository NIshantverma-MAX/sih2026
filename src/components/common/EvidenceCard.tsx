import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface EvidenceCardProps {
  title: string;
  reasons: string[];
  onViewAnalysis?: () => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ title, reasons, onViewAnalysis }) => {
  return (
    <Card className="p-5 border-blue-100 bg-blue-50/30">
      <h4 className="text-sm font-bold text-gray-900 mb-3">{title}</h4>
      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
      {onViewAnalysis && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onViewAnalysis} className="text-blue-900 hover:text-blue-800 p-0 hover:bg-transparent">
            View detailed analysis
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  );
};