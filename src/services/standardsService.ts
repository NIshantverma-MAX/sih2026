import type {
  Standard,
  SearchFilters,
  StandardRecommendation,
  ProductIdentification,
  MatchSignal,
  MatchSignalKey,
  RelevanceLevel,
  RelatedStandard,
  RecommendationAnalysis,
  SignalWeightExplanation,
  SourceCitation,
  StandardEvidence,
  StandardsSearchOptions,
  StandardsSearchResult,
  StandardsSortOption,
  LatestVersionInfo
} from '../types';
import { standards } from '../data/standards';
import { sources } from '../data/sources';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Where a user can confirm the current revision of a standard for themselves. */
export const BIS_CATALOGUE_URL = 'https://standardsbis.bsbedge.com/';
export const BIS_PORTAL_URL = 'https://www.bis.gov.in/';

const DEFAULT_PAGE_SIZE = 6;

// ---------------------------------------------------------------------------
// Scoring model
//
// Every number below is a fixed weight, so the same query always produces the same
// score. Nothing here is a BIS ranking rule — it is this prototype's own text-matching
// heuristic, and `getRecommendationAnalysis` publishes the whole table so the UI can
// show the user how a score was reached rather than asserting it.
// ---------------------------------------------------------------------------

/** Points for a match on the user's whole phrase, per field. */
const PHRASE_WEIGHTS: Record<MatchSignalKey, number> = {
  'standard-number': 60,
  title: 40,
  scope: 26,
  description: 20,
  requirement: 14,
  category: 14,
  sector: 10,
  'product-category': 14
};

/** Points for a match on a single term, per field. */
const TERM_WEIGHTS: Record<MatchSignalKey, number> = {
  'standard-number': 60,
  title: 30,
  scope: 14,
  description: 10,
  requirement: 7,
  category: 10,
  sector: 6,
  'product-category': 14
};

/** Fields a term is tested against, best-scoring field first. */
const TERM_FIELDS: MatchSignalKey[] = ['title', 'scope', 'description', 'category', 'requirement', 'sector'];

/** Extra points when a term shows up in three or more fields of the same standard. */
const CORROBORATION_BONUS = 6;
const CORROBORATION_MIN_FIELDS = 3;

/**
 * Only the strongest few terms score. A flat points ceiling was tried first and starved
 * the best match — "LED bulb" scored the LED lamp standard the same as a wall of weak
 * hits — whereas counting terms keeps a genuine match strong while still stopping a long
 * query from accumulating relevance out of many near-misses.
 */
const MAX_SCORING_TERMS = 3;

/**
 * Keywords the product rules added, rather than words the user typed, score at half
 * weight. Without this, searching "helmet" ranked safety footwear level with helmets,
 * because both matched the expanded keyword "protective".
 */
const EXPANDED_TERM_FACTOR = 0.5;

const MAX_SCORE = 99;
const HIGH_THRESHOLD = 55;
const MEDIUM_THRESHOLD = 25;

/**
 * Words that carry no signal in a standards search. Without this, "which BIS standard
 * applies to my LED bulb" matches half the dataset on "standard".
 */
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'which', 'what', 'that', 'this', 'from', 'into', 'about',
  'standard', 'standards', 'bis', 'indian', 'india', 'code', 'codes',
  'applies', 'apply', 'applicable', 'need', 'needs', 'needed', 'required', 'require',
  'manufacture', 'manufacturing', 'manufacturer', 'make', 'making', 'made', 'sell', 'selling',
  'use', 'used', 'using', 'usage', 'get', 'getting', 'want', 'looking', 'find',
  'certification', 'certified', 'certify', 'test', 'testing', 'tell', 'help',
  'can', 'how', 'does', 'not', 'are', 'was', 'were', 'have', 'has', 'had',
  'my', 'our', 'your', 'their', 'its', 'you', 'they', 'them'
]);

/** Single generic words that cannot identify a product. */
const AMBIGUOUS_QUERIES = new Set([
  'machine', 'machines', 'product', 'products', 'item', 'items', 'equipment', 'device',
  'devices', 'material', 'materials', 'goods', 'thing', 'things', 'part', 'parts', 'stuff'
]);

