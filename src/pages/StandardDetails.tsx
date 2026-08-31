import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileQuestion, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import {
  getStandard,
  getRelatedStandards,
  getLatestVersion,
  getStandardSources,
  searchStandards,
  BIS_CATALOGUE_URL
} from '../services/standardsService';
import type {
  LatestVersionInfo,
  RelatedStandard,
  Standard,
  StandardEvidence,
  StandardRecommendation
} from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { EvidenceCard } from '../components/standards/EvidenceCard';
import { LatestVersionBadge } from '../components/standards/LatestVersionBadge';
import { RelatedStandards } from '../components/standards/RelatedStandards';
import { StandardActionBar } from '../components/standards/StandardActionBar';
import { RelevanceExplanation } from '../components/common/RelevanceExplanation';

const CERT_BADGE_VARIANT: Record<Standard['certificationStatus'], 'warning' | 'info' | 'default'> =
  {
    mandatory: 'warning',
    voluntary: 'info',
    'self-declaration': 'default'
  };

const STATUS_BADGE_VARIANT: Record<Standard['status'], 'success' | 'error' | 'warning'> = {
  active: 'success',
  withdrawn: 'error',
  'under-revision': 'warning'
};

/**
 * One standard, in full.
 *
 * Receives only the id from the route and loads everything else through
 * `standardsService`, so the same page works whether the user arrived from a search, a
 * saved item, a related-standard link or a pasted URL.
 *
 * When the visit came from a search, the search string travels in history state. That lets
 * the page explain why *this* standard was recommended for *that* query — the explanation
 * is re-derived from the same service that ranked the list, never re-invented here.
 */
