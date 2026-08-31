import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

export interface SearchErrorStateProps {
  onRetry: () => void;
  /** Underlying message, shown as supporting detail rather than as the headline. */
  detail?: string;
}

/**
 * Search failed. Localised, and always offers a retry — the shared `ErrorState` hardcodes
 * its "Try Again" label in English, which would break the Hindi journey.
 */
export const SearchErrorState: React.FC<SearchErrorStateProps> = ({ onRetry, detail }) => {
  const { t } = useTranslation();

  return (
    <Card className="p-8 text-center" role="alert">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-slate-900 mb-2">{t('standards.errorTitle')}</h2>
      <p className="text-slate-600 max-w-md mx-auto">{t('standards.errorDesc')}</p>
      {detail && <p className="text-xs text-slate-500 mt-2 font-mono break-words">{detail}</p>}
      <Button variant="primary" icon={RotateCcw} className="mt-6" onClick={onRetry}>
        {t('common.retry')}
      </Button>
    </Card>
  );
};
