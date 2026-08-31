import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle, SlidersHorizontal, X, Columns3, Loader2 } from 'lucide-react';
import {
  searchStandards,
  getRecommendationAnalysis,
  getStandardSources
} from '../services/standardsService';
import { StandardCard } from '../components/common/StandardCard';
import { ProductIdentificationCard } from '../components/common/ProductIdentificationCard';
import { StandardsSearch } from '../components/standards/StandardsSearch';
import {
  countActiveFilters,
  describeActiveFilters
} from '../components/standards/filterSummary';
import { FilterDrawer } from '../components/standards/FilterDrawer';
import { SearchEmptyState } from '../components/standards/SearchEmptyState';
import { NoResultsState } from '../components/standards/NoResultsState';
import { SearchErrorState } from '../components/standards/SearchErrorState';
import { StandardsSkeleton } from '../components/standards/StandardsSkeleton';
import { WhyThesePanel } from '../components/standards/WhyThesePanel';
import { AnalysisModal } from '../components/standards/AnalysisModal';
import { StandardComparison } from '../components/standards/StandardComparison';
import { SourceDrawer } from '../components/standards/SourceDrawer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import type {
  ProductIdentification,
  RecommendationAnalysis,
  SearchFilters,
  Standard,
  StandardEvidence,
  StandardRecommendation,
  StandardsSearchResult,
  StandardsSortOption
} from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useDebounce } from '../hooks/useDebounce';
import { useSaveStandard } from '../hooks/useSaveStandard';

const PAGE_SIZE = 6;
const MAX_COMPARE = 3;
const SORT_OPTIONS: StandardsSortOption[] = [
  'relevance',
  'latest',
  'alphabetical',
  'standard-number'
];

/**
 * URL parameter name per filter key. The URL is the shareable, restorable form of the
 * search, and it is what brings the user back to the same result list from a standard's
 * detail page.
 */
const FILTER_PARAMS: Partial<Record<keyof SearchFilters, string>> = {
  category: 'category',
  sector: 'sector',
  status: 'status',
  certificationStatus: 'cert',
  relevance: 'relevance',
  icsGroup: 'ics'
};

const LATEST_PARAM = 'latest';
const SORT_PARAM = 'sort';

function readFilters(params: URLSearchParams): SearchFilters {
  const filters: SearchFilters = {};
  for (const [key, param] of Object.entries(FILTER_PARAMS)) {
    const value = params.get(param as string);
    if (value) (filters as Record<string, unknown>)[key] = value;
  }
  if (params.get(LATEST_PARAM) === '1') filters.latestRevisionOnly = true;
  return filters;
}

function readSort(params: URLSearchParams): StandardsSortOption {
  const value = params.get(SORT_PARAM) as StandardsSortOption | null;
  return value && SORT_OPTIONS.includes(value) ? value : 'relevance';
}

/**
 * Standards discovery.
 *
 * Owns its own search box (`standardsQuery`). The `?q=` parameter seeds it once on entry —
 * from the home hero, a saved item, or a shared link — and after that this page is the only
 * thing that writes it. Nothing here touches the header or hero search state, so the three
 * inputs never overwrite each other.
 *
 * All matching, filtering, sorting and paging happen in `standardsService`; this page only
 * holds the inputs and renders what comes back. That is what lets the mock service be
 * replaced with an HTTP one without touching this file.
 */