// ---------------------------------------------------------------------------
// Product interpretation
//
// Prototype rules, not an official BIS classification. `datasetCategories` only ever
// names categories that exist in src/data/standards.ts, so a match can be acted on.
// ---------------------------------------------------------------------------

interface ProductRule {
  /** Every token here must be present in the query. */
  all?: string[];
  /** At least one token here must be present. */
  any?: string[];
  name: string;
  /** Human-readable label shown to the user. */
  category: string;
  /** Categories that exist in the standards dataset. */
  datasetCategories: string[];
  material?: string;
  intendedUse?: string;
  keywords: string[];
  confidence: number;
}

const PRODUCT_RULES: ProductRule[] = [
  {
    all: ['water', 'bottle'],
    name: 'Stainless Steel Water Bottle',
    category: 'Household / Food contact articles',
    datasetCategories: ['Household'],
    material: 'Stainless steel',
    intendedUse: 'Drinking / storage',
    keywords: ['stainless', 'steel', 'water', 'bottle', 'flask'],
    confidence: 0.94
  },
  {
    any: ['flask', 'thermos'],
    name: 'Stainless Steel Vacuum Flask',
    category: 'Household / Food contact articles',
    datasetCategories: ['Household'],
    material: 'Stainless steel',
    intendedUse: 'Drinking / storage',
    keywords: ['stainless', 'steel', 'flask', 'bottle'],
    confidence: 0.88
  },
  {
    any: ['purifier', 'ro', 'purification'],
    name: 'Water Purifier',
    category: 'Household / Water treatment',
    datasetCategories: ['Household'],
    intendedUse: 'Drinking water treatment',
    keywords: ['water', 'purifier', 'osmosis', 'drinking'],
    confidence: 0.93
  },
  {
    any: ['led', 'lamp', 'lamps', 'bulb', 'bulbs', 'lighting'],
    name: 'LED Lamp / Bulb',
    category: 'Electrical / Lighting',
    datasetCategories: ['Electrical'],
    intendedUse: 'General lighting',
    keywords: ['led', 'lamp', 'bulb', 'lighting', 'electrical'],
    confidence: 0.94
  },
  {
    all: ['pressure', 'cooker'],
    name: 'Pressure Cooker',
    category: 'Household / Kitchen appliances',
    datasetCategories: ['Household'],
    intendedUse: 'Cooking',
    keywords: ['pressure', 'cooker', 'kitchen', 'cooking'],
    confidence: 0.95
  },
  {
    any: ['stove', 'burner', 'lpg'],
    name: 'Domestic Gas Stove',
    category: 'Household / Kitchen appliances',
    datasetCategories: ['Household'],
    intendedUse: 'Cooking with LPG',
    keywords: ['gas', 'stove', 'lpg', 'burner', 'domestic'],
    confidence: 0.9
  },
  {
    any: ['switch', 'switches', 'socket', 'sockets', 'plug', 'plugs'],
    name: 'Electrical Switch / Socket-Outlet',
    category: 'Electrical / Accessories',
    datasetCategories: ['Electrical'],
    intendedUse: 'Domestic wiring',
    keywords: ['switch', 'socket', 'plug', 'electrical', 'domestic'],
    confidence: 0.9
  },
  {
    any: ['cable', 'cables', 'wire', 'wires', 'wiring'],
    name: 'Insulated Cable / Wire',
    category: 'Electrical / Cables',
    datasetCategories: ['Electrical', 'Construction'],
    intendedUse: 'Power and lighting circuits',
    keywords: ['cable', 'wire', 'insulated', 'electrical'],
    confidence: 0.87
  },
  {
    any: ['helmet', 'helmets'],
    name: 'Protective Helmet',
    category: 'Consumer goods / Protective equipment',
    datasetCategories: ['Consumer Goods'],
    intendedUse: 'Head protection for two-wheeler riders',
    keywords: ['helmet', 'protective', 'safety'],
    confidence: 0.93
  },
  {
    any: ['toy', 'toys'],
    name: 'Toy',
    category: 'Consumer goods / Toys',
    datasetCategories: ['Consumer Goods'],
    intendedUse: 'Children up to 14 years',
    keywords: ['toy', 'safety', 'children'],
    confidence: 0.91
  },
  {
    any: ['footwear', 'shoe', 'shoes', 'boot', 'boots'],
    name: 'Safety Footwear',
    category: 'Consumer goods / Protective equipment',
    datasetCategories: ['Consumer Goods'],
    intendedUse: 'Protection against workplace hazards',
    keywords: ['footwear', 'safety', 'protective'],
    confidence: 0.88
  },
  {
    any: ['battery', 'batteries', 'cell', 'cells'],
    name: 'Dry Battery',
    category: 'Consumer goods / Batteries',
    datasetCategories: ['Consumer Goods'],
    keywords: ['battery', 'dry', 'cell'],
    confidence: 0.87
  },
  {
    any: ['cement'],
    name: 'Cement',
    category: 'Construction / Building materials',
    datasetCategories: ['Construction'],
    intendedUse: 'Construction',
    keywords: ['cement', 'portland', 'construction'],
    confidence: 0.95
  },
  {
    any: ['rebar', 'tmt'],
    name: 'Reinforcement Steel Bar',
    category: 'Construction / Building materials',
    datasetCategories: ['Construction'],
    material: 'Steel',
    intendedUse: 'Concrete reinforcement',
    keywords: ['steel', 'bar', 'deformed', 'reinforcement'],
    confidence: 0.9
  },
  {
    any: ['pipe', 'pipes', 'piping', 'hdpe'],
    name: 'Water Supply Pipe',
    category: 'Construction / Pipes',
    datasetCategories: ['Construction'],
    intendedUse: 'Water supply',
    keywords: ['pipe', 'polyethylene', 'water', 'supply'],
    confidence: 0.88
  },
  {
    any: ['honey'],
    name: 'Honey',
    category: 'Food and agriculture',
    datasetCategories: ['Food'],
    keywords: ['honey', 'extracted'],
    confidence: 0.92
  },
  {
    any: ['turmeric', 'haldi', 'spice', 'spices'],
    name: 'Turmeric / Spice',
    category: 'Food and agriculture',
    datasetCategories: ['Food'],
    keywords: ['turmeric', 'spice', 'ground'],
    confidence: 0.89
  },
  {
    any: ['packaged', 'mineral'],
    all: ['water'],
    name: 'Packaged Drinking Water',
    category: 'Food and agriculture',
    datasetCategories: ['Food'],
    intendedUse: 'Human consumption',
    keywords: ['packaged', 'drinking', 'water'],
    confidence: 0.93
  },
  {
    any: ['gold', 'jewellery', 'jewelry', 'silver', 'hallmark'],
    name: 'Gold / Silver Jewellery',
    category: 'Precious metals / Jewellery',
    // Nothing in the current dataset covers jewellery, so no category is claimed.
    datasetCategories: [],
    material: 'Gold',
    keywords: ['gold', 'jewellery', 'hallmarking', 'purity'],
    confidence: 0.9
  }
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Matches a term, tolerating a trailing plural on either side ("bulb" ↔ "bulbs"). */
function fieldContains(haystack: string, term: string): boolean {
  const text = haystack.toLowerCase();
  if (text.includes(term)) return true;
  if (term.endsWith('s') && term.length > 3 && text.includes(term.slice(0, -1))) return true;
  if (!term.endsWith('s') && text.includes(`${term}s`)) return true;
  return false;
}

/**
 * Interpret a free-text query as a product. Synchronous so `searchStandards` can use it
 * for keyword expansion without paying a second artificial delay.
 */
function analyzeProduct(query: string): ProductIdentification {
  const trimmed = query.trim();
  const tokens = tokenize(trimmed);
  const lowered = trimmed.toLowerCase();

  if (tokens.length === 1 && AMBIGUOUS_QUERIES.has(tokens[0])) {
    return {
      name: trimmed,
      category: 'Unknown',
      confidence: 0.1,
      keywords: [],
      isAmbiguous: true,
      identified: false,
      datasetCategories: []
    };
  }

  const tokenSet = new Set(tokens);
  const rule = PRODUCT_RULES.find((candidate) => {
    const allOk = !candidate.all || candidate.all.every((token) => tokenSet.has(token) || lowered.includes(token));
    const anyOk = !candidate.any || candidate.any.some((token) => tokenSet.has(token));
    return allOk && anyOk;
  });

  if (rule) {
    return {
      name: rule.name,
      category: rule.category,
      material: rule.material,
      intendedUse: rule.intendedUse,
      confidence: rule.confidence,
      keywords: rule.keywords,
      isAmbiguous: false,
      identified: true,
      datasetCategories: rule.datasetCategories
    };
  }

  // Nothing recognised: fall back to the user's own significant words rather than
  // guessing a category. Low confidence is reported honestly, and `identified: false`
  // stops the UI presenting an echo of the query as a product it recognised.
  const ownWords = tokens.filter((token) => token.length > 2 && !STOP_WORDS.has(token));
  return {
    name: trimmed,
    category: 'Not identified',
    confidence: ownWords.length > 0 ? 0.45 : 0.2,
    keywords: ownWords.slice(0, 5),
    isAmbiguous: false,
    identified: false,
    datasetCategories: []
  };
}

interface QueryAnalysis {
  raw: string;
  phrase: string;
  /** IS numbers found in the query, e.g. ["17526"]. */
  numberTokens: string[];
  /** Significant words typed by the user. */
  literalTerms: string[];
  /** Literal terms plus keywords expanded from the identified product. */
  terms: string[];
  product: ProductIdentification;
  isEmpty: boolean;
  /** The query is only a standard reference ("IS 17526"), so there is no product to name. */
  isNumberLookup: boolean;
}

function analyzeQuery(query: string): QueryAnalysis {
  const raw = query.trim();
  const phrase = raw.toLowerCase();
  const product = analyzeProduct(raw);

  const numberTokens: string[] = [];
  for (const match of phrase.matchAll(/\bis\s*[:\-\s]?\s*(\d{2,5})/g)) numberTokens.push(match[1]);
  if (numberTokens.length === 0) {
    for (const match of phrase.matchAll(/\b(\d{3,5})\b/g)) numberTokens.push(match[1]);
  }

  const literalTerms = tokenize(phrase).filter((token) => token.length > 2 && !STOP_WORDS.has(token) && !/^\d+$/.test(token));
  const expanded = product.keywords.flatMap((keyword) => tokenize(keyword)).filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  return {
    raw,
    phrase,
    numberTokens,
    literalTerms,
    terms: [...new Set([...literalTerms, ...expanded])],
    product,
    isEmpty: raw.length === 0,
    isNumberLookup: numberTokens.length > 0 && literalTerms.length === 0
  };
}

/** Digits of a standard number, e.g. "IS 16102 (Part 1): 2012" → ["16102", "1", "2012"]. */
function standardNumberDigits(standardNumber: string): string[] {
  return standardNumber.match(/\d+/g) ?? [];
}

/** The primary IS number, ignoring part and year — "IS 16102 (Part 1): 2012" → "16102". */
function primaryStandardNumber(standardNumber: string): string {
  const match = standardNumber.match(/\d+/);
  return match ? match[0] : '';
}

function fieldValue(standard: Standard, key: MatchSignalKey): string {
  switch (key) {
    case 'title':
      return standard.title;
    case 'scope':
      return standard.scope;
    case 'description':
      return standard.description;
    case 'category':
      return standard.category;
    case 'sector':
      return standard.sector;
    case 'requirement':
      return standard.keyRequirements?.join(' ') ?? '';
    default:
      return '';
  }
}

interface ScoredStandard {
  score: number;
  signals: MatchSignal[];
}

function scoreStandard(standard: Standard, analysis: QueryAnalysis): ScoredStandard {
  if (analysis.isEmpty) return { score: 0, signals: [] };

  const signals: MatchSignal[] = [];
  let score = 0;

  // 1. A standard number in the query is decisive — match it against the number only,
  //    never against the whole record (the old code treated any numeric query as a
  //    direct hit on every standard).
  if (analysis.numberTokens.length > 0) {
    const digits = standardNumberDigits(standard.standardNumber);
    const primary = primaryStandardNumber(standard.standardNumber);
    const hit = analysis.numberTokens.find((token) => token === primary) ??
      analysis.numberTokens.find((token) => digits.includes(token));
    if (hit) {
      signals.push({ key: 'standard-number', term: standard.standardNumber, weight: TERM_WEIGHTS['standard-number'] });
      score += TERM_WEIGHTS['standard-number'];
    }
  }

  // 2. Whole-phrase matches, strongest field only. Worth more than isolated words
  //    because "pressure cooker" appearing intact is a far better signal than either word.
  const phraseFields: MatchSignalKey[] = ['title', 'scope', 'description', 'category', 'sector'];
  const phraseMatchedFields = new Set<MatchSignalKey>();
  if (analysis.literalTerms.length > 1) {
    for (const key of phraseFields) {
      if (fieldValue(standard, key).toLowerCase().includes(analysis.phrase)) {
        signals.push({ key, term: analysis.raw, weight: PHRASE_WEIGHTS[key] });
        score += PHRASE_WEIGHTS[key];
        phraseMatchedFields.add(key);
        break;
      }
    }
  }

  // 3. Term-level matches: each term scores once, on its best-scoring field, and only the
  //    strongest few count.
  const termSignals: MatchSignal[] = [];
  for (const term of analysis.terms) {
    const hitFields = TERM_FIELDS.filter((key) => fieldContains(fieldValue(standard, key), term));
    if (hitFields.length === 0) continue;

    const bestField = hitFields.find((key) => !phraseMatchedFields.has(key));
    if (!bestField) continue;

    let weight = TERM_WEIGHTS[bestField];
    if (hitFields.length >= CORROBORATION_MIN_FIELDS) weight += CORROBORATION_BONUS;
    if (!analysis.literalTerms.includes(term)) weight = Math.round(weight * EXPANDED_TERM_FACTOR);
    if (weight <= 0) continue;

    termSignals.push({ key: bestField, term, weight });
  }
  termSignals.sort((a, b) => b.weight - a.weight);
  for (const signal of termSignals.slice(0, MAX_SCORING_TERMS)) {
    signals.push(signal);
    score += signal.weight;
  }

  // 4. The product category inferred from the query matching this standard's category is
  //    an inference about the product, not a text match, so it is reported separately.
  if (analysis.product.datasetCategories?.includes(standard.category)) {
    signals.push({ key: 'product-category', term: standard.category, weight: PHRASE_WEIGHTS['product-category'] });
    score += PHRASE_WEIGHTS['product-category'];
  }

  return { score: Math.min(score, MAX_SCORE), signals };
}

/**
 * Fields that say something about what the standard actually covers. A standard whose only
 * match is its category or sector is just a catalogue sibling, not a search result — those
 * belong in Related Standards on the detail page, and listing them here made a helmet
 * query return dry batteries with nothing to say for itself.
 */
const CONTENT_SIGNALS: MatchSignalKey[] = ['standard-number', 'title', 'scope', 'description', 'requirement'];

function hasContentSignal(signals: MatchSignal[]): boolean {
  return signals.some((signal) => CONTENT_SIGNALS.includes(signal.key));
}

function relevanceFor(score: number): RelevanceLevel {
  if (score >= HIGH_THRESHOLD) return 'high';
  if (score >= MEDIUM_THRESHOLD) return 'medium';
  return 'low';
}

function matchTypeFor(relevance: RelevanceLevel): 'primary' | 'alternative' | 'related' {
  if (relevance === 'high') return 'primary';
  if (relevance === 'medium') return 'alternative';
  return 'related';
}

/**
 * English rendering of a signal, kept for `matchReasons` because the assistant and the
 * documented API contract both consume that field. The UI localises from `matchSignals`.
 */
function renderSignal(signal: MatchSignal): string {
  switch (signal.key) {
    case 'standard-number':
      return `Standard number matches "${signal.term}"`;
    case 'title':
      return `Title covers "${signal.term}"`;
    case 'scope':
      return `Official scope mentions "${signal.term}"`;
    case 'description':
      return `Description mentions "${signal.term}"`;
    case 'requirement':
      return `A key requirement mentions "${signal.term}"`;
    case 'category':
      return `Category matches "${signal.term}"`;
    case 'sector':
      return `BIS sector matches "${signal.term}"`;
    case 'product-category':
      return `Product interpreted from your query falls in the "${signal.term}" category`;
  }
}

function toRecommendation(standard: Standard, scored: ScoredStandard, isEmptyQuery: boolean): StandardRecommendation {
  const relevance = relevanceFor(scored.score);
  const signals = [...scored.signals].sort((a, b) => b.weight - a.weight);

  return {
    standard,
    relevanceScore: scored.score,
    relevance,
    matchType: isEmptyQuery ? 'related' : matchTypeFor(relevance),
    matchReasons: isEmptyQuery ? ['Listed because it matches the filters you selected'] : signals.map(renderSignal),
    // Only cite documents that are actually recorded against this standard.
    evidenceIds: standard.sourceIds.length > 0 ? [...standard.sourceIds] : undefined,
    matchSignals: signals
  };
}

function compareStandardNumbers(a: Standard, b: Standard): number {
  const numA = Number(primaryStandardNumber(a.standardNumber)) || 0;
  const numB = Number(primaryStandardNumber(b.standardNumber)) || 0;
  if (numA !== numB) return numA - numB;
  return a.standardNumber.localeCompare(b.standardNumber);
}

function sortRecommendations(items: StandardRecommendation[], sort: StandardsSortOption): StandardRecommendation[] {
  const sorted = [...items];
  switch (sort) {
    case 'latest':
      sorted.sort((a, b) => b.standard.year - a.standard.year || b.relevanceScore - a.relevanceScore);
      break;
    case 'alphabetical':
      sorted.sort((a, b) => a.standard.title.localeCompare(b.standard.title));
      break;
    case 'standard-number':
      sorted.sort((a, b) => compareStandardNumbers(a.standard, b.standard));
      break;
    case 'relevance':
    default:
      sorted.sort((a, b) => b.relevanceScore - a.relevanceScore || compareStandardNumbers(a.standard, b.standard));
      break;
  }
  return sorted;
}

/** The first two segments of an ICS code, e.g. "77.140.20" → "77.140". */
export function icsGroupOf(icsCode: string): string {
  return icsCode.split('.').slice(0, 2).join('.');
}

/** A record that carries no real content and should not be presented as a BIS fact. */
function isPlaceholder(standard: Standard): boolean {
  return standard.icsCode === '00.000.00' || /placeholder/i.test(standard.title);
}

function passesFilters(item: StandardRecommendation, filters?: SearchFilters): boolean {
  if (!filters) return true;
  const { standard } = item;

  if (filters.category && standard.category !== filters.category) return false;
  if (filters.sector && standard.sector !== filters.sector) return false;
  if (filters.status && standard.status !== filters.status) return false;
  if (filters.certificationStatus && standard.certificationStatus !== filters.certificationStatus) return false;
  if (filters.relevance && item.relevance !== filters.relevance) return false;
  if (filters.icsGroup && icsGroupOf(standard.icsCode) !== filters.icsGroup) return false;
  if (filters.latestRevisionOnly && standard.status !== 'active') return false;

  return true;
}

/** Queries worth offering when a search returns nothing. Every one resolves in this dataset. */
const FALLBACK_SUGGESTIONS = ['Water purifier', 'LED bulb', 'Pressure cooker', 'Stainless steel bottle'];

function buildSuggestions(analysis: QueryAnalysis): string[] {
  // Prefer titles that share a word with the query — a near miss is more useful than a
  // generic example.
  const nearMisses = standards
    .filter((standard) => !isPlaceholder(standard))
    .filter((standard) => analysis.terms.some((term) => fieldContains(standard.title, term)))
    .slice(0, 3)
    .map((standard) => standard.title);

  return [...new Set([...nearMisses, ...FALLBACK_SUGGESTIONS])].slice(0, 4);
}

/**
 * Search the standards catalogue.
 *
 * Returns a paged envelope shaped after `GET /standards` so this mock can be swapped for
 * an HTTP client without the UI changing. Scoring is deterministic: the same query and
 * filters always produce the same scores and the same order.
 */
export async function searchStandards(
  query: string,
  filters?: SearchFilters,
  options?: StandardsSearchOptions
): Promise<StandardsSearchResult> {
  await delay(600);

  const analysis = analyzeQuery(query);
  const page = Math.max(1, options?.page ?? 1);
  const pageSize = Math.max(1, options?.pageSize ?? DEFAULT_PAGE_SIZE);
  const sort = options?.sort ?? filters?.sortBy ?? 'relevance';

  const scored: StandardRecommendation[] = [];
  for (const standard of standards) {
    const result = scoreStandard(standard, analysis);
    // With a query, keep only standards that matched on what they actually cover. Without
    // one the user is browsing by filter, so everything is a candidate.
    if (!analysis.isEmpty && !hasContentSignal(result.signals)) continue;
    scored.push(toRecommendation(standard, result, analysis.isEmpty));
  }

  const filtered = scored.filter((item) => passesFilters(item, filters));
  const ordered = sortRecommendations(filtered, sort);
  const start = (page - 1) * pageSize;
  const pageItems = ordered.slice(start, start + pageSize);

  return {
    query: analysis.raw,
    // No product claim for a bare standard-number lookup — the user named the standard,
    // not a product, and there is nothing to interpret.
    product: analysis.isEmpty || analysis.isNumberLookup ? null : analysis.product,
    results: pageItems,
    total: ordered.length,
    totalBeforeFilters: scored.length,
    page,
    pageSize,
    hasMore: start + pageSize < ordered.length,
    suggestions: ordered.length === 0 && !analysis.isEmpty ? buildSuggestions(analysis) : []
  };
}

export async function getStandard(id: string): Promise<Standard | undefined> {
  await delay(400);
  return standards.find((standard) => standard.id === id);
}

/**
 * Interpret a free-text query as a product.
 *
 * Prototype interpretation: the confidence is this heuristic's own, not a validated
 * measurement, and callers must label it that way.
 */
export async function identifyProduct(query: string): Promise<ProductIdentification> {
  await delay(500);
  return analyzeProduct(query);
}

/**
 * Standards related to the given one, each labelled with how the relation was derived.
 *
 * Declared relations come first, then a shared ICS subject group, then a shared category.
 * Nothing here asserts that BIS declared two standards related unless the dataset says so.
 */
export async function getRelatedStandards(id: string, limit = 4): Promise<RelatedStandard[]> {
  await delay(400);
  const current = standards.find((standard) => standard.id === id);
  if (!current) return [];

  const others = standards.filter((standard) => standard.id !== id && !isPlaceholder(standard));
  const picked = new Map<string, RelatedStandard>();

  for (const relatedId of current.relatedStandardIds) {
    const match = others.find((standard) => standard.id === relatedId);
    if (match) picked.set(match.id, { standard: match, basis: 'declared', basisDetail: current.standardNumber });
  }

  const group = icsGroupOf(current.icsCode);
  if (!isPlaceholder(current)) {
    for (const standard of others) {
      if (picked.size >= limit) break;
      if (picked.has(standard.id)) continue;
      if (icsGroupOf(standard.icsCode) === group) {
        picked.set(standard.id, { standard, basis: 'same-ics-group', basisDetail: group });
      }
    }
  }

  for (const standard of others) {
    if (picked.size >= limit) break;
    if (picked.has(standard.id)) continue;
    if (standard.category === current.category) {
      picked.set(standard.id, { standard, basis: 'same-category', basisDetail: current.category });
    }
  }

  return [...picked.values()].slice(0, limit);
}

/**
 * Documents backing a standard.
 *
 * `citations` are curated records from src/data/sources.ts, several of which carry a real
 * clause or section. `documentReference` is only a pointer to the standard's own catalogue
 * entry — it is not clause-level evidence, and `noteKey` tells the UI which case it is in
 * so an unsourced standard is shown as unsourced rather than dressed up.
 */
export async function getStandardSources(id: string): Promise<StandardEvidence | null> {
  await delay(400);
  const standard = standards.find((entry) => entry.id === id);
  if (!standard) return null;

  const citations = standard.sourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is SourceCitation => Boolean(source));

  const hasClauseLevelEvidence = citations.some((source) => source.clause || source.section || source.page);

  const documentReference: SourceCitation | null = isPlaceholder(standard)
    ? null
    : {
        id: `REF-${standard.id}`,
        title: `${standard.standardNumber} — ${standard.title}`,
        url: BIS_CATALOGUE_URL,
        documentName: standard.standardNumber,
        type: 'standard'
      };

  return {
    standardId: standard.id,
    citations,
    documentReference,
    hasClauseLevelEvidence,
    noteKey: citations.length === 0 ? 'none' : hasClauseLevelEvidence ? 'clause-level' : 'document-only'
  };
}

