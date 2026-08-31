import React from 'react';
import { Bookmark, FileText, MessageSquare, Columns3, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Standard, MatchSignal, RelevanceLevel } from '../../types';
import { RelevanceBadge } from '../standards/RelevanceBadge';
import { MatchSignalList } from '../standards/MatchSignalList';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils/helpers';

export interface StandardCardProps {
  standard: Standard;
  relevanceScore?: number;
  relevance?: RelevanceLevel;
  /** Why this standard matched. Absent when the user is browsing by filter. */
  matchSignals?: MatchSignal[];
  onViewDetails?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onCompare?: () => void;
  isComparing?: boolean;
  /** Disabled once the comparison tray is full, so the limit is visible before clicking. */
  compareDisabled?: boolean;
  onAsk?: () => void;
}

/** Signals shown on the card. The rest stay in the analysis view so the card stays legible. */
const MAX_CARD_SIGNALS = 3;

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  withdrawn: 'bg-red-50 text-red-700 border-red-200',
  'under-revision': 'bg-amber-50 text-amber-700 border-amber-200'
};

export const StandardCard: React.FC<StandardCardProps> = ({
  standard,
  relevanceScore,
  relevance,
  matchSignals,
  onViewDetails,
  onBookmark,
  isBookmarked = false,
  onCompare,
  isComparing = false,
  compareDisabled = false,
  onAsk
}) => {
  const { t } = useTranslation();
  const topSignals = matchSignals?.slice(0, MAX_CARD_SIGNALS) ?? [];

  return (
    <Card className="p-5 hoverable border border-slate-200">
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="info" className="font-mono bg-blue-50 text-blue-800 border-blue-200">
            {standard.standardNumber}
          </Badge>
          {/* The relevance band is rendered from the actual score, not asserted. */}
          {relevance && <RelevanceBadge relevance={relevance} score={relevanceScore} />}
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full border font-medium',
              STATUS_STYLES[standard.status] ?? 'bg-gray-50 text-gray-700 border-gray-200'
            )}
          >
            {t(`standards.statusLabel.${standard.status}`)}
          </span>
        </div>
        {onBookmark && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            aria-label={t('standards.save.aria')}
            aria-pressed={isBookmarked}
            className={cn(
              'p-1.5 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500',
              isBookmarked ? 'text-blue-700' : 'text-slate-400'
            )}
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{standard.title}</h3>
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{standard.description}</p>

      {/*
        The reason this standard is here, per standard. This used to be a single hardcoded
        "Highly relevant based on product" line printed on every card regardless of score,
        which made the three relevance bands indistinguishable.
      */}
      {topSignals.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-500 mb-1.5">{t('standards.whyRelevant')}</p>
          <MatchSignalList signals={topSignals} compact showWeights={false} />
        </div>
      )}

      {(onViewDetails || onCompare || onAsk) && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500">{t('standards.aiAssisted')}</span>
          <div className="flex flex-wrap gap-2">
            {onAsk && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAsk();
                }}
                aria-label={t('standards.askAria')}
                className="text-slate-600"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                {t('standards.askAboutThis')}
              </Button>
            )}
            {onCompare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare();
                }}
                disabled={compareDisabled && !isComparing}
                title={compareDisabled && !isComparing ? t('standards.compare.limit') : undefined}
                aria-pressed={isComparing}
                className={cn(isComparing ? 'text-blue-800' : 'text-slate-600')}
              >
                {isComparing ? (
                  <Check className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Columns3 className="w-4 h-4" aria-hidden="true" />
                )}
                {isComparing ? t('standards.compare.added') : t('standards.compare.add')}
              </Button>
            )}
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="text-slate-700 hover:text-blue-700 hover:border-blue-300"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                {t('standards.actions.viewStandard')}
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
