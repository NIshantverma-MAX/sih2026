import React from 'react';
import { Bookmark, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Standard } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { getRelevanceColor } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

export interface StandardCardProps {
  standard: Standard;
  relevanceScore?: number;
  relevance?: 'high' | 'medium' | 'low';
  onViewDetails?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const StandardCard: React.FC<StandardCardProps> = ({
  standard,
  relevanceScore,
  relevance = 'high',
  onViewDetails,
  onBookmark,
  isBookmarked = false
}) => {
  const { t } = useTranslation();
  const relevanceColors = {
    high: 'text-green-700 bg-green-50 border-green-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    low: 'text-gray-700 bg-gray-50 border-gray-200'
  };

  return (
    <Card className="p-5 hoverable border border-slate-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="info" className="font-mono bg-blue-50 text-blue-800 border-blue-200">{standard.standardNumber}</Badge>
          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", relevanceColors[relevance])}>
            {relevance.charAt(0).toUpperCase() + relevance.slice(1)} Match
          </span>
          {standard.status && (
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full border font-medium",
              standard.status.toLowerCase() === 'active' ? "bg-green-50 text-green-700 border-green-200" :
              standard.status.toLowerCase() === 'withdrawn' ? "bg-red-50 text-red-700 border-red-200" :
              "bg-gray-50 text-gray-700 border-gray-200"
            )}>
              {standard.status}
            </span>
          )}
        </div>
        {onBookmark && (
          <button 
            onClick={(e) => { e.stopPropagation(); onBookmark(); }}
            className={cn("p-1.5 rounded-full hover:bg-slate-100 transition-colors", isBookmarked ? "text-blue-700" : "text-slate-400")}
            aria-label="Save standard"
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{standard.title}</h3>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{standard.description}</p>
      
      {relevanceScore !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>{t("common.relevanceScore") || "Relevance Score"}</span>
            <span>{relevanceScore}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-500", getRelevanceColor(relevance))}
              style={{ width: `${relevanceScore}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {onViewDetails && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs font-medium text-indigo-600 flex items-center">
            <span className="mr-1">{t("common.ai") || "AI:"}</span> {t("common.highlyRelevant") || "Highly relevant based on product"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onViewDetails(); }} className="text-slate-700 hover:text-blue-700 hover:border-blue-300">
              <FileText className="w-4 h-4 mr-2" />
              View Standard
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};