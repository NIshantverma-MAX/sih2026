import {
  CertificationGuide,
  CertificationContext,
  CertificationJourneyStage,
  CertificationPlan,
  CertificationPlanRequest,
  CertificationRequirement,
  CertificationScheme,
  ConfidenceLevel,
  GlossaryTerm,
  SchemeCode,
  Standard,
  StandardRecommendation
} from '../types';
import { certificationGuides } from '../data/certifications';
import { certificationSchemes, schemeList } from '../data/certificationSchemes';
import { getStagesForScheme, unknownSchemeStages } from '../data/certificationStages';
import { glossary } from '../data/glossary';
import { getStandard, searchStandards, identifyProduct } from './standardsService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCertificationGuide(standardId: string): Promise<CertificationGuide | undefined> {
  await delay(800);
  return certificationGuides.find(c => c.standardId === standardId);
}

export async function getCertificationRequirements(standardId: string): Promise<string[]> {
  await delay(600);
  const guide = certificationGuides.find(c => c.standardId === standardId);
  return guide ? guide.steps.map(s => s.title) : [
    'Submit application form',
    'Pay required fees',
    'Factory inspection',
    'Sample testing in BIS recognized lab',
    'Grant of license'
  ];
}

export async function getQCOStatus(productCategory: string): Promise<{mandatory: boolean; qcoNumber?: string; effectiveDate?: string}> {
  await delay(500);
  const lowercaseCategory = productCategory.toLowerCase();
  
  if (lowercaseCategory.includes('toy') || lowercaseCategory.includes('electronics') || lowercaseCategory.includes('gold')) {
    return {
      mandatory: true,
      qcoNumber: 'QCO-' + Math.floor(Math.random() * 10000),
      effectiveDate: '2023-01-01'
    };
  }
  
  return {
    mandatory: false
  };
}

// ── Certification Guide 2.0 ──────────────────────────────────────────────────
// Contextual planning built on top of the data above. The three functions before
// this point are unchanged — they back the documented API contract.

export async function getSchemes(): Promise<CertificationScheme[]> {
  await delay(300);
  return schemeList;
}

export async function getGlossary(): Promise<GlossaryTerm[]> {
  await delay(200);
  return glossary;
}

/** Products BIS certifies through the Compulsory Registration Scheme (electronics / IT goods, solar PV). */
const CRS_HINTS = [
  'led', 'lamp', 'luminaire', 'electronic', 'electronics', 'it goods', 'adaptor', 'adapter',
  'power supply', 'battery', 'cell', 'mobile', 'phone', 'laptop', 'notebook', 'tablet',
  'set top box', 'printer', 'scanner', 'monitor', 'display', 'television', 'keyboard',
  'ups', 'inverter', 'solar', 'photovoltaic', 'amplifier', 'speaker', 'smart watch',
  'bluetooth', 'wireless', 'webcam', 'sewing machine'
];

const HALLMARKING_HINTS = ['gold', 'silver', 'jewellery', 'jewelry', 'hallmark', 'precious metal', 'bullion'];

interface SchemeDecision {
  code?: SchemeCode;
  confidence: ConfidenceLevel;
  reason: string;
}

/**
 * Pick the likely scheme from the product/standard context.
 *
 * This is a heuristic over mock data, so it never reports `confirmed` — the UI always
 * shows the reason and links the official compulsory-certification list so the user can
 * check the answer rather than take it on trust.
 */
function decideScheme(standard: Standard | undefined, haystack: string, location: string): SchemeDecision {
  if (location === 'outside-india') {
    return {
      code: 'fmcs',
      confidence: 'inferred',
      reason:
        'You told us the manufacturing unit is outside India, so BIS handles the application through the Foreign Manufacturers Certification Scheme (FMCS) rather than the domestic route.'
    };
  }

  if (!standard && !haystack.trim()) {
    return {
      code: undefined,
      confidence: 'unknown',
      reason: 'We cannot suggest a scheme until we know the product or the applicable Indian Standard.'
    };
  }

  if (HALLMARKING_HINTS.some((hint) => haystack.includes(hint))) {
    return {
      code: 'hallmarking',
      confidence: 'inferred',
      reason:
        'Your product looks like a precious metal article. These are not handled through the product certification schemes — jewellers register with BIS and articles are hallmarked at an Assaying and Hallmarking Centre.'
    };
  }

  if (CRS_HINTS.some((hint) => haystack.includes(hint))) {
    return {
      code: 'scheme-ii',
      confidence: 'inferred',
      reason:
        'Your product looks like an electronics or IT product. BIS certifies these through the Compulsory Registration Scheme (CRS) — testing in a BIS-recognised lab first, then registration with a unique R-number, instead of a factory licence. Confirm your product against the Scheme-II compulsory certification list.'
    };
  }

  return {
    code: 'scheme-i',
    confidence: 'inferred',
    reason: standard
      ? `${standard.standardNumber} is a product standard of the kind BIS normally certifies under Scheme-I — a factory licence to use the ISI mark. Confirm your product against the Scheme-I compulsory certification list before you plan around it.`
      : 'Most manufactured goods are certified under Scheme-I — a factory licence to use the ISI mark. Confirm your product against the Scheme-I compulsory certification list.'
  };
}

