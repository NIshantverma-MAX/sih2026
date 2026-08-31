import React from 'react';
import { SearchX, MessageSquare, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

export interface NoResultsStateProps {
  query: string;
  /** Alternative queries from the service — each one resolves in the dataset. */
  suggestions: string[];
  onSuggestion: (query: string) => void;
  onAskAssistant: () => void;
  onTryAnother: () => void;
  /** Set when filters, not the query, removed every match. */
  hiddenByFilters?: number;
  onClearFilters?: () => void;
}

/**
 * Nothing matched. Offers a way forward rather than a dead end: alternative queries the
 * dataset can actually answer, a handoff to the assistant, and a reset.
 */
export const NoResultsState: React.FC<NoResultsStateProps> = ({
  query,
  suggestions,
  onSuggestion,
  onAskAssistant,
  onTryAnother,
  hiddenByFilters,
  onClearFilters
}) => {
  const { t } = useTranslation();

  return (
    <Card className="p-8">
      <div className="text-center">
        <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('standards.notFoundTitle')}</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          {t('standards.notFoundDesc')}
          {query && (
            <>
              {' '}
              <span className="font-medium text-slate-900">“{query}”</span>
            </>
          )}
        </p>
      </div>

      {/* Filters, not the query, are the cause — say so and offer the one-click fix. */}
      {hiddenByFilters !== undefined && hiddenByFilters > 0 && onClearFilters && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm text-amber-900">
              {hiddenByFilters} {t('standards.filtersHid')}
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-1 text-sm font-medium text-amber-900 underline underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-amber-600 rounded"
            >
              {t('standards.clearToSeeAll')}
            </button>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">{t('standards.tryInstead')}</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestion(suggestion)}
                className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-medium hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button variant="primary" icon={MessageSquare} onClick={onAskAssistant}>
          {t('standards.askSmartGuide')}
        </Button>
        <Button variant="outline" icon={RotateCcw} onClick={onTryAnother}>
          {t('standards.tryAnother')}
        </Button>
      </div>
    </Card>
  );
};
