import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { RecommendationAnalysis } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { RelevanceBadge } from './RelevanceBadge';
import { MatchSignalList } from './MatchSignalList';
import { useTranslation } from '../../hooks/useTranslation';

export interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: RecommendationAnalysis | null;
  loading?: boolean;
}

/**
 * The full ranking rationale: the terms searched, the weighting table, the relevance bands,
 * the per-standard signals, and the limits of the method.
 *
 * Publishing the weights is the point — it makes the ranking auditable instead of an
 * unexplained number, and the limitations make clear these are the prototype's own rules,
 * not BIS ranking rules.
 */
export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  loading = false
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('standards.analysisTitle')} size="lg">
      {loading && <p className="text-sm text-slate-600">{t('common.loading')}</p>}

      {!loading && !analysis && <p className="text-sm text-slate-600">{t('standards.whyEmpty')}</p>}

      {!loading && analysis && (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">
              {t('standards.analysis.interpreted')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              {t('standards.analysis.interpretedNote')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.interpretedTerms.map((term) => (
                <Badge key={term} variant="info">
                  {term}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">
              {t('standards.analysis.weights')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              {t('standards.analysis.weightsNote')}
            </p>
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {analysis.signalWeights.map((entry) => (
                <li key={entry.key} className="flex items-center justify-between px-3 py-1.5 text-sm">
                  <span className="text-slate-700">{t(`standards.signal.${entry.key}`)}</span>
                  <span className="font-mono tabular-nums text-slate-900">
                    {entry.weight} {t('standards.analysis.points')}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              {t('standards.analysis.thresholds')}
            </h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>
                {t('standards.analysis.thresholdsHigh')}{' '}
                <span className="font-mono tabular-nums font-semibold">
                  {analysis.thresholds.high}
                </span>{' '}
                {t('standards.analysis.points')}
              </li>
              <li>
                {t('standards.analysis.thresholdsMedium')}{' '}
                <span className="font-mono tabular-nums font-semibold">
                  {analysis.thresholds.medium}
                </span>{' '}
                {t('standards.analysis.points')}
              </li>
              <li>{t('standards.analysis.thresholdsLow')}</li>
            </ul>
          </section>

          {analysis.topMatches.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                {t('standards.analysis.topMatches')}
              </h3>
              <div className="space-y-3">
                {analysis.topMatches.map((match) => (
                  <div
                    key={match.standardId}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-blue-900">
                          {match.standardNumber}
                        </p>
                        <p className="text-xs text-slate-700 mt-0.5">{match.title}</p>
                      </div>
                      <RelevanceBadge relevance={match.relevance} score={match.score} />
                    </div>
                    <MatchSignalList signals={match.signals} compact className="mt-2" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {t('standards.analysis.limitations')}
            </h3>
            <ul className="mt-2 space-y-1 list-disc pl-5 text-xs text-amber-900">
              {analysis.limitationKeys.map((key) => (
                <li key={key}>{t(`standards.analysis.limitation.${key}`)}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
};