function buildRequirement(standard: Standard | undefined, scheme: CertificationScheme | undefined): CertificationRequirement {
  const verifyLabel = 'Check the official BIS list';
  const verifyUrl =
    scheme?.productListUrl ??
    'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/';

  if (!standard) {
    return {
      verdict: 'needs-verification',
      headline: 'Requirement needs verification',
      reason:
        'We do not yet know which Indian Standard applies to your product, so we cannot tell you whether certification is compulsory. Identify the standard first, then check it against the compulsory certification lists.',
      verifyUrl,
      verifyLabel,
      sourceIds: ['SRC-COMPULSORY', 'SRC-KNOW-YOUR-STANDARD']
    };
  }

  if (standard.certificationStatus === 'mandatory') {
    return {
      verdict: 'mandatory',
      headline: 'Certification is mandatory for this product',
      reason: `${standard.standardNumber} is recorded in SmartGuide as covered by compulsory certification. That means the product cannot be manufactured, imported, sold or stored for sale unless it conforms to the standard and carries the BIS mark.`,
      qcoNote:
        'SmartGuide does not hold the QCO notification number and effective date for this standard. Confirm both on the official BIS list before you rely on the date — QCOs are amended and their implementation dates are extended.',
      verifyUrl,
      verifyLabel: 'View the applicable QCO / official list',
      sourceIds: ['SRC-COMPULSORY', 'SRC-QCO-UPCOMING', 'SRC-QCO-GUIDANCE']
    };
  }

  if (standard.certificationStatus === 'voluntary') {
    return {
      verdict: 'voluntary',
      headline: 'Certification is voluntary for this product',
      reason: `${standard.standardNumber} is not recorded as covered by a Quality Control Order, so certifying against it is your commercial choice. Many buyers, tenders and export customers still ask for it.`,
      qcoNote:
        'Voluntary today does not mean voluntary tomorrow. Check the upcoming-QCO list — a notified order can make this standard compulsory from a future date.',
      verifyUrl: 'https://www.bis.gov.in/upcoming-qcos-notified-and-due-for-implementation/',
      verifyLabel: 'Check upcoming QCOs',
      sourceIds: ['SRC-COMPULSORY', 'SRC-QCO-UPCOMING']
    };
  }

  return {
    verdict: 'needs-verification',
    headline: 'Requirement needs verification',
    reason: `${standard.standardNumber} is recorded in SmartGuide as applied on a self-declaration basis. Whether that is legally compulsory for your product depends on the notification covering it, which we cannot confirm from the data we hold.`,
    qcoNote: 'Check the compulsory certification lists and the upcoming-QCO list for your exact product before deciding.',
    verifyUrl,
    verifyLabel,
    sourceIds: ['SRC-COMPULSORY', 'SRC-QCO-UPCOMING']
  };
}

