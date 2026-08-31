import React from 'react';
import { Card } from '../ui/Card';

/**
 * Placeholder shaped like a `StandardCard`, so the list does not collapse and reflow when
 * results arrive.
 */
const StandardCardSkeleton: React.FC = () => (
  <Card className="p-5 animate-pulse">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-slate-200 rounded" />
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-5/6 bg-slate-100 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-28 bg-slate-100 rounded" />
          <div className="h-6 w-24 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0" />
    </div>
  </Card>
);

export interface StandardsSkeletonProps {
  count?: number;
}

export const StandardsSkeleton: React.FC<StandardsSkeletonProps> = ({ count = 3 }) => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    {Array.from({ length: count }).map((_, index) => (
      <StandardCardSkeleton key={index} />
    ))}
  </div>
);
