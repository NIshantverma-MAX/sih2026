// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  company?: string;
  productCategory?: string;
  avatar?: string;
}

export type UserRole = 'manufacturer' | 'consumer' | 'student' | 'administrator';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  company?: string;
  productCategory?: string;
}

// Standard types
export interface Standard {
  id: string;
  standardNumber: string;
  title: string;
  category: string;
  sector: string;
  description: string;
  scope: string;
  status: StandardStatus;
  revision: string;
  year: number;
  icsCode: string;
  certificationStatus: CertificationStatus;
  relatedStandardIds: string[];
  sourceIds: string[];
  keyRequirements: string[];
}

export type StandardStatus = 'active' | 'withdrawn' | 'under-revision';
export type CertificationStatus = 'mandatory' | 'voluntary' | 'self-declaration';

export interface StandardRecommendation {
  standard: Standard;
  relevanceScore: number;
  relevance: 'high' | 'medium' | 'low';
  matchType?: 'primary' | 'alternative' | 'related';
  matchReasons: string[];
  evidenceIds?: string[];
}

export interface ProductIdentification {
  name: string;
  category: string;
  material?: string;
  intendedUse?: string;
  confidence: number;
  keywords: string[];
  isAmbiguous?: boolean;
}

// Certification types
export interface CertificationGuide {
  id: string;
  productId: string;
  standardId: string;
  steps: CertificationStep[];
  isMandatory: boolean;
  estimatedTimeline: string;
  fees: string;
}

export interface CertificationStep {
  step: number;
  title: string;
  description: string;
  checklist: string[];
  documents: string[];
  status: 'completed' | 'current' | 'upcoming';
}

// Laboratory types
// Certification Guide 2.0 — contextual, scheme-aware certification planning.
// These types are additive: CertificationGuide/CertificationStep above stay unchanged
// so the existing mock service and API contract keep working.

/** Conformity assessment schemes BIS operates. */
export type SchemeCode =
  | 'scheme-i'
  | 'scheme-ii'
  | 'scheme-iv'
  | 'scheme-x'
  | 'fmcs'
  | 'hallmarking';

/**
 * Whether certification is legally required. `needs-verification` is a first-class
 * answer — it is shown instead of guessing when the applicable QCO is not confirmed.
 */
export type RequirementVerdict = 'mandatory' | 'voluntary' | 'needs-verification';

/** How strongly a piece of guidance is backed: quoted from BIS, derived, or unknown. */
export type ConfidenceLevel = 'confirmed' | 'inferred' | 'unknown';

export interface SchemeFact {
  label: string;
  value: string;
  sourceId: string;
}

export interface CertificationScheme {
  code: SchemeCode;
  /** Official name, e.g. "Scheme-I (ISI Mark)". */
  name: string;
  /** Same thing without jargon, for a manufacturer reading this for the first time. */
  plainName: string;
  markName: string;
  legalBasis: string;
  appliesTo: string;
  inPlainWords: string;
  howItWorks: string[];
  keyFacts: SchemeFact[];
  applyPortalUrl: string;
  applyPortalLabel: string;
  productListUrl?: string;
  /** Internal route to hand off to instead of applying here (e.g. hallmarking). */
  internalRoute?: string;
  sourceIds: string[];
}

export interface GlossaryTerm {
  key: string;
  term: string;
  expansion?: string;
  plain: string;
  sourceId?: string;
}

export interface CertificationStageAction {
  label: string;
  /** Internal app route. */
  to?: string;
  /** Official external URL. */
  href?: string;
}

export interface CertificationJourneyStage {
  key: string;
  step: number;
  title: string;
  /** The question a manufacturer would actually ask at this stage. */
  plainQuestion: string;
  whyItMatters: string;
  description: string;
  checklist: string[];
  documents: string[];
  actions: CertificationStageAction[];
  warnings: string[];
  facts: SchemeFact[];
  sourceIds: string[];
  confidence: ConfidenceLevel;
}

export interface CertificationRequirement {
  verdict: RequirementVerdict;
  headline: string;
  reason: string;
  qcoNote?: string;
  verifyUrl: string;
  verifyLabel: string;
  sourceIds: string[];
}

