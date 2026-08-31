import React from 'react';
import { ShieldCheck, CircleDot, Circle } from 'lucide-react';
import type { RelevanceLevel } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils/helpers';

/**
 * Visual treatment per relevance band. The three bands differ in colour, icon, weight and
 * border so they are distinguishable at a glance and without relying on colour alone.
 */
const STYLES: Record<RelevanceLevel, { chip: string; bar: string; icon: typeof ShieldCheck }> = {
  high: {
    chip: 'bg-green-50 text-green-800 border-green-300 font-semibold',
    bar: 'bg-green-600',
    icon: ShieldCheck
  },
  medium: {
    chip: 'bg-amber-50 text-amber-800 border-amber-300 font-medium',
    bar: 'bg-amber-500',
    icon: CircleDot
  },
  low: {
    chip: 'bg-slate-50 text-slate-600 border-slate-300 font-normal',
    bar: 'bg-slate-400',
    icon: Circle
  }
};

export interface RelevanceBadgeProps {
  relevance: RelevanceLevel;
  /** Hidden when the user is browsing by filter rather than searching. */
  score?: number;
  showScoreBar?: boolean;
  className?: string;
}

export const RelevanceBadge: React.FC<RelevanceBadgeProps> = ({
  relevance,
  score,
  showScoreBar = false,
  className
}) => {
  const { t } = useTranslation();
  const style = STYLES[relevance];
  const Icon = style.icon;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border w-fit',
          style.chip
        )}
      >
        <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        {t(`standards.relevance.${relevance}`)}
        {score !== undefined && <span className="font-mono tabular-nums">{score}</span>}
      </span>

      {showScoreBar && score !== undefined && (
        <div className="w-full max-w-[200px]">
          <div
            className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"
            role="img"
            aria-label={`${t('standards.matchScore')}: ${score}`}
          >
            <div className={cn('h-full rounded-full', style.bar)} style={{ width: `${score}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};
