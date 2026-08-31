import React from 'react';
import { CheckCircle, Info, ShieldAlert, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { MatchSignal, RelevanceLevel, StandardEvidence } from '../../types';
import { RelevanceBadge } from '../standards/RelevanceBadge';
import { MatchSignalList } from '../standards/MatchSignalList';
import { useTranslation } from '../../hooks/useTranslation';

export interface RelevanceExplanationProps {
  /** Rendered sentences. Kept because the assistant already produces these. */
  matchReasons: string[];
  /** Structured form of the same reasons, when available. */
  matchSignals?: MatchSignal[];
  relevance?: RelevanceLevel;
  relevanceScore?: number;
  /** Source documents held for this standard, so the evidence claim matches reality. */
  evidence?: StandardEvidence | null;
  onViewSources?: () => void;
  onViewDetails?: () => void;
}

/**
 * Why one standard is relevant.
 *
 * The two halves are kept visually apart on purpose: the interpretation is this
 * prototype's own reading of the query, while the source documents are the only part
 * traceable to a BIS record. The evidence line counts what is actually on file — it
 * previously asserted "Backed by N official BIS document(s)" from an id list that was
 * populated with a placeholder, so it claimed evidence for standards that had none.
 */
export const RelevanceExplanation: React.FC<RelevanceExplanationProps> = ({
  matchReasons,
  matchSignals,
  relevance,
  relevanceScore,
  evidence,
  onViewSources,
  onViewDetails
}) => {
  const { t } = useTranslation();
  const hasReasons = matchReasons.length > 0 || (matchSignals?.length ?? 0) > 0;
  const citationCount = evidence?.citations.length ?? 0;

  return (
    <Card className="p-5 bg-white shadow-sm border-slate-200 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <Info className="w-5 h-5 text-blue-600" aria-hidden="true" />
        <h3 className="font-bold text-slate-900">{t('standards.whyRelevant')}</h3>
      </div>

      <div className="flex-1 space-y-4">
        {relevance && (
          <RelevanceBadge relevance={relevance} score={relevanceScore} showScoreBar />
        )}

        {/* System interpretation — generated here, not quoted from BIS. */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            {t('standards.interpretation')}
          </p>
          {hasReasons ? (
            <>
              {matchReasons.length > 0 && (
                <ul className="space-y-2">
                  {matchReasons.map((reason, index) => (
                    <li key={index} className="flex gap-2 text-sm text-slate-700">
                      <CheckCircle
                        className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
              {matchSignals && matchSignals.length > 0 && (
                <MatchSignalList signals={matchSignals} compact className="mt-2" />
              )}
              <p className="text-xs text-slate-500 mt-2">{t('standards.interpretationNote')}</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">{t('standards.noReason')}</p>
          )}
        </div>

        {/* Official record — separated from the interpretation above. */}
        {evidence && (
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              {t('standards.officialFacts')}
            </p>
            <div className="flex gap-2 items-start">
              {citationCount > 0 ? (
                <FileText className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <ShieldAlert
                  className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}
              <p className="text-xs text-slate-700">
                {citationCount > 0
                  ? `${citationCount} ${t('standards.evidence.sourcesCount')}`
                  : t('standards.evidence.noneShort')}
                {' — '}
                {t(`standards.evidence.note.${evidence.noteKey}`)}
              </p>
            </div>
            {onViewSources && citationCount > 0 && (
              <Button variant="ghost" size="sm" className="mt-2 -ml-1" onClick={onViewSources}>
                {t('standards.evidence.viewAllSources')}
              </Button>
            )}
          </div>
        )}
      </div>

      {onViewDetails && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onViewDetails}
            disabled={!hasReasons}
          >
            {t('standards.viewAnalysis')}
          </Button>
        </div>
      )}
    </Card>
  );
};
