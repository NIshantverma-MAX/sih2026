import React from 'react';
import type { MatchSignal } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils/helpers';

/**
 * The reasons a standard matched, as one chip per signal: which field matched, the term
 * that matched it, and the points it contributed. Rendering the arithmetic rather than
 * asserting a number is what makes the recommendation explainable.
 *
 * Field names are localised; the matched term is shown verbatim because it is the user's
 * own word or a value out of the dataset, and translating it would misrepresent the match.
 */
export interface MatchSignalListProps {
  signals: MatchSignal[];
  /** Compact form for cards; the full form is used in panels and the analysis modal. */
  compact?: boolean;
  showWeights?: boolean;
  className?: string;
}

export const MatchSignalList: React.FC<MatchSignalListProps> = ({
  signals,
  compact = false,
  showWeights = true,
  className
}) => {
  const { t } = useTranslation();

  if (signals.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {signals.map((signal, index) => (
        <li
          key={`${signal.key}-${signal.term}-${index}`}
          className={cn(
            'inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 text-slate-700',
            compact ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
          )}
        >
          <span className="text-slate-500">{t(`standards.signal.${signal.key}`)}</span>
          <span className="font-medium">{signal.term}</span>
          {showWeights && (
            <span className="font-mono tabular-nums text-slate-500">+{signal.weight}</span>
          )}
        </li>
      ))}
    </ul>
  );
};
