import React from 'react';
import { Link2, ChevronRight } from 'lucide-react';
import type { RelatedStandard } from '../../types';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';

export interface RelatedStandardsProps {
  related: RelatedStandard[];
  onSelect: (standardId: string) => void;
}

/**
 * Standards related to the one being viewed.
 *
 * Each entry states how the relation was arrived at. `declared` comes from the BIS record;
 * the ICS-group and category relations are this prototype's grouping over shared
 * classification, which the note below makes explicit so nothing is attributed to BIS
 * that BIS did not declare.
 *
 * Each row is a `<button>`, not a clickable `<div>`, so it is reachable by keyboard.
 */
export const RelatedStandards: React.FC<RelatedStandardsProps> = ({ related, onSelect }) => {
  const { t } = useTranslation();

  const hasDerived = related.some((item) => item.basis !== 'declared');

  return (
    <Card className="p-5">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
        {t('standards.related.title')}
      </h2>

      {related.length === 0 ? (
        <p className="text-sm text-slate-600">{t('standards.related.none')}</p>
      ) : (
        <>
          <ul className="space-y-2">
            {related.map((item) => (
              <li key={item.standard.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.standard.id)}
                  className="w-full text-left rounded-lg border border-slate-200 p-3 hover:border-blue-400 hover:bg-blue-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block font-mono text-xs font-semibold text-blue-900">
                        {item.standard.standardNumber}
                      </span>
                      <span className="block text-sm text-slate-800 mt-0.5">
                        {item.standard.title}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1">
                        {t(`standards.related.basis.${item.basis}`)}
                        {item.basisDetail && ` · ${item.basisDetail}`}
                      </span>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {hasDerived && (
            <p className="text-xs text-slate-500 mt-3">{t('standards.related.basisNote')}</p>
          )}
        </>
      )}
    </Card>
  );
};