export default function StandardDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const fromSearch = (location.state as { from?: string } | null)?.from ?? '';
  const originQuery = new URLSearchParams(fromSearch).get('q') ?? '';

  /**
   * Loaded data is stamped with the id it was loaded for, and read back only when the stamp
   * still matches. Related-standard links change `:id` without remounting the page, so
   * holding the data unstamped would render one standard's sources under another's title
   * for as long as the next request takes.
   */
  interface LoadedStandard {
    key: string;
    standard: Standard | undefined;
    related: RelatedStandard[];
    version: LatestVersionInfo | null;
    evidence: StandardEvidence | null;
  }

  const [loaded, setLoaded] = useState<LoadedStandard | null>(null);
  const [failure, setFailure] = useState<{ key: string; error: Error } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [recommendationFor, setRecommendationFor] = useState<{
    key: string;
    value: StandardRecommendation | null;
  } | null>(null);

  const key = id ?? '';
  const current = loaded?.key === key ? loaded : null;
  const error = failure?.key === key ? failure.error : null;
  const loading = !current && !error;

  const standard = current?.standard ?? null;
  const related = current?.related ?? [];
  const version = current?.version ?? null;
  const evidence = current?.evidence ?? null;

  useEffect(() => {
    if (!id) return;
    let active = true;

    Promise.all([
      getStandard(id),
      getRelatedStandards(id),
      getLatestVersion(id),
      getStandardSources(id)
    ])
      .then(([standardData, relatedData, versionData, evidenceData]) => {
        if (!active) return;
        setLoaded({
          key: id,
          standard: standardData,
          related: relatedData,
          version: versionData,
          evidence: evidenceData
        });
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setFailure({
          key: id,
          error: caught instanceof Error ? caught : new Error('Failed to load standard')
        });
      });

    return () => {
      active = false;
    };
  }, [id, attempt]);

  const retry = useCallback(() => {
    setFailure(null);
    setAttempt((previous) => previous + 1);
  }, []);

  // The originating search, re-run so this standard's own match reasons can be shown.
  // Nothing is fabricated: if the standard is not in that result set, the panel stays away.
  useEffect(() => {
    if (!id || !originQuery.trim()) return;
    let active = true;
    const stamp = `${id}|${originQuery}`;

    searchStandards(originQuery, undefined, { pageSize: 50 })
      .then((result) => {
        if (!active) return;
        setRecommendationFor({
          key: stamp,
          value: result.results.find((item) => item.standard.id === id) ?? null
        });
      })
      .catch(() => {
        if (active) setRecommendationFor({ key: stamp, value: null });
      });

    return () => {
      active = false;
    };
  }, [id, originQuery]);

  const recommendation =
    recommendationFor?.key === `${key}|${originQuery}` ? recommendationFor.value : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-8 w-32" />
        <SkeletonCard className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard className="h-64 lg:col-span-2" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center" role="alert">
        <h2 className="text-lg font-bold text-slate-900 mb-2">{t('standards.errorTitle')}</h2>
        <p className="text-sm text-slate-600 mb-4">{error.message}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="primary" onClick={retry}>
            {t('common.retry')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/standards')}>
            {t('standards.backToStandards')}
          </Button>
        </div>
      </Card>
    );
  }

  if (!standard) {
    return (
      <EmptyState
        icon={FileQuestion}
        title={t('standards.notFoundStandard')}
        description={t('standards.notFoundStandardDesc')}
        action={t('standards.backToStandards')}
        onAction={() => navigate('/standards')}
      />
    );
  }

  const tabs = [
    {
      id: 'scope',
      label: t('standardDetails.scope'),
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">{t('standardDetails.scope')}</h3>
          <p className="text-slate-700 leading-relaxed">{standard.description}</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
            <h4 className="font-medium text-slate-900 mb-2">{t('standardDetails.techScope')}</h4>
            <p className="text-slate-700">{standard.scope}</p>
          </div>
        </div>
      )
    },
    {
      id: 'requirements',
      label: t('standardDetails.extractedRequirements'),
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {t('standardDetails.extractedRequirements')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('standardDetails.requirementsNote')}
            </p>
          </div>
          <ul className="space-y-3">
            {standard.keyRequirements.length > 0 ? (
              standard.keyRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-slate-700">{requirement}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">{t('standardDetails.noRequirements')}</li>
            )}
          </ul>
        </div>
      )
    }
  ];

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: t('standards.standardNumber'), value: standard.standardNumber },
    { label: t('standardDetails.revision'), value: standard.revision },
    { label: t('standardDetails.year'), value: standard.year },
    { label: t('standardDetails.category'), value: standard.category },
    { label: t('standardDetails.sector'), value: standard.sector },
    {
      label: t('standardDetails.icsCode'),
      value: <span className="font-mono">{standard.icsCode}</span>
    },
    {
      label: t('standardDetails.certificationRequirement'),
      value: t(`standards.certLabelShort.${standard.certificationStatus}`)
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs
        items={[
          { label: t('standards.breadcrumbHome'), href: '/' },
          { label: t('standards.breadcrumbStandards'), href: `/standards${fromSearch}` },
          { label: standard.standardNumber }
        ]}
      />

      {/* Returns to the exact result list — same query, filters and sort — not a bare page. */}
      <button
        type="button"
        onClick={() => navigate(`/standards${fromSearch}`)}
        className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      >
        <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
        {fromSearch ? t('standards.backToResults') : t('standards.backToStandards')}
      </button>

      {version && (
        <LatestVersionBadge
          info={version}
          revisionLabel={standard.revision}
          onViewLatest={(standardId) => navigate(`/standards/${standardId}`)}
        />
      )}

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-900">{standard.standardNumber}</h1>
          <Badge variant={STATUS_BADGE_VARIANT[standard.status]}>
            {t(`standards.statusLabel.${standard.status}`)}
          </Badge>
          {/*
            Three certification states exist in the dataset, so all three are named. This
            previously read "voluntary" for self-declaration, which is a different obligation
            and would mislead a manufacturer.
          */}
          <Badge variant={CERT_BADGE_VARIANT[standard.certificationStatus]}>
            {t(`standards.certLabel.${standard.certificationStatus}`)}
          </Badge>
        </div>
        <h2 className="text-xl text-slate-700 font-medium">{standard.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Tabs tabs={tabs} />
          </Card>

          {/*
            Sources held for this standard specifically. This used to render the first two
            documents of the shared source list regardless of the standard on screen, which
            attributed other standards' documents to this one. `EvidenceCard` carries its own
            heading, so none is added here.
          */}
          <Card className="p-6">
            {evidence ? (
              <EvidenceCard evidence={evidence} />
            ) : (
              <>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  {t('standardDetails.officialSources')}
                </h3>
                <p className="text-sm text-slate-600">{t('standards.evidence.note.none')}</p>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bookmarking lives inside the action bar, so the page carries one save control. */}
          <StandardActionBar
            standard={standard}
            onCertification={() => navigate(`/certification?standardId=${standard.id}`)}
            onFindLabs={() => navigate(`/labs?standardId=${standard.id}`)}
            onAsk={() => navigate(`/ask?standardId=${standard.id}`)}
          />

          {recommendation && (
            <RelevanceExplanation
              matchReasons={recommendation.matchReasons}
              matchSignals={recommendation.matchSignals}
              relevance={recommendation.relevance}
              relevanceScore={recommendation.relevanceScore}
              evidence={evidence}
            />
          )}

          <Card className="p-6 bg-slate-50 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">
              {t('standardDetails.atAGlance')}
            </h3>
            <dl className="space-y-3 text-sm">
              {facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-3">
                  <dt className="text-slate-500 flex-shrink-0">{fact.label}</dt>
                  <dd className="font-medium text-slate-900 text-right">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {/*
              A real link to the official catalogue. The button here was previously inert and
              claimed to open the full standard, which this prototype cannot do.
            */}
            <a
              href={BIS_CATALOGUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              {t('standards.version.checkLatest')}
            </a>
            <p className="text-xs text-slate-500 text-center mt-2">
              {t('standards.version.verifyNote')}
            </p>
          </Card>

          <RelatedStandards
            related={related}
            onSelect={(standardId) =>
              navigate(`/standards/${standardId}`, { state: { from: fromSearch } })
            }
          />
        </div>
      </div>
    </div>
  );
}
