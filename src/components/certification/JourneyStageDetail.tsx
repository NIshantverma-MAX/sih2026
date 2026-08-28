import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  HelpCircle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CertificationJourneyStage, ConfidenceLevel } from '../../types';
import { getCertificationSource, getCertificationSources } from '../../data/certificationSources';
import { GlossaryChip } from './GlossaryChip';
import { ActionLink } from './ActionLink';

export interface JourneyStageDetailProps {
  stage: CertificationJourneyStage;
  totalStages: number;
  isComplete: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onToggleComplete: () => void;
}

const CONFIDENCE: Record<ConfidenceLevel, { variant: 'success' | 'warning' | 'default'; label: string; note: string }> = {
  confirmed: {
    variant: 'success',
    label: 'From official BIS sources',
    note: 'The statements in this step come from the BIS pages cited below.'
  },
  inferred: {
    variant: 'warning',
    label: 'Assembled from BIS sources',
    note: 'This step is put together from the BIS sources cited below rather than quoted from one instruction. Check the sources before you commit money or time.'
  },
  unknown: {
    variant: 'default',
    label: 'Read the official source',
    note: 'BIS publishes this step inside a document we cannot quote here. We would rather point you at it than fill in a plausible answer.'
  }
};

/** Terms worth explaining at each stage, so jargon is never left unexplained. */
const STAGE_TERMS: Record<string, string[]> = {
  standard: ['ics-code'],
  requirement: ['qco', 'conformity-assessment'],
  prepare: ['product-manual', 'sit', 'cbtf'],
  testing: ['recognised-lab', 'sit'],
  application: ['manakonline', 'bis-licence'],
  assessment: ['surveillance'],
  certificate: ['isi-mark', 'standard-mark', 'r-number', 'marking-fee']
};

/**
 * The detail for the stage the user is currently on: what this stage is, why it matters,
 * what BIS states about it, what documents it needs, and what to do next.
 */
export const JourneyStageDetail: React.FC<JourneyStageDetailProps> = ({
  stage,
  totalStages,
  isComplete,
  onPrev,
  onNext,
  onToggleComplete
}) => {
  const confidence = CONFIDENCE[stage.confidence];
  const sources = getCertificationSources(stage.sourceIds);
  const terms = (STAGE_TERMS[stage.key] ?? []).slice(0, 4);

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-blue-900 px-3 py-1 text-xs font-bold text-white">
          Step {stage.step} of {totalStages}
        </span>
        <Badge variant={confidence.variant}>{confidence.label}</Badge>
        {isComplete && (
          <Badge variant="success">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Marked done
          </Badge>
        )}
      </div>

      <h2 className="text-xl font-bold text-gray-900">{stage.title}</h2>

      <div className="mt-4 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-900" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">The question at this step</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-blue-900">{stage.plainQuestion}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Why this matters</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">{stage.whyItMatters}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-700">{stage.description}</p>

      {terms.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md bg-gray-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Terms here</span>
          {terms.map((key) => (
            <span key={key} className="text-sm">
              <GlossaryChip termKey={key} />
            </span>
          ))}
        </div>
      )}

      {stage.facts.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            What BIS states
          </h3>
          <ul className="space-y-3">
            {stage.facts.map((fact, index) => {
              const source = getCertificationSource(fact.sourceId);
              return (
                <li key={index} className="rounded-md border border-gray-200 bg-gray-50 p-3">
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

      {stage.documents.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
            <FileText className="h-4 w-4 text-gray-500" />
            Documents you will need at this step
          </h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {stage.documents.map((doc, index) => (
              <li key={index} className="flex gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="leading-relaxed">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stage.actions.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold text-gray-900">Do this next</h3>
          <div className="flex flex-wrap gap-3">
            {stage.actions.map((action, index) =>
              action.to ? (
                <ActionLink key={index} to={action.to} variant={index === 0 ? 'primary' : 'outline'}>
                  {action.label}
                </ActionLink>
              ) : (
                <ActionLink key={index} href={action.href} variant={index === 0 ? 'primary' : 'outline'}>
                  {action.label}
                </ActionLink>
              )
            )}
          </div>
        </div>
      )}

      <p className="mt-6 rounded-md bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600">{confidence.note}</p>

      {sources.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sources for this step</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {sources.map((source, index) => (
              <React.Fragment key={source.id}>
                {index > 0 && ' · '}
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                  {source.title}
                </a>
              </React.Fragment>
            ))}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
        <Button variant="outline" size="sm" icon={ArrowLeft} onClick={onPrev} disabled={!onPrev}>
          Previous step
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button variant={isComplete ? 'secondary' : 'outline'} size="sm" icon={CheckCircle2} onClick={onToggleComplete}>
            {isComplete ? 'Marked as done' : 'Mark this step done'}
          </Button>
          <Button variant="primary" size="sm" onClick={onNext} disabled={!onNext}>
            Next step
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