export default function Standards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isSaved, toggleSaved } = useSaveStandard();

  // Seeded from the URL on entry, then owned here. Never lifted into the global store:
  // the header and the home hero keep their own input state (§5).
  const [standardsQuery, setStandardsQuery] = useState(() => searchParams.get('q') ?? '');
  const [filters, setFilters] = useState<SearchFilters>(() => readFilters(searchParams));
  const [sort, setSort] = useState<StandardsSortOption>(() => readSort(searchParams));

  const [results, setResults] = useState<StandardRecommendation[]>([]);
  const [meta, setMeta] = useState<StandardsSearchResult | null>(null);
  const [product, setProduct] = useState<ProductIdentification | null>(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const [analysis, setAnalysis] = useState<RecommendationAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const [evidence, setEvidence] = useState<StandardEvidence | null>(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceLabel, setEvidenceLabel] = useState<string | undefined>();
  const [showEvidence, setShowEvidence] = useState(false);

  // Typing must not fire a request per keystroke (§15).
  const debouncedQuery = useDebounce(standardsQuery, 450);
  const activeFilterCount = countActiveFilters(filters);
  const activeChips = useMemo(() => describeActiveFilters(filters, t), [filters, t]);

  // Only the newest request is allowed to write state, so a slow earlier search can never
  // overwrite a faster later one.
  const requestRef = useRef(0);

  const runSearch = useCallback(
    async (
      query: string,
      searchFilters: SearchFilters,
      sortBy: StandardsSortOption,
      pageToLoad: number
    ) => {
      const requestId = ++requestRef.current;
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const result = await searchStandards(query, searchFilters, {
          page: pageToLoad,
          pageSize: PAGE_SIZE,
          sort: sortBy
        });
        if (requestId !== requestRef.current) return;

        setResults((previous) =>
          pageToLoad === 1 ? result.results : [...previous, ...result.results]
        );
        setMeta(result);
        // The service already interprets the query; calling identifyProduct again here
        // would run the same heuristic twice on the same string.
        if (pageToLoad === 1) setProduct(result.product);
      } catch (caught) {
        if (requestId !== requestRef.current) return;
        setError(caught instanceof Error ? caught : new Error('Search failed'));
      } finally {
        if (requestId === requestRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    []
  );

  // A new query, filter or sort restarts the list at page 1.
  useEffect(() => {
    setPage(1);
    if (!debouncedQuery.trim() && countActiveFilters(filters) === 0) {
      // Nothing to search: discard any in-flight result and show the empty state.
      requestRef.current += 1;
      setResults([]);
      setMeta(null);
      setProduct(null);
      setError(null);
      setLoading(false);
      return;
    }
    runSearch(debouncedQuery, filters, sort, 1);
  }, [debouncedQuery, filters, sort, runSearch]);

  // Keep the URL in step so the search survives a refresh, a share, and the trip to a
  // standard's detail page and back. `replace` keeps typing out of the history stack.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedQuery.trim()) next.set('q', debouncedQuery.trim());
    else next.delete('q');

    for (const [key, param] of Object.entries(FILTER_PARAMS)) {
      const value = filters[key as keyof SearchFilters];
      if (typeof value === 'string' && value) next.set(param as string, value);
      else next.delete(param as string);
    }
    if (filters.latestRevisionOnly) next.set(LATEST_PARAM, '1');
    else next.delete(LATEST_PARAM);

    if (sort !== 'relevance') next.set(SORT_PARAM, sort);
    else next.delete(SORT_PARAM);

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // `searchParams` is intentionally not a dependency: this effect writes the URL from
    // page state, it does not read it back. Re-running on its own write would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filters, sort]);

  const handleSubmit = () => {
    // Submitting the same text the debounce already searched should still feel like an
    // action, so re-run it rather than doing nothing.
    runSearch(standardsQuery, filters, sort, 1);
    setPage(1);
  };

  const handleClear = () => {
    setStandardsQuery('');
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    runSearch(debouncedQuery, filters, sort, nextPage);
  };

  const handleProductUpdate = (updated: Partial<ProductIdentification>) => {
    // The correction has to change what is searched, otherwise the card would edit a label
    // while the results below stayed keyed to the original wording.
    const refined = [updated.name, updated.material, updated.intendedUse]
      .filter((part): part is string => Boolean(part && part.trim()))
      .join(' ')
      .trim();
    if (refined) setStandardsQuery(refined);
  };

  const handleViewStandard = (standardId: string) => {
    // Only the id crosses the route boundary. The search string travels in history state
    // so the detail page can offer an exact way back to these results.
    navigate(`/standards/${standardId}`, { state: { from: location.search } });
  };

  const handleAsk = (standard: Standard) => {
    navigate(`/ask?standardId=${encodeURIComponent(standard.id)}`);
  };

  const toggleCompare = (standardId: string) => {
    setCompareIds((previous) =>
      previous.includes(standardId)
        ? previous.filter((id) => id !== standardId)
        : previous.length >= MAX_COMPARE
          ? previous
          : [...previous, standardId]
    );
  };

  const handleViewAnalysis = async () => {
    setShowAnalysis(true);
    setAnalysisLoading(true);
    try {
      setAnalysis(await getRecommendationAnalysis(debouncedQuery));
    } catch {
      setAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleViewSources = async (standard: Standard) => {
    setEvidenceLabel(`${standard.standardNumber} — ${standard.title}`);
    setEvidence(null);
    setShowEvidence(true);
    setEvidenceLoading(true);
    try {
      setEvidence(await getStandardSources(standard.id));
    } catch {
      setEvidence(null);
    } finally {
      setEvidenceLoading(false);
    }
  };

  const primary = results.filter((item) => item.matchType === 'primary');
  const alternatives = results.filter((item) => item.matchType !== 'primary');
  const topMatch = results[0];
  const compared = compareIds
    .map((id) => results.find((item) => item.standard.id === id)?.standard)
    .filter((standard): standard is Standard => Boolean(standard));

  const hasSearch = Boolean(debouncedQuery.trim()) || activeFilterCount > 0;
  const hiddenByFilters = meta ? Math.max(0, meta.totalBeforeFilters - meta.total) : 0;

  const renderCard = (item: StandardRecommendation) => (
    <StandardCard
      key={item.standard.id}
      standard={item.standard}
      relevance={item.relevance}
      relevanceScore={item.relevanceScore}
      matchSignals={item.matchSignals}
      isBookmarked={isSaved(item.standard.id)}
      onBookmark={() => toggleSaved(item.standard)}
      onViewDetails={() => handleViewStandard(item.standard.id)}
      onCompare={() => toggleCompare(item.standard.id)}
      isComparing={compareIds.includes(item.standard.id)}
      compareDisabled={compareIds.length >= MAX_COMPARE}
      onAsk={() => handleAsk(item.standard)}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('standards.title')}
        subtitle={t('standards.subtitle')}
        backTo="/"
        backLabel={t('standards.backToHome')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card className="p-4 bg-white shadow-sm flex flex-col md:flex-row gap-4">
            <StandardsSearch
              value={standardsQuery}
              onChange={setStandardsQuery}
              onSubmit={handleSubmit}
              onClear={handleClear}
              busy={loading}
            />
            <div className="flex flex-wrap gap-2 md:items-start">
              <div className="w-full sm:w-48">
                <Select
                  aria-label={t('standards.sortLabel')}
                  value={sort}
                  onChange={(event) => setSort(event.target.value as StandardsSortOption)}
                  className="h-10"
                  options={[
                    { value: 'relevance', label: t('standards.mostRelevant') },
                    { value: 'latest', label: t('standards.recent') },
                    { value: 'alphabetical', label: t('standards.az') },
                    { value: 'standard-number', label: t('standards.standardNumber') }
                  ]}
                />
              </div>
              <Button
                variant="outline"
                icon={SlidersHorizontal}
                onClick={() => setShowFilters(true)}
                aria-expanded={showFilters}
                className="h-10 flex-shrink-0"
              >
                {t('standards.openFilters')}
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-blue-100 text-blue-800 text-xs py-0.5 px-2 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </Card>

          {/* Applied filters, so what is narrowing the list stays visible outside the drawer. */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => {
                    const next = { ...filters };
                    delete next[chip.key];
                    setFilters(next);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-900 bg-blue-50 border border-blue-200 rounded-full pl-2.5 pr-2 py-1 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {chip.label}
                  <X className="w-3 h-3" aria-hidden="true" />
                  <span className="sr-only">{t('standards.clearFilters')}</span>
                </button>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
                {t('standards.clearFilters')}
              </Button>
            </div>
          )}

          {loading ? (
            <StandardsSkeleton />
          ) : error ? (
            <SearchErrorState onRetry={handleSubmit} detail={error.message} />
          ) : !hasSearch ? (
            <SearchEmptyState
              onCategorySelect={(nextFilters) => setFilters(nextFilters)}
              onExampleSelect={(query) => setStandardsQuery(query)}
            />
          ) : (
            <div className="space-y-6">
              {product && (
                <ProductIdentificationCard product={product} onUpdate={handleProductUpdate} />
              )}

              {results.length === 0 ? (
                <NoResultsState
                  query={debouncedQuery}
                  suggestions={meta?.suggestions ?? []}
                  onSuggestion={(suggestion) => setStandardsQuery(suggestion)}
                  onAskAssistant={() =>
                    navigate(`/ask?q=${encodeURIComponent(debouncedQuery)}`)
                  }
                  onTryAnother={handleClear}
                  hiddenByFilters={hiddenByFilters}
                  onClearFilters={() => setFilters({})}
                />
              ) : (
                <>
                  {primary.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        {t('standards.recommendedTitle')}
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs py-0.5 px-2 rounded-full">
                          {primary.length}
                        </span>
                      </h2>
                      <div className="space-y-4">{primary.map(renderCard)}</div>
                    </div>
                  )}

                  {alternatives.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
                        {t('standards.potentialTitle')}
                        <span className="ml-2 bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full">
                          {alternatives.length}
                        </span>
                      </h2>
                      <div className="space-y-4 opacity-90">{alternatives.map(renderCard)}</div>
                    </div>
                  )}

                  {meta && (
                    <div className="pt-2 flex flex-col items-center gap-2">
                      <p className="text-xs text-slate-500">
                        {t('standards.showing')} {results.length} {t('standards.of')} {meta.total}
                      </p>
                      {meta.hasMore && (
                        <Button
                          variant="outline"
                          onClick={handleLoadMore}
                          loading={loadingMore}
                          disabled={loadingMore}
                        >
                          {t('standards.loadMore')}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <WhyThesePanel
            topMatch={
              topMatch
                ? {
                    standardNumber: topMatch.standard.standardNumber,
                    title: topMatch.standard.title,
                    relevance: topMatch.relevance,
                    score: topMatch.relevanceScore,
                    signals: topMatch.matchSignals ?? []
                  }
                : undefined
            }
            resultCount={meta?.total ?? 0}
            onViewAnalysis={
              topMatch && debouncedQuery.trim() ? handleViewAnalysis : undefined
            }
          />

          {topMatch && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => handleViewSources(topMatch.standard)}
            >
              {t('standards.evidence.viewAllSources')}
            </Button>
          )}

          <Card className="p-5 bg-indigo-50 border-indigo-100 shadow-sm text-center">
            <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-bold text-indigo-900 mb-2">{t('standards.needHelp')}</h3>
            <p className="text-sm text-indigo-700 mb-4">{t('standards.needHelpDesc')}</p>
            <Button
              variant="primary"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() =>
                navigate(
                  debouncedQuery.trim()
                    ? `/ask?q=${encodeURIComponent(debouncedQuery.trim())}`
                    : '/ask'
                )
              }
            >
              {t('standards.askSmartGuide')}
            </Button>
          </Card>
        </div>
      </div>

      {/* Comparison tray — only present once something is selected. */}
      {compareIds.length > 0 && (
        <div className="sticky bottom-4 z-20 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-lg">
            <Columns3 className="w-4 h-4 text-blue-900 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-slate-700">
              {compareIds.length} {t('standards.compare.selected')}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCompare(true)}
              disabled={compareIds.length < 2}
              title={compareIds.length < 2 ? t('standards.compare.empty') : undefined}
            >
              {t('standards.compare.open')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>
              {t('standards.compare.clear')}
            </Button>
          </div>
        </div>
      )}

      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        resultCount={meta?.total}
      />

      <StandardComparison
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        standards={compared}
        onRemove={(standardId) => toggleCompare(standardId)}
        onViewStandard={(standardId) => {
          setShowCompare(false);
          handleViewStandard(standardId);
        }}
      />

      <AnalysisModal
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        analysis={analysis}
        loading={analysisLoading}
      />

      <SourceDrawer
        isOpen={showEvidence}
        onClose={() => setShowEvidence(false)}
        standardLabel={evidenceLabel}
        evidence={evidence}
        loading={evidenceLoading}
      />

      {/* Announced for screen readers while a follow-up page loads in the background. */}
      {loadingMore && (
        <span className="sr-only" role="status">
          <Loader2 className="w-4 h-4" aria-hidden="true" />
          {t('common.loading')}
        </span>
      )}
    </div>
  );
}
