import type { SearchFilters } from '../../types';

/**
 * Reading the applied filters back to the user.
 *
 * These are pure functions rather than part of `StandardsFilters`, because the page needs the
 * active-filter count and chips outside the drawer the controls live in — the count sits on
 * the mobile filter button and the chips sit above the results. Keeping one definition means
 * a filter is never named one way in the drawer and another way in the summary.
 */

/** Filter keys the standards controls own, so "clear all" and the active count stay in step. */
const FILTER_KEYS: (keyof SearchFilters)[] = [
  'category',
  'sector',
  'status',
  'certificationStatus',
  'relevance',
  'icsGroup',
  'latestRevisionOnly'
];

export function countActiveFilters(filters: SearchFilters): number {
  return FILTER_KEYS.filter((key) => {
    const value = filters[key];
    return typeof value === 'boolean' ? value : Boolean(value);
  }).length;
}

/**
 * `t()` returns the key itself when nothing is registered. Falling back to the raw dataset
 * value keeps a new dataset entry readable instead of showing a dot-path.
 */
export function localizedFilterValue(
  t: (key: string) => string,
  group: string,
  value: string
): string {
  const key = `standards.${group}.${value}`;
  const translated = t(key);
  return translated === key ? value : translated;
}

export interface ActiveFilterChip {
  key: keyof SearchFilters;
  label: string;
}

/** The applied filters, as removable chips. */
export function describeActiveFilters(
  filters: SearchFilters,
  t: (key: string) => string
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.category) {
    chips.push({
      key: 'category',
      label: localizedFilterValue(t, 'categoryLabel', filters.category)
    });
  }
  if (filters.sector) {
    chips.push({ key: 'sector', label: localizedFilterValue(t, 'sectorLabel', filters.sector) });
  }
  if (filters.status) {
    chips.push({ key: 'status', label: localizedFilterValue(t, 'statusLabel', filters.status) });
  }
  if (filters.relevance) {
    chips.push({ key: 'relevance', label: t(`standards.relevance.${filters.relevance}`) });
  }
  if (filters.certificationStatus) {
    chips.push({
      key: 'certificationStatus',
      label: localizedFilterValue(t, 'certLabelShort', filters.certificationStatus)
    });
  }
  if (filters.icsGroup) {
    chips.push({ key: 'icsGroup', label: `ICS ${filters.icsGroup}` });
  }
  if (filters.latestRevisionOnly) {
    chips.push({ key: 'latestRevisionOnly', label: t('standards.latestRevisionOnly') });
  }

  return chips;
}