/** Route a curated guide step to the journey stage it belongs to. Order matters. */
function stageKeyForCuratedStep(title: string): string | undefined {
  const t = title.toLowerCase();
  if (t.includes('in-house') || t.includes('facility')) return 'prepare';
  if (t.includes('grant') || t.includes('licen')) return 'certificate';
  if (t.includes('scrutiny') || t.includes('inspection') || t.includes('audit') || t.includes('assess')) return 'assessment';
  if (t.includes('standard') || t.includes('identify')) return 'standard';
  if (t.includes('qco') || t.includes('mandatory')) return 'requirement';
  if (t.includes('test') || t.includes('lab') || t.includes('sample')) return 'testing';
  if (t.includes('apply') || t.includes('application') || t.includes('portal') || t.includes('registration')) return 'application';
  return undefined;
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Layer product/standard specifics onto the scheme's stage template.
 * The template supplies the BIS process; the standard and the curated guide supply
 * what is specific to this product.
 */
function contextualiseStages(
  template: CertificationJourneyStage[],
  standard: Standard | undefined,
  guide: CertificationGuide | undefined
): CertificationJourneyStage[] {
  return template.map((stage) => {
    const next: CertificationJourneyStage = {
      ...stage,
      checklist: [...stage.checklist],
      documents: [...stage.documents],
      actions: [...stage.actions],
      warnings: [...stage.warnings],
      facts: [...stage.facts]
    };

    if (standard) {
      if (stage.key === 'standard') {
        next.checklist.unshift(`Your standard: ${standard.standardNumber} — ${standard.title}`);
        next.actions.unshift({ label: 'View standard details', to: `/standards/${standard.id}` });
        if (standard.status === 'under-revision') {
          next.warnings.unshift(
            `${standard.standardNumber} is recorded as under revision. Confirm the current revision on the BIS portal before you build to it.`
          );
        }
        if (standard.status === 'withdrawn') {
          next.warnings.unshift(
            `${standard.standardNumber} is recorded as withdrawn. Find the standard that supersedes it before going any further.`
          );
        }
      }

      if (stage.key === 'prepare' && standard.keyRequirements.length > 0) {
        next.checklist.push(
          ...standard.keyRequirements.map((req) => `From ${standard.standardNumber}: ${req}`)
        );
      }

      if (stage.key === 'testing') {
        next.checklist.unshift(`Run the tests specified in ${standard.standardNumber} for your product`);
        next.actions.unshift({ label: `Find labs for ${standard.standardNumber}`, to: '/labs' });
      }
    }

    if (guide) {
      const curated = guide.steps.filter((step) => stageKeyForCuratedStep(step.title) === stage.key);
      if (curated.length > 0) {
        next.checklist.push(...curated.flatMap((step) => step.checklist));
        next.documents.push(...curated.flatMap((step) => step.documents));
      }
    }

    next.checklist = dedupe(next.checklist);
    next.documents = dedupe(next.documents);
    next.warnings = dedupe(next.warnings);
    return next;
  });
}

/**
 * Suggest standards for a described product.
 *
 * `searchStandards` now expands the query with the keywords `identifyProduct` derives from
 * it, so a phrase a manufacturer would actually type ("LED bulb" against "Self-Ballasted
 * LED Lamps") resolves inside the search service. This used to re-run the search once per
 * keyword to work around that; the retry is gone rather than duplicated here.
 */
function suggestStandards(matches: StandardRecommendation[]): StandardRecommendation[] {
  return matches.slice(0, 3);
}

/**
 * Build the contextual certification plan for a product / standard.
 *
 * Everything it returns is either taken from the cited official source, taken from the
 * project's standards data, or explicitly marked as needing verification. It never
 * invents a QCO number, a fee or a date.
 */
export async function getCertificationPlan(request: CertificationPlanRequest): Promise<CertificationPlan> {
  const location = request.location ?? 'india';

  const standard = request.standardId ? await getStandard(request.standardId) : undefined;

  let context: CertificationContext;
  if (standard) {
    context = {
      origin: 'standard',
      standard,
      productName: request.product,
      productCategory: request.category ?? standard.category
    };
  } else if (request.product) {
    const [identified, search] = await Promise.all([
      identifyProduct(request.product),
      searchStandards(request.product)
    ]);
    context = {
      origin: 'product',
      productName: identified.name,
      productCategory: request.category ?? identified.category,
      suggestedStandards: suggestStandards(search.results)
    };
  } else {
    context = { origin: 'none' };
    await delay(200);
  }

  const haystack = [
    standard?.title,
    standard?.category,
    standard?.sector,
    standard?.description,
    context.productName,
    context.productCategory,
    request.product,
    request.category
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const decision = decideScheme(standard, haystack, location);
  const scheme = decision.code ? certificationSchemes[decision.code] : undefined;
  const requirement = buildRequirement(standard, scheme);

  const guide = standard ? certificationGuides.find((c) => c.standardId === standard.id) : undefined;
  const template = decision.code ? getStagesForScheme(decision.code) : unknownSchemeStages;
  const stages = contextualiseStages(template, standard, guide);

  const warnings: string[] = [];
  if (!standard) {
    warnings.push('No Indian Standard is selected yet, so this guidance is generic. Identify your standard to get product-specific steps.');
  }
  if (decision.confidence !== 'confirmed' && scheme) {
    warnings.push(
      `The scheme shown is our best match, not a BIS determination. Confirm your product against the ${scheme.name} list on bis.gov.in.`
    );
  }
  if (guide) {
    warnings.push('Timeline and fee figures below are indicative planning estimates held in SmartGuide, not a BIS quotation. Confirm current fees on the BIS fee page.');
  }

  const sourceIds = dedupe([
    ...requirement.sourceIds,
    ...(scheme?.sourceIds ?? []),
    ...stages.flatMap((s) => s.sourceIds)
  ]);

  return {
    context,
    requirement,
    scheme,
    schemeConfidence: decision.confidence,
    schemeReason: decision.reason,
    stages,
    timeline: guide?.estimatedTimeline,
    fees: guide?.fees,
    curatedGuideId: guide?.id,
    warnings,
    sourceIds
  };
}
