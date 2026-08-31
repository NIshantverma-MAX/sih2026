import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { Standard } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

export interface StandardComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  standards: Standard[];
  onRemove: (standardId: string) => void;
  onViewStandard: (standardId: string) => void;
}

/**
 * Side-by-side comparison of two or three standards.
 *
 * Deliberately a plain field-by-field table of values already held in the dataset — no
 * diffing, scoring or "recommended choice". Every row is a recorded fact, so the
 * comparison cannot assert anything BIS did not.
 */
export const StandardComparison: React.FC<StandardComparisonProps> = ({
  isOpen,
  onClose,
  standards,
  onRemove,
  onViewStandard
}) => {
  const { t } = useTranslation();

  const label = (group: string, value: string) => {
    const translated = t(`standards.${group}.${value}`);
    return translated === `standards.${group}.${value}` ? value : translated;
  };

  const rows: { label: string; render: (standard: Standard) => React.ReactNode }[] = [
    { label: t('standardDetails.category'), render: (s) => label('categoryLabel', s.category) },
    { label: t('standardDetails.sector'), render: (s) => label('sectorLabel', s.sector) },
    { label: t('standards.status'), render: (s) => label('statusLabel', s.status) },
    {
      label: t('standardDetails.certificationRequirement'),
      render: (s) => label('certLabelShort', s.certificationStatus)
    },
    { label: t('standardDetails.revision'), render: (s) => s.revision },
    { label: t('standardDetails.year'), render: (s) => s.year },
    { label: t('standardDetails.icsCode'), render: (s) => <span className="font-mono">{s.icsCode}</span> },
    {
      label: t('standardDetails.extractedRequirements'),
      render: (s) =>
        s.keyRequirements.length > 0 ? (
          <ul className="list-disc pl-4 space-y-0.5">
            {s.keyRequirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        ) : (
          <span className="text-slate-400">—</span>
        )
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('standards.compare.title')} size="lg">
      {standards.length < 2 ? (
        <p className="text-sm text-slate-600">{t('standards.compare.empty')}</p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[560px]">
              <caption className="sr-only">{t('standards.compare.title')}</caption>
              <thead>
                <tr>
                  <th scope="col" className="text-left align-bottom p-2 w-32 text-xs font-medium text-slate-500">
                    {t('standards.compare.field')}
                  </th>
                  {standards.map((standard) => (
                    <th
                      key={standard.id}
                      scope="col"
                      className="text-left align-bottom p-2 border-b-2 border-slate-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="block font-mono text-xs font-semibold text-blue-900">
                            {standard.standardNumber}
                          </span>
                          <span className="block font-medium text-slate-900 text-xs mt-0.5">
                            {standard.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(standard.id)}
                          aria-label={`${t('standards.compare.remove')}: ${standard.standardNumber}`}
                          className="flex-shrink-0 p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 align-top">
                    <th scope="row" className="text-left p-2 text-xs font-medium text-slate-500">
                      {row.label}
                    </th>
                    {standards.map((standard) => (
                      <td key={standard.id} className="p-2 text-slate-700">
                        {row.render(standard)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
            {standards.map((standard) => (
              <Button
                key={standard.id}
                variant="outline"
                size="sm"
                onClick={() => onViewStandard(standard.id)}
              >
                {standard.standardNumber}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            ))}
          </div>

          <p className="text-xs text-slate-500">{t('standards.prototypeNote')}</p>
        </div>
      )}
    </Modal>
  );
};
