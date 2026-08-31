import React from 'react';
import { Info, ShieldAlert, ArrowRight } from 'lucide-react';
import type { RelevanceLevel, MatchSignal } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RelevanceBadge } from './RelevanceBadge';
import { MatchSignalList } from './MatchSignalList';
import { useTranslation } from '../../hooks/useTranslation';

export interface WhyThesePanelProps {
  /** The top match, whose signals stand in for how the list was ranked. */
  topMatch?: {
    standardNumber: string;
    title: string;
    relevance: RelevanceLevel;
    score: number;
    signals: MatchSignal[];
  };
  resultCount: number;
  onViewAnalysis?: () => void;
}

/**
 * Why the current result list looks the way it does.
 *
 * Sits beside the results and updates with them. Keeps the honesty boundary explicit: the
 * matching is this prototype's text matching, and any standard must be confirmed against
 * the official BIS source before it is acted on.
 */
export const WhyThesePanel: React.FC<WhyThesePanelProps> = ({
  topMatch,
  resultCount,
  onViewAnalysis
}) => {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <div className="flex items-start gap-2 mb-3">
        <Info className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <h2 className="text-sm font-bold text-slate-900">{t('standards.whyTitle')}</h2>
      </div>

      {!topMatch ? (
        <p className="text-sm text-slate-600">{t('standards.whyEmpty')}</p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">{t('standards.whyDesc')}</p>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-mono text-xs font-semibold text-blue-900">
              {topMatch.standardNumber}
            </p>
            <p className="text-xs text-slate-700 mt-0.5">{topMatch.title}</p>
            <RelevanceBadge
              relevance={topMatch.relevance}
              score={topMatch.score}
              showScoreBar
              className="mt-2"
            />
            {topMatch.signals.length > 0 && (
              <>
                <p className="text-xs font-medium text-slate-500 mt-3 mb-1.5">
                  {t('standards.matchedOn')}
                </p>
                <MatchSignalList signals={topMatch.signals} compact />
              </>
            )}
          </div>

          <p className="text-xs text-slate-500">
            {resultCount} {t('standards.standardsFound')}
          </p>

          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
            <ShieldAlert
              className="w-3.5 h-3.5 text-amber-700 mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-xs text-amber-900">
              {t('standards.aiAssisted')} — {t('standards.verifyOfficial')}.
            </p>
          </div>

          {onViewAnalysis && (
            <Button variant="outline" size="sm" className="w-full" onClick={onViewAnalysis}>
              {t('standards.viewAnalysis')}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
