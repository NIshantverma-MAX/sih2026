import React from 'react';
import { ShieldAlert, ShieldCheck, HelpCircle, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CertificationRequirement } from '../../types';
import { getCertificationSources } from '../../data/certificationSources';
import { GlossaryChip } from './GlossaryChip';

export interface RequirementVerdictCardProps {
  requirement: CertificationRequirement;
}

const STYLES = {
  mandatory: {
    icon: ShieldAlert,
    wrapper: 'border-red-200 bg-red-50',
    iconClass: 'text-red-600',
    heading: 'text-red-900',
    body: 'text-red-800',
    badge: 'error' as const,
    badgeLabel: 'Mandatory'
  },
  voluntary: {
    icon: ShieldCheck,
    wrapper: 'border-green-200 bg-green-50',
    iconClass: 'text-green-600',
    heading: 'text-green-900',
    body: 'text-green-800',
    badge: 'success' as const,
    badgeLabel: 'Voluntary'
  },
  'needs-verification': {
    icon: HelpCircle,
    wrapper: 'border-amber-200 bg-amber-50',
    iconClass: 'text-amber-600',
    heading: 'text-amber-900',
    body: 'text-amber-800',
    badge: 'warning' as const,
    badgeLabel: 'Check required'
  }
};

/**
 * Answers "do I have to get certified?" — and says "needs verification" rather than
 * guessing when the applicable Quality Control Order cannot be confirmed.
 */
export const RequirementVerdictCard: React.FC<RequirementVerdictCardProps> = ({ requirement }) => {
  const style = STYLES[requirement.verdict];
  const Icon = style.icon;
  const sources = getCertificationSources(requirement.sourceIds);

  return (
    <Card className={`p-5 ${style.wrapper}`}>
      <div className="flex gap-4">
        <Icon className={`mt-0.5 h-6 w-6 flex-shrink-0 ${style.iconClass}`} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h2 className={`text-base font-bold ${style.heading}`}>{requirement.headline}</h2>
            <Badge variant={style.badge}>{style.badgeLabel}</Badge>
          </div>

          <p className={`text-sm leading-relaxed ${style.body}`}>{requirement.reason}</p>

          <p className={`mt-3 text-sm leading-relaxed ${style.body}`}>
            BIS certification is voluntary unless a <GlossaryChip termKey="qco" /> makes it compulsory for your
            product.
          </p>

          {requirement.qcoNote && (
            <p className="mt-3 rounded-md border border-white/70 bg-white/70 p-3 text-sm leading-relaxed text-gray-700">
              {requirement.qcoNote}
            </p>
          )}

          <a
            href={requirement.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
          >
            {requirement.verifyLabel}
            <ExternalLink className="h-4 w-4" />
          </a>

          {sources.length > 0 && (
            <p className="mt-3 text-xs text-gray-600">
              Source:{' '}
              {sources.map((source, index) => (
                <React.Fragment key={source.id}>
                  {index > 0 && ' · '}
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                    {source.title}
                  </a>
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
