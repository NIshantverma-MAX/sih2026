import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, IndianRupee } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import { CertificationStepper } from '../components/common/CertificationStepper';
import {
  CertificationContextBar,
  ChecklistPanel,
  JourneyStageDetail,
  NeedHelpPanel,
  OfficialSourcesPanel,
  ProgressPanel,
  RequirementVerdictCard,
  SchemeCard,
  StartContextPanel,
  WarningsPanel
} from '../components/certification';
import { getCertificationPlan } from '../services/certificationService';
import { useTranslation } from '../hooks/useTranslation';
import { CertificationPlan, CertificationStep, ManufacturingLocation } from '../types';

/**
 * Certification Guide.
 *
 * The page is contextual: it takes the product/standard the user already chose earlier in
 * their journey (`?standardId=`, `?product=`) and builds the plan around it. With no
 * context it asks for the product instead of printing certification steps for an imagined
 * one. The seven-stage stepper is a navigation model only — the content inside each stage
 * comes from the scheme and the standard, via `getCertificationPlan`.
 */
export default function Certification() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const standardId = searchParams.get('standardId') ?? undefined;
  // `q` is accepted so a hand-off from search still lands with context; it is read here
  // only as a product hint and never written back to any shared search state.
  const product = searchParams.get('product') ?? searchParams.get('q') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const stepParam = Number(searchParams.get('step') ?? '1');

  const [plan, setPlan] = useState<CertificationPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [location, setLocation] = useState<ManufacturingLocation>('india');

  const [activeIndex, setActiveIndex] = useState(0);
  const [completedStageKeys, setCompletedStageKeys] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const loadPlan = useCallback(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    getCertificationPlan({ standardId, product, category, location })
      .then((result) => {
        if (cancelled) return;
        setPlan(result);
        // Progress is per-plan: a different product is a different journey.
        setCompletedStageKeys([]);
        setCheckedItems([]);
        setActiveIndex(
          Number.isFinite(stepParam) && stepParam >= 1 && stepParam <= result.stages.length ? stepParam - 1 : 0
        );
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // stepParam is read once per load on purpose; step changes are handled locally below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardId, product, category, location]);

  useEffect(loadPlan, [loadPlan]);

  const stages = useMemo(() => plan?.stages ?? [], [plan]);
  const activeStage = stages[activeIndex];

  const stepperSteps = useMemo<CertificationStep[]>(
    () =>
      stages.map((stage, index) => ({
        step: stage.step,
        title: stage.title,
        description: stage.plainQuestion,
        checklist: stage.checklist,
        documents: stage.documents,
        status: completedStageKeys.includes(stage.key)
          ? 'completed'
          : index === activeIndex
            ? 'current'
            : 'upcoming'
      })),
    [stages, completedStageKeys, activeIndex]
  );

  const completedIndexes = useMemo(
    () => stages.map((stage, index) => (completedStageKeys.includes(stage.key) ? index : -1)).filter((i) => i >= 0),
    [stages, completedStageKeys]
  );

  const goToStep = (index: number) => {
    if (index < 0 || index >= stages.length) return;
    setActiveIndex(index);
    const next = new URLSearchParams(searchParams);
    next.set('step', String(index + 1));
    setSearchParams(next, { replace: true });
  };

  const toggleStageComplete = () => {
    if (!activeStage) return;
    setCompletedStageKeys((prev) =>
      prev.includes(activeStage.key) ? prev.filter((k) => k !== activeStage.key) : [...prev, activeStage.key]
    );
  };

  const toggleChecklistItem = (itemId: string) => {
    setCheckedItems((prev) => (prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]));
  };

  const handleDescribeProduct = (value: string) => {
    navigate(`/certification?product=${encodeURIComponent(value)}`);
  };

  const handleChangeProduct = () => {
    navigate('/certification');
  };

  const contextQuery = plan?.context.standard
    ? `${plan.context.standard.standardNumber} certification`
    : plan?.context.productName
      ? `${plan.context.productName} BIS certification`
      : undefined;

  const stageWarnings = activeStage?.warnings ?? [];
  const allWarnings = [...(plan?.warnings ?? []), ...stageWarnings];

  const header = (
    <>
      <Breadcrumbs
        items={[
          { label: t('certification.breadcrumbHome'), href: '/' },
          { label: t('certification.breadcrumbCurrent') }
        ]}
      />
      <PageHeader title={t('certification.title')} subtitle={t('certification.subtitle')} />
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <SkeletonCard />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (hasError || !plan) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState
          title={t('certification.errorTitle')}
          description={t('certification.errorDesc')}
          onRetry={loadPlan}
        />
      </div>
    );
  }

  // No standard means no honest answer on requirement, scheme or tests — so ask for the
  // product instead of showing certification information we cannot stand behind.
  if (!plan.context.standard) {
    return (
      <div className="space-y-6">
        {header}
        <StartContextPanel
          productName={plan.context.productName}
          suggestedStandards={plan.context.suggestedStandards}
          onDescribeProduct={handleDescribeProduct}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* No step detail is shown in this state, so list every source in full. */}
            <OfficialSourcesPanel sourceIds={plan.sourceIds} limit={plan.sourceIds.length} />
          </div>
          <NeedHelpPanel contextQuery={contextQuery} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      <CertificationContextBar
        context={plan.context}
        location={location}
        onLocationChange={setLocation}
        onChangeProduct={handleChangeProduct}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RequirementVerdictCard requirement={plan.requirement} />

          <SchemeCard scheme={plan.scheme} confidence={plan.schemeConfidence} reason={plan.schemeReason} />

          <Card className="p-4">
            <div className="mb-2 px-2">
              <h2 className="text-sm font-bold text-gray-900">{t('certification.journeyTitle')}</h2>
              <p className="text-xs text-gray-600">{t('certification.journeyHint')}</p>
            </div>
            <CertificationStepper
              steps={stepperSteps}
              activeStep={activeIndex}
              completedSteps={completedIndexes}
              onStepClick={goToStep}
            />
            {(plan.timeline || plan.fees) && (
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 px-2 pt-3 text-xs text-gray-600">
                {plan.timeline && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {t('certification.indicativeTimeline')}{' '}
                    <span className="font-medium text-gray-900">{plan.timeline}</span>
                  </span>
                )}
                {plan.fees && (
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                    {t('certification.indicativeCost')} <span className="font-medium text-gray-900">{plan.fees}</span>
                  </span>
                )}
                <span className="text-gray-500">{t('certification.estimateNote')}</span>
              </div>
            )}
          </Card>

          {activeStage && (
            <JourneyStageDetail
              stage={activeStage}
              totalStages={stages.length}
              isComplete={completedStageKeys.includes(activeStage.key)}
              onPrev={activeIndex > 0 ? () => goToStep(activeIndex - 1) : undefined}
              onNext={activeIndex < stages.length - 1 ? () => goToStep(activeIndex + 1) : undefined}
              onToggleComplete={toggleStageComplete}
            />
          )}
        </div>

        <div className="space-y-6">
          <ProgressPanel
            stages={stages}
            activeIndex={activeIndex}
            completed={completedStageKeys}
            onSelect={goToStep}
          />
          {activeStage && (
            <ChecklistPanel stage={activeStage} checkedItems={checkedItems} onToggle={toggleChecklistItem} />
          )}
          <WarningsPanel warnings={allWarnings} />
          <OfficialSourcesPanel sourceIds={plan.sourceIds} />
          <NeedHelpPanel contextQuery={contextQuery} />
        </div>
      </div>
    </div>
  );
}
