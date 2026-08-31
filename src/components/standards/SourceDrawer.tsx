import React from 'react';
import type { StandardEvidence } from '../../types';
import { Drawer } from '../ui/Drawer';
import { EvidenceCard } from './EvidenceCard';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * Evidence for a standard, in a drawer, so a card can offer "view all sources" without
 * navigating away from the result list.
 */
export interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Heading shown above the evidence, normally the standard number. */
  standardLabel?: string;
  evidence: StandardEvidence | null;
  loading?: boolean;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  isOpen,
  onClose,
  standardLabel,
  evidence,
  loading = false
}) => {
  const { t } = useTranslation();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('standards.evidence.title')} width="max-w-lg">
      <div className="space-y-4">
        {standardLabel && (
          <p className="text-sm font-mono font-semibold text-blue-900">{standardLabel}</p>
        )}

        {loading && <p className="text-sm text-gray-500">{t('common.loading')}</p>}

        {!loading && !evidence && (
          <p className="text-sm text-gray-600">{t('standards.evidence.note.none')}</p>
        )}

        {!loading && evidence && <EvidenceCard evidence={evidence} />}
      </div>
    </Drawer>
  );
};
