import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CertificationScheme, ConfidenceLevel } from '../../types';
import { getCertificationSource, getCertificationSources } from '../../data/certificationSources';
import { ActionLink } from './ActionLink';

export interface SchemeCardProps {
  scheme?: CertificationScheme;
  confidence: ConfidenceLevel;
  reason: string;
}

const CONFIDENCE_BADGE: Record<ConfidenceLevel, { variant: 'success' | 'warning' | 'default'; label: string }> = {
  confirmed: { variant: 'success', label: 'Confirmed against BIS' },
  inferred: { variant: 'warning', label: 'Best match — verify' },
  unknown: { variant: 'default', label: 'Not determined yet' }
};

/**
 * Answers "which scheme applies to me, and why?" — with the reasoning shown, because a
 * scheme picked from product keywords is a starting point, not a BIS determination.
 */
export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, confidence, reason }) => {
  const [expanded, setExpanded] = useState(false);
  const badge = CONFIDENCE_BADGE[confidence];

  if (!scheme) {
    return (
      <Card className="p-5">
        <div className="flex gap-4">
          <Info className="mt-0.5 h-6 w-6 flex-shrink-0 text-gray-400" />
          <div>
            <h2 className="text-base font-bold text-gray-900">Certification scheme not determined</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{reason}</p>
            <ActionLink to="/standards" variant="primary" className="mt-4">
              Find applicable standard
            </ActionLink>
          </div>
        </div>
      </Card>
    );
  }

  const sources = getCertificationSources(scheme.sourceIds);

  return (
    <Card className="p-5">
      <div className="flex gap-4">
        <Award className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-900" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h2 className="text-base font-bold text-gray-900">{scheme.name}</h2>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="text-sm text-gray-500">{scheme.plainName}</p>

          <div className="mt-4 rounded-md bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">Why this scheme</p>
            <p className="mt-1 text-sm leading-relaxed text-blue-900">{reason}</p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            <span className="font-semibold text-gray-900">In plain words: </span>
            {scheme.inPlainWords}
          </p>

          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">What you end up with</dt>
              <dd className="text-sm text-gray-900">{scheme.markName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Legal basis</dt>
              <dd className="text-sm text-gray-900">{scheme.legalBasis}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900 hover:underline"
          >
            {expanded ? 'Hide scheme details' : 'View scheme details'}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {expanded && (
            <div className="mt-4 space-y-5 border-t border-gray-100 pt-4">
              <div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">Who it applies to</h3>
                <p className="text-sm leading-relaxed text-gray-700">{scheme.appliesTo}</p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold text-gray-900">How the scheme works</h3>
                <ol className="space-y-2">
                  {scheme.howItWorks.map((item, index) => (
                    <li key={index} className="flex gap-3 text-sm text-gray-700">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-900">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {scheme.keyFacts.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-bold text-gray-900">What BIS states</h3>
                  <ul className="space-y-3">
                    {scheme.keyFacts.map((fact, index) => {
                      const source = getCertificationSource(fact.sourceId);
                      return (
                        <li key={index} className="rounded-md border border-gray-200 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{fact.label}</p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-800">{fact.value}</p>
                          {source && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-blue-900 hover:underline"
                            >
                              {source.title}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {sources.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-bold text-gray-900">Official pages for this scheme</h3>
                  <ul className="space-y-1.5">
                    {sources.map((source) => (
                      <li key={source.id}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-blue-900 hover:underline"
                        >
                          {source.title}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
            {scheme.internalRoute ? (
              <ActionLink to={scheme.internalRoute} variant="primary">
                Go to {scheme.name}
              </ActionLink>
            ) : (
              <ActionLink href={scheme.applyPortalUrl} variant="primary">
                {scheme.applyPortalLabel}
              </ActionLink>
            )}
            {scheme.productListUrl && (
              <ActionLink href={scheme.productListUrl}>Check if your product is listed</ActionLink>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
