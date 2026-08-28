import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { getGlossaryTerm } from '../../data/glossary';
import { getCertificationSource } from '../../data/certificationSources';

export interface GlossaryChipProps {
  /** Key from src/data/glossary.ts, e.g. "qco". */
  termKey: string;
  /** Override the visible label; defaults to the glossary term. */
  label?: string;
}

/**
 * Renders a BIS term with a click-to-explain definition.
 *
 * The target reader knows their product, not BIS vocabulary, so every acronym the page
 * shows should be wrapped in one of these rather than left to be looked up elsewhere.
 */
export const GlossaryChip: React.FC<GlossaryChipProps> = ({ termKey, label }) => {
  const [open, setOpen] = useState(false);
  const term = getGlossaryTerm(termKey);

  if (!term) return <>{label ?? termKey}</>;

  const source = term.sourceId ? getCertificationSource(term.sourceId) : undefined;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 font-semibold text-blue-900 underline decoration-dotted decoration-blue-400 underline-offset-2 hover:text-blue-700"
      >
        {label ?? term.term}
        <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
      </button>

      {open && (
        <span className="absolute left-0 top-full z-20 mt-2 block w-80 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-lg">
          <span className="mb-1 flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-gray-900">
              {term.term}
              {term.expansion && <span className="font-normal text-gray-500"> — {term.expansion}</span>}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close explanation"
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
          <span className="block text-sm leading-relaxed text-gray-700">{term.plain}</span>
          {source && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-xs font-medium text-blue-900 hover:underline"
            >
              Source: {source.title}
            </a>
          )}
        </span>
      )}
    </span>
  );
};
