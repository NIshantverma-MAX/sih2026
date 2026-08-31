import React from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import type { LatestVersionInfo } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils/helpers';

/**
 * Where a standard sits in its revision history.
 *
 * The dataset records a status and a revision, not a revision chain, so this never claims
 * a newer version exists. When BIS records the standard as under revision or withdrawn,
 * the call to action is an honest external check against the BIS catalogue; an internal
 * "View Latest" only appears when a superseding standard is actually in the dataset.
 */
export interface LatestVersionBadgeProps {
  info: LatestVersionInfo;
  /** Current revision label, e.g. "IS 17526 : 2021". */
  revisionLabel?: string;
  onViewLatest?: (standardId: string) => void;
  className?: string;
}

const STATE_STYLES: Record<LatestVersionInfo['state'], string> = {
  current: 'bg-green-50 border-green-200 text-green-900',
  'under-revision': 'bg-amber-50 border-amber-200 text-amber-900',
  withdrawn: 'bg-red-50 border-red-200 text-red-900'
};

export const LatestVersionBadge: React.FC<LatestVersionBadgeProps> = ({
  info,
  revisionLabel,
  onViewLatest,
  className
}) => {
  const { t } = useTranslation();
  const isCurrent = info.state === 'current';
  const Icon = isCurrent ? CheckCircle2 : AlertTriangle;

  const noteKey =
    info.state === 'under-revision'
      ? 'standards.version.underRevisionNote'
      : info.state === 'withdrawn'
        ? 'standards.version.withdrawnNote'
        : null;

  return (
    <div className={cn('rounded-lg border p-3', STATE_STYLES[info.state], className)}>
      <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">
            {t(`standards.version.${info.state}`)}
            {revisionLabel && <span className="ml-2 font-normal font-mono">{revisionLabel}</span>}
          </p>

          {noteKey && <p className="text-xs mt-1 opacity-90">{t(noteKey)}</p>}

          {info.supersededBy && (
            <p className="text-xs mt-1.5">
              {t('standards.version.supersededBy')}{' '}
              <span className="font-mono font-medium">{info.supersededBy.standardNumber}</span>
            </p>
          )}

          {/* Internal navigation only when a replacement genuinely exists in the dataset. */}
          {info.supersededBy && onViewLatest && (
            <button
              type="button"
              onClick={() => onViewLatest(info.supersededBy!.id)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded"
            >
              {t('standards.version.viewLatest')}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}

          {!isCurrent && !info.supersededBy && (
            <a
              href={info.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded"
            >
              {t('standards.version.checkLatest')}
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