export interface CertificationContext {
  /** Where the product/standard context came from in the user's journey. */
  origin: 'standard' | 'product' | 'none';
  standard?: Standard;
  productName?: string;
  productCategory?: string;
  suggestedStandards?: StandardRecommendation[];
}

/** Where the manufacturing unit is — decides domestic schemes vs FMCS. */
export type ManufacturingLocation = 'india' | 'outside-india';

export interface CertificationPlanRequest {
  standardId?: string;
  product?: string;
  category?: string;
  location?: ManufacturingLocation;
}

export interface CertificationPlan {
  context: CertificationContext;
  requirement: CertificationRequirement;
  scheme?: CertificationScheme;
  schemeConfidence: ConfidenceLevel;
  /** Plain-language explanation of how the scheme above was arrived at. */
  schemeReason: string;
  stages: CertificationJourneyStage[];
  timeline?: string;
  fees?: string;
  /** Id of the curated CertificationGuide whose steps enriched this plan, if any. */
  curatedGuideId?: string;
  warnings: string[];
  sourceIds: string[];
}

export interface Laboratory {
  id: string;
  name: string;
  recognized: boolean;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  supportedStandards: string[];
  testingCategories: string[];
  workingHours: string;
  coordinates?: { lat: number; lng: number };
}

// Hallmarking types
export interface HUIDVerification {
  huid: string;
  verified: boolean;
  product?: string;
  purity?: string;
  jeweller?: string;
  assayingCentre?: string;
  date?: string;
}

// Query types
export interface Query {
  id: string;
  question: string;
  answer?: string;
  date: string;
  language: Language;
  status: 'answered' | 'pending' | 'error';
  response?: AssistantResponse;
}

// Assistant types
export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language: Language;
  response?: AssistantResponse;
}

export interface AssistantResponse {
  answer: string;
  product?: ProductIdentification;
  standards?: StandardRecommendation[];
  certification?: CertificationSummary;
  testing?: TestingRequirement[];
  laboratories?: Laboratory[];
  warnings?: string[];
  sources?: SourceCitation[];
}

export interface CertificationSummary {
  isMandatory: boolean;
  scheme: string;
  description: string;
  timeline: string;
}

export interface TestingRequirement {
  test: string;
  description: string;
  standard: string;
  labRequired: boolean;
}

// Source/Citation types
export interface SourceCitation {
  id: string;
  citationLabel?: string;
  title: string;
  url: string;
  documentName: string;
  page?: number;
  section?: string;
  clause?: string;
  snippet?: string;
  type: 'standard' | 'regulation' | 'guideline' | 'notification' | 'website';
}

// Document types
export interface UploadedDocument {
  id: string;
  filename: string;
  size: number;
  type: string;
  uploadDate: string;
  status: 'uploading' | 'extracting' | 'analyzing' | 'complete' | 'error';
  result?: DocumentAnalysis;
}

export interface DocumentAnalysis {
  productIdentified: string;
  category: string;
  relevantStandards: StandardRecommendation[];
  certificationRequirements: string[];
  testingRequirements: string[];
  warnings: string[];
  sources: SourceCitation[];
}

// Announcement type
export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  link?: string;
}

// QCO type
export interface QCO {
  id: string;
  productCategory: string;
  standard: string;
  effectiveDate: string;
  notificationNumber: string;
  mandatory: boolean;
}

// Search/Filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  sector?: string;
  status?: StandardStatus;
  certificationStatus?: CertificationStatus;
  relevance?: 'high' | 'medium' | 'low';
  sortBy?: 'relevance' | 'latest' | 'alphabetical';
}

export interface LabFilters {
  query?: string;
  state?: string;
  standard?: string;
  city?: string;
}

// Saved items
export interface SavedItem {
  id: string;
  type: 'standard' | 'laboratory' | 'query' | 'guide';
  itemId: string;
  title: string;
  subtitle?: string;
  savedDate: string;
}

// Notification
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

// Language
export type Language = 'en' | 'hi';

// Settings
export interface UserSettings {
  language: Language;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  dataSharing: boolean;
}
