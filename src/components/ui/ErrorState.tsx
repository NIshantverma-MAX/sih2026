import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from '../../hooks/useTranslation';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  onRetry
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg bg-red-50 p-4 border border-red-100">
      <div className="flex flex-col items-center justify-center text-center py-8">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-sm font-medium text-red-800">{title ?? t('common.errorTitle')}</h3>
        <p className="mt-2 text-sm text-red-700 max-w-sm">{description ?? t('common.errorDesc')}</p>
        {onRetry && (
          <div className="mt-6">
            <Button onClick={onRetry} variant="danger" size="sm">
              {t('common.retry')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};