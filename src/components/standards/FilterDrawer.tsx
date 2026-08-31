import React from 'react';
import type { SearchFilters, StandardsSortOption } from '../../types';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { StandardsFilters } from './StandardsFilters';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * The same filters, in a drawer, for narrow viewports — where a filter column beside the
 * results would either overflow or push the results off-screen.
 */
export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  sort: StandardsSortOption;
  onSortChange: (sort: StandardsSortOption) => void;
  /** Result count for the current filters, so the effect is visible before closing. */
  resultCount?: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  sort,
  onSortChange,
  resultCount
}) => {
  const { t } = useTranslation();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('standards.filtersTitle')}>
      <div className="space-y-5">
        <StandardsFilters
          filters={filters}
          onChange={onChange}
          sort={sort}
          onSortChange={onSortChange}
          includeSort
        />

        <div className="sticky bottom-0 bg-white pt-3 border-t border-slate-200">
          <Button variant="primary" className="w-full" onClick={onClose}>
            {resultCount === undefined
              ? t('common.close')
              : `${t('standards.showing')} ${resultCount}`}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
