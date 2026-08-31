import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import type { SearchFilters } from '../../types';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * Popular categories, each mapped to a filter value that exists in the dataset.
 *
 * `filters: null` marks a category the prototype dataset does not cover. It is rendered
 * disabled with a reason rather than as a button that searches and finds nothing — a
 * control that looks live and does nothing is worse than one that explains itself.
 */
const POPULAR_CATEGORIES: { labelKey: string; filters: SearchFilters | null }[] = [
  { labelKey: 'electrical', filters: { category: 'Electrical' } },
  { labelKey: 'food', filters: { sector: 'Food and Agriculture' } },
  { labelKey: 'construction', filters: { category: 'Construction' } },
  { labelKey: 'mechanical', filters: { sector: 'Mechanical' } },
  { labelKey: 'consumer', filters: { category: 'Consumer Goods' } },
  { labelKey: 'textiles', filters: null }
];

/** Example queries. Each one resolves to at least one standard in the current dataset. */
const EXAMPLE_SEARCHES: { labelKey: string; query: string }[] = [
  { labelKey: 'waterPurifier', query: 'Water purifier' },
  { labelKey: 'ledBulb', query: 'LED bulb' },
  { labelKey: 'pressureCooker', query: 'Pressure cooker' },
  { labelKey: 'steelBottle', query: 'Stainless steel bottle' }
];

export interface SearchEmptyStateProps {
  /** Browse by classification — runs a real filtered query with no search text. */
  onCategorySelect: (filters: SearchFilters) => void;
  /** Runs a real search for the example query. */
  onExampleSelect: (query: string) => void;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  onCategorySelect,
  onExampleSelect
}) => {
  const { t } = useTranslation();

  return (
    <Card className="p-8 border-dashed border-2 border-slate-300 bg-slate-50">
      <div className="text-center">
        <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('standards.emptyTitle')}</h2>
        <p className="text-slate-600 max-w-md mx-auto">{t('standards.searchHint')}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          {t('standards.popularCategories')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CATEGORIES.map(({ labelKey, filters }) =>
            filters ? (
              <button
                key={labelKey}
                type="button"
                onClick={() => onCategorySelect(filters)}
                className="px-3 py-1.5 text-sm rounded-full bg-white border border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t(`standards.categories.${labelKey}`)}
              </button>
            ) : (
              <span
                key={labelKey}
                title={t('standards.categoryNotInDataset')}
                className="px-3 py-1.5 text-sm rounded-full bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              >
                {t(`standards.categories.${labelKey}`)}
                <span className="sr-only"> — {t('standards.categoryNotInDataset')}</span>
              </span>
            )
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">{t('standards.categoryNotInDataset')}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-slate-400" aria-hidden="true" />
          {t('standards.exampleSearches')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_SEARCHES.map(({ labelKey, query }) => (
            <button
              key={labelKey}
              type="button"
              onClick={() => onExampleSelect(query)}
              className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-medium hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t(`standards.examples.${labelKey}`)}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
