import React from 'react';
import { FileText, ShieldCheck, Info } from 'lucide-react';
import type { StandardEvidence } from '../../types';
import { SourceCitation } from '../common/SourceCitation';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils/helpers';

/**
 * Source documents behind one standard.
 *
 * The three states are kept visibly distinct because they are different claims: a
 * clause-level citation quotes a specific clause, a document-only citation names a
 * document that references the standard, and a catalogue reference is only a pointer to
 * the standard's own entry. Presenting the last as evidence would overstate what is held.
 */
export interface EvidenceCardProps {
  evidence: StandardEvidence;
  className?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, className }) => {
  const { t } = useTranslation();
  const { citations, documentReference, hasClauseLevelEvidence, noteKey } = evidence;

  return (
    <section className={cn('space-y-3', className)} aria-label={t('standards.evidence.title')}>
      <div className="flex items-start gap-2">
        {hasClauseLevelEvidence ? (
          <ShieldCheck className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
        ) : (
          <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
        )}
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {t('standards.evidence.title')}
            {citations.length > 0 && (
              <span className="ml-2 font-normal text-xs text-gray-500">
                {citations.length} {t('standards.evidence.sourcesCount')}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            {t(`standards.evidence.note.${noteKey}`)}
          </p>
        </div>
      </div>

      {citations.length > 0 && (
        <div className="space-y-3">
          {citations.map((source) => (
            <SourceCitation key={source.id} source={source} showSnippet />
          ))}
        </div>
      )}

      {documentReference && (
        <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-white">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700">
                {t('standards.evidence.catalogueRef')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('standards.evidence.catalogueRefNote')}
              </p>
              <a
                href={documentReference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1.5 text-xs font-medium text-blue-900 underline underline-offset-2 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-900 rounded"
              >
                {t('standards.evidence.openDocument')} — {documentReference.documentName}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
