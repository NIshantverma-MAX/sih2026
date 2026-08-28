import React from 'react';
import { Bookmark, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Standard } from '../../types';
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
  const relevanceColors = {
    high: 'text-green-700 bg-green-50 border-green-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    low: 'text-gray-700 bg-gray-50 border-gray-200'
  };

  return (
    <Card className="p-5 hoverable">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="info" className="font-mono">{standard.standardNumber}</Badge>
          <span className={cn("text-xs px-2 py-0.5 rounded-full border", relevanceColors[relevance])}>
            {relevance.charAt(0).toUpperCase() + relevance.slice(1)} Match
          </span>
        </div>
        {onBookmark && (
          <button 
            onClick={onBookmark}
            className={cn("p-1 rounded-full hover:bg-gray-100 transition-colors", isBookmarked ? "text-blue-900" : "text-gray-400")}
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{standard.title}</h3>
      
      {relevanceScore !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Relevance Score</span>
            <span>{relevanceScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={cn("h-1.5 rounded-full", getRelevanceColor(relevance))}
              style={{ width: `${relevanceScore}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {onViewDetails && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <FileText className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      )}
    </Card>
  );
};