/**
 * Where a standard sits relative to its latest revision.
 *
 * Only returns a superseding standard when one is actually recorded in the dataset. The
 * previous implementation synthesised an id (`STD-020-v2`) that resolved to nothing, so
 * "View latest version" dead-ended; a revision is never invented here.
 */
export async function getLatestVersion(id: string): Promise<LatestVersionInfo | null> {
  await delay(300);
  const current = standards.find((standard) => standard.id === id);
  if (!current) return null;

  const supersededBy = standards.find(
    (standard) =>
      standard.id !== current.id &&
      primaryStandardNumber(standard.standardNumber) === primaryStandardNumber(current.standardNumber) &&
      standard.year > current.year
  ) ?? null;

  const state: LatestVersionInfo['state'] =
    current.status === 'withdrawn' ? 'withdrawn' : current.status === 'under-revision' ? 'under-revision' : 'current';

  return { state, supersededBy, verifyUrl: BIS_CATALOGUE_URL };
}

/**
 * The full working of how a query produced its ranking, for the "why these standards?"
 * panel. Publishing the weights and thresholds is what makes the score auditable rather
 * than an unexplained number.
 */
export async function getRecommendationAnalysis(query: string): Promise<RecommendationAnalysis> {
  await delay(500);
  const analysis = analyzeQuery(query);

  const signalWeights: SignalWeightExplanation[] = (Object.keys(PHRASE_WEIGHTS) as MatchSignalKey[]).map((key) => ({
    key,
    weight: PHRASE_WEIGHTS[key]
  }));

  const topMatches = standards
    .map((standard) => ({ standard, scored: scoreStandard(standard, analysis) }))
    .filter((entry) => hasContentSignal(entry.scored.signals))
    .sort((a, b) => b.scored.score - a.scored.score)
    .slice(0, 5)
    .map((entry) => ({
      standardId: entry.standard.id,
      standardNumber: entry.standard.standardNumber,
      title: entry.standard.title,
      score: entry.scored.score,
      relevance: relevanceFor(entry.scored.score),
      signals: [...entry.scored.signals].sort((a, b) => b.weight - a.weight)
    }));

  return {
    query: analysis.raw,
    product: analysis.product,
    interpretedTerms: analysis.terms,
    signalWeights,
    thresholds: { high: HIGH_THRESHOLD, medium: MEDIUM_THRESHOLD },
    topMatches,
    limitationKeys: ['text-matching', 'not-official-ranking', 'dataset-subset', 'verify-source']
  };
}

export interface FacetOption {
  value: string;
  count: number;
}

export interface StandardsFacets {
  categories: FacetOption[];
  sectors: FacetOption[];
  statuses: FacetOption[];
  certificationStatuses: FacetOption[];
  icsGroups: FacetOption[];
}

/**
 * Filter options built from the data itself, so the UI can never offer a value that
 * matches nothing. The old page hardcoded categories like "Electrical / Lighting" that
 * appear nowhere in the dataset, which made the category filter always return empty.
 */
export function getStandardsFacets(): StandardsFacets {
  const tally = (values: string[]): FacetOption[] => {
    const counts = new Map<string, number>();
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  };

  return {
    categories: tally(standards.map((standard) => standard.category)),
    sectors: tally(standards.map((standard) => standard.sector)),
    statuses: tally(standards.map((standard) => standard.status)),
    certificationStatuses: tally(standards.map((standard) => standard.certificationStatus)),
    icsGroups: tally(standards.filter((standard) => !isPlaceholder(standard)).map((standard) => icsGroupOf(standard.icsCode)))
  };
}
