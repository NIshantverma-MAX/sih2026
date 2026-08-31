import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * The Standards page's own search input.
 *
 * The value is owned by the page (`standardsQuery`) and passed in — deliberately not read
 * from a shared store. The header search and the Home hero keep their own state, so typing
 * here never changes what those inputs show, and vice versa.
 */
export interface StandardsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  /** Shown while a search is in flight. */
  busy?: boolean;
}

export const StandardsSearch: React.FC<StandardsSearchProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  busy = false
}) => {
  const { t } = useTranslation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex gap-2" role="search">
      <div className="flex-1 relative">
        <label htmlFor="standards-search" className="sr-only">
          {t('standards.searchLabel')}
        </label>
        <Input
          id="standards-search"
          type="search"
          placeholder={t('standards.searchPlaceholder')}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full pr-9"
          autoComplete="off"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label={t('standards.clearSearch')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" icon={Search} loading={busy}>
        {t('standards.search')}
      </Button>
    </form>
  );
};
