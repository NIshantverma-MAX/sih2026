import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import type { SearchFilters, StandardsSortOption } from '../../types';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { getStandardsFacets } from '../../services/standardsService';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils/helpers';
import { countActiveFilters, localizedFilterValue } from './filterSummary';

export interface StandardsFiltersProps {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  sort: StandardsSortOption;
  onSortChange: (sort: StandardsSortOption) => void;
  /** Sort belongs beside the search bar on desktop, inside the drawer on mobile. */
  includeSort?: boolean;
  className?: string;
}

/**
 * Filters over the standards catalogue.
 *
 * Every option comes from `getStandardsFacets()`, i.e. it is tallied from the dataset, so
 * a filter can never offer a value that matches nothing. Each control is a labelled
 * `<Select>` rather than a bare `<select>`, which is what makes it reachable by name.
 */
export const StandardsFilters: React.FC<StandardsFiltersProps> = ({
  filters,
  onChange,
  sort,
  onSortChange,
  includeSort = false,
  className
}) => {
  const { t } = useTranslation();
  const facets = useMemo(() => getStandardsFacets(), []);

  const set = (key: keyof SearchFilters, value: string | boolean | undefined) => {
    const next: SearchFilters = { ...filters };
    if (value === '' || value === false || value === undefined) {
      delete next[key];
    } else {
      // The facet values are the dataset's own literals, so the cast is safe here and
      // keeps `SearchFilters` strongly typed for every consumer.
      (next as Record<string, unknown>)[key] = value;
    }
    onChange(next);
  };

  const activeCount = countActiveFilters(filters);

  const label = (group: string, value: string) => localizedFilterValue(t, group, value);

  const withCount = (option: { value: string; count: number }, group?: string) => ({
    value: option.value,
    label: `${group ? label(group, option.value) : option.value} (${option.count})`
  });

  return (
    <div className={cn('space-y-4', className)}>
      {activeCount > 0 && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600">
            {activeCount} {t('standards.activeFilters')}
          </span>
          <Button variant="ghost" size="sm" icon={X} onClick={() => onChange({})}>
            {t('standards.clearFilters')}
          </Button>
        </div>
      )}

      {includeSort && (
        <Select
          label={t('standards.sortLabel')}
          value={sort}
          onChange={(event) => onSortChange(event.target.value as StandardsSortOption)}
          options={[
            { value: 'relevance', label: t('standards.mostRelevant') },
            { value: 'latest', label: t('standards.recent') },
            { value: 'alphabetical', label: t('standards.az') },
            { value: 'standard-number', label: t('standards.standardNumber') }
          ]}
        />
      )}

      <Select
        label={t('standards.category')}
        value={filters.category ?? ''}
        onChange={(event) => set('category', event.target.value)}
        options={[
          { value: '', label: t('standards.allCategories') },
          ...facets.categories.map((option) => withCount(option, 'categoryLabel'))
        ]}
      />

      <Select
        label={t('standards.sector')}
        value={filters.sector ?? ''}
        onChange={(event) => set('sector', event.target.value)}
        options={[
          { value: '', label: t('standards.allSectors') },
          ...facets.sectors.map((option) => withCount(option, 'sectorLabel'))
        ]}
      />

      <Select
        label={t('standards.status')}
        value={filters.status ?? ''}
        onChange={(event) => set('status', event.target.value)}
        options={[
          { value: '', label: t('standards.allStatuses') },
          ...facets.statuses.map((option) => withCount(option, 'statusLabel'))
        ]}
      />

      <Select
        label={t('standards.relevanceFilter')}
        value={filters.relevance ?? ''}
        onChange={(event) => set('relevance', event.target.value)}
        options={[
          { value: '', label: t('standards.allRelevance') },
          { value: 'high', label: t('standards.relevance.high') },
          { value: 'medium', label: t('standards.relevance.medium') },
          { value: 'low', label: t('standards.relevance.low') }
        ]}
      />

      <Select
        label={t('standards.certification')}
        value={filters.certificationStatus ?? ''}
        onChange={(event) => set('certificationStatus', event.target.value)}
        options={[
          { value: '', label: t('standards.allCertification') },
          ...facets.certificationStatuses.map((option) => withCount(option, 'certLabelShort'))
        ]}
      />

      <div>
        <Select
          label={t('standards.icsGroup')}
          value={filters.icsGroup ?? ''}
          onChange={(event) => set('icsGroup', event.target.value)}
          options={[
            { value: '', label: t('standards.allIcs') },
            // Shown as bare ICS codes: the codes are real data, the field titles are not,
            // so no ICS subject name is invented here.
            ...facets.icsGroups.map((option) => ({
              value: option.value,
              label: `ICS ${option.value} (${option.count})`
            }))
          ]}
        />
        <p className="text-xs text-slate-500 mt-1">{t('standards.icsHint')}</p>
      </div>

      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.latestRevisionOnly)}
            onChange={(event) => set('latestRevisionOnly', event.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-2 focus:ring-blue-500"
          />
          <span>
            <span className="block text-sm font-medium text-slate-700">
              {t('standards.latestRevisionOnly')}
            </span>
            <span className="block text-xs text-slate-500">
              {t('standards.latestRevisionHint')}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};
