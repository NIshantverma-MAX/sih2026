import React from 'react';
import { cn } from '../../utils/helpers';

export const SkeletonLine: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white p-6 rounded-lg border border-gray-200 flex flex-col gap-4", className)}>
    <SkeletonLine className="h-6 w-3/4" />
    <SkeletonLine className="h-4 w-full" />
    <SkeletonLine className="h-4 w-5/6" />
    <div className="mt-4 flex gap-2">
      <SkeletonLine className="h-8 w-24 rounded-full" />
      <SkeletonLine className="h-8 w-24 rounded-full" />
    </div>
  </div>
);