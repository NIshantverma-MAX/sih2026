import { SourceCitation } from '../types';

/**
 * Official BIS / Government of India sources for the Certification Guide.
 *
 * Every certification claim rendered on the Certification page is traced back to one
 * of these entries. Only bis.gov.in, crsbis.in, manakonline.in, lims.bis.gov.in and
 * standards.bis.gov.in are used — no blogs, aggregators or consultancy sites.
 *
 * When a fact could not be confirmed from these sources, the UI must say
 * "Requirement needs verification" and link the source instead of asserting a value.
 */
export const certificationSources: SourceCitation[] = [
  // ── Legal basis ────────────────────────────────────────────────────────────
  {
    id: 'SRC-CA-REG-2018',
    title: 'BIS (Conformity Assessment) Regulations, 2018',
    url: 'https://www.bis.gov.in/wp-content/uploads/2019/03/BIS_CA_12032019.pdf',
    documentName: 'BIS_CA_12032019.pdf',
    type: 'regulation',
    snippet: 'Schedule II sets out the conformity assessment schemes, including Scheme-I (ISI mark) and Scheme-IV (certificate of conformity).'
  },
  {
    id: 'SRC-CA-REG-SCHEME-I',
    title: 'Scheme-I — Product certification scheme for use of the ISI mark',
    url: 'https://www.bis.gov.in/wp-content/uploads/2019/03/BIS_CA_12032019.pdf#page=243',
    documentName: 'BIS (Conformity Assessment) Regulations, 2018',
    page: 243,
    type: 'regulation'
  },
  {
    id: 'SRC-CA-REG-SCHEME-IV',
    title: 'Scheme-IV — Product certification scheme for grant of certificate of conformity',
    url: 'https://www.bis.gov.in/wp-content/uploads/2019/03/BIS_CA_12032019.pdf#page=358',
    documentName: 'BIS (Conformity Assessment) Regulations, 2018',
    page: 358,
    type: 'regulation'
  },
  {
    id: 'SRC-BIS-ACT-RULES',
    title: 'BIS Act, Rules and Regulations',
    url: 'https://www.bis.gov.in/the-bureau/bis-act-rules-and-regulations/',
    documentName: 'BIS Act 2016 · BIS Rules 2018 · Regulations',
    type: 'regulation'
  },

  // ── Requirement / QCO ─────────────────────────────────────────────────────
  {
    id: 'SRC-COMPULSORY',
    title: 'Products under Compulsory Certification',
    url: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/',
    documentName: 'BIS — Product Certification',
    type: 'website',
    snippet: 'The BIS certification scheme is essentially voluntary; the Central Government makes conformity mandatory for certain products by issuing Quality Control Orders.'
  },
  {
    id: 'SRC-QCO-GUIDANCE',
    title: 'Guidance document on Quality Control Orders (QCOs)',
    url: 'https://www.bis.gov.in/wp-content/uploads/2021/07/Guidance-document-on-QCOs-Revised-1.pdf',
    documentName: 'Guidance-document-on-QCOs-Revised-1.pdf',
    type: 'guideline'
  },
  {
    id: 'SRC-QCO-UPCOMING',
    title: 'Upcoming QCOs — notified and due for implementation',
    url: 'https://www.bis.gov.in/upcoming-qcos-notified-and-due-for-implementation/',
    documentName: 'BIS — Upcoming QCOs',
    type: 'notification'
  },
  {
    id: 'SRC-LIST-SCHEME-I',
    title: 'Compulsory certification list — Scheme-I (ISI Mark Scheme)',
    url: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/',
    documentName: 'BIS — Products under Compulsory Certification',
    type: 'website'
  },
  {
    id: 'SRC-LIST-SCHEME-II',
    title: 'Compulsory certification list — Scheme-II (Registration Scheme)',
    url: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/',
    documentName: 'BIS — Products under Compulsory Certification',
    type: 'website'
  },
  {
    id: 'SRC-LIST-SCHEME-IV',
    title: 'Compulsory certification list — Scheme-IV (Certificate of Conformity)',
    url: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-4/',
    documentName: 'BIS — Products under Compulsory Certification',
    type: 'website'
  },
  {
    id: 'SRC-LIST-SCHEME-X',
    title: 'Compulsory certification list — Scheme-X',
    url: 'https://www.bis.gov.in/products-under-compulsory-certification-scheme-x/',
    documentName: 'BIS — Products under Compulsory Certification',
    type: 'website'
  },

  // ── Standards discovery ───────────────────────────────────────────────────
  {
    id: 'SRC-KNOW-YOUR-STANDARD',
    title: 'Know Your Standard',
    url: 'https://www.bis.gov.in/know-your-standard/',
    documentName: 'BIS — Know Your Standard',
    type: 'website',
    snippet: 'One-stop access to all the documents and data related to a selected Standard, searchable by IS number or keyword.'
  },
  {
    id: 'SRC-KYS-PORTAL',
    title: 'Know Your Standard — search portal',
    url: 'https://standards.bis.gov.in/website/know-your-standards',
    documentName: 'standards.bis.gov.in',
    type: 'website'
  },
  {
    id: 'SRC-STANDARDS-DOWNLOAD',
    title: 'Download Indian Standards',
    url: 'https://standardsbis.bsbedge.com/',
    documentName: 'BIS Standards Portal',
    type: 'website'
  },

  // ── Scheme-I process ──────────────────────────────────────────────────────
  {
    id: 'SRC-APPLY-LICENCE',
    title: 'Apply for a Licence',
    url: 'https://www.bis.gov.in/apply-for-a-license/',
    documentName: 'BIS — Apply for a Licence',
    type: 'website',
    snippet: 'Application process starts with identification of Indian Standard against the product for which license is desired.'
  },
  {
    id: 'SRC-CERT-PROCESS',
    title: 'Product Certification Process',
    url: 'https://www.bis.gov.in/product-certification/product-certification-process/',
    documentName: 'BIS — Product Certification Process',
    type: 'website'
  },
  {
    id: 'SRC-CERT-FAQ',
    title: 'Product Certification FAQ',
    url: 'https://www.bis.gov.in/product-certification/product-certification-faq/',
    documentName: 'BIS — Product Certification FAQ',
    type: 'website',
    snippet: 'Covers the two options under Scheme-I, acceptable laboratories, test report validity, fees, timelines, licence validity and surveillance.'
  },
  {
    id: 'SRC-GRANT-LICENCE',
    title: 'Guidelines for Grant of Licence',
    url: 'https://www.bis.gov.in/wp-content/uploads/2026/02/GrantofLicence-Guidelines-25Feb2026.pdf',
    documentName: 'GrantofLicence-Guidelines-25Feb2026.pdf',
    type: 'guideline'
  },
  {
    id: 'SRC-SIMPLIFIED-LIST',
    title: 'List of Products Under Simplified Procedure',
    url: 'https://www.bis.gov.in/wp-content/uploads/2021/04/List-of-Products-Under-Simplified-Procedure.pdf',
    documentName: 'List-of-Products-Under-Simplified-Procedure.pdf',
    type: 'guideline'
  },
  {
    id: 'SRC-FACTORY-SURVEILLANCE',
    title: 'Guidelines for Factory Surveillance',
    url: 'https://www.bis.gov.in/wp-content/uploads/2026/02/FactorySurveillance-Guidelines-25Feb2026.pdf',
    documentName: 'FactorySurveillance-Guidelines-25Feb2026.pdf',
    type: 'guideline'
  },
  {
    id: 'SRC-RENEWAL',
    title: 'Guidelines for Renewal of Licence',
    url: 'https://www.bis.gov.in/wp-content/uploads/2025/03/RenewalGuidelines-WebsiteHosting.pdf',
    documentName: 'RenewalGuidelines-WebsiteHosting.pdf',
    type: 'guideline'
  },
  {
    id: 'SRC-NON-CONFORMITY',
    title: 'Guidelines for Dealing With Product Non-Conformity',
    url: 'https://www.bis.gov.in/wp-content/uploads/2026/02/Dealing-WithNon-Conformity-Guidelines-25Feb2026.pdf',
    documentName: 'Dealing-WithNon-Conformity-Guidelines-25Feb2026.pdf',
    type: 'guideline'
  },
  {
    id: 'SRC-CHANGE-SCOPE',
    title: 'Guidelines for Change in Scope of Licence',
    url: 'https://www.bis.gov.in/wp-content/uploads/2021/05/Website-GuidelinesForChangeInScopeOfLicence_may.pdf',
    documentName: 'Website-GuidelinesForChangeInScopeOfLicence_may.pdf',
    type: 'guideline'
  },

  // ── Product-specific requirements ─────────────────────────────────────────
  {
    id: 'SRC-PRODUCT-SPECIFIC',
    title: 'Product Specific Information',
    url: 'https://www.bis.gov.in/product-certification/product-specific-guideline/',
    documentName: 'BIS — Product Specific Information',
    type: 'website'
  },
  {
    id: 'SRC-PRODUCT-MANUALS',
    title: 'Product Manuals',
    url: 'https://www.bis.gov.in/index.php/product-certification/product-specific-information-2/product-manualsmk/',
    documentName: 'BIS — Product Manuals',
    type: 'guideline',
    snippet: 'BIS has developed product specific technical manuals for the guidance of manufacturers.'
  },
  {
    id: 'SRC-SIT',
    title: 'Scheme of Inspection and Testing (SIT)',
    url: 'https://www.bis.gov.in/product-certification/product-specific-guideline/',
    documentName: 'BIS — SIT on Product Manuals',
    type: 'guideline'
  },

  // ── Testing ───────────────────────────────────────────────────────────────
  {
    id: 'SRC-TESTING-FACILITIES',
    title: 'Testing facilities by Indian Standard number',
    url: 'https://lims.bis.gov.in/home/search_is_number/',
    documentName: 'BIS LIMS',
    type: 'website'
  },
  {
    id: 'SRC-CBTF-MSME',
    title: 'Guidelines for utilisation of Cluster Based Test Facility (CBTF) by MSMEs',
    url: 'https://www.bis.gov.in/wp-content/uploads/2023/07/GuidelinesForUtilisationOfClusterLabByMSMEs.pdf',
    documentName: 'GuidelinesForUtilisationOfClusterLabByMSMEs.pdf',
    type: 'guideline'
  },

  // ── Application & fees ────────────────────────────────────────────────────
  {
    id: 'SRC-MANAK-ONLINE',
    title: 'Apply online — manakonline portal',
    url: 'https://www.manakonline.in/',
    documentName: 'manakonline.in',
    type: 'website',
    snippet: 'The applications are accepted only through online mode including all payments.'
  },
  {
    id: 'SRC-APPLY-ONLINE',
    title: 'Product Certification — Apply Online',
    url: 'https://www.bis.gov.in/product-certification/product-certificatin-apply-online/',
    documentName: 'BIS — Apply Online',
    type: 'website'
  },
  {
    id: 'SRC-BIS-LOGIN',
    title: 'BIS Login',
    url: 'https://www.services.bis.gov.in/php/BIS_2.0/',
    documentName: 'services.bis.gov.in',
    type: 'website'
  },
  {
    id: 'SRC-CERT-FEE',
    title: 'Product Certification — Fee',
    url: 'https://www.bis.gov.in/product-certification/product-certification-fee/',
    documentName: 'BIS — Product Certification Fee',
    type: 'website',
    snippet: 'Marking fee notifications and amendments; marking fee for a given Indian Standard can be searched on the portal.'
  },

  // ── Scheme-II / CRS ───────────────────────────────────────────────────────
  {
    id: 'SRC-CRS-ABOUT',
    title: 'About the Compulsory Registration Scheme (CRS)',
    url: 'https://www.crsbis.in/BIS/about-crs.do',
    documentName: 'crsbis.in — About CRS',
    type: 'website',
    snippet: 'BIS grants licence to the manufacturers to use or apply Standard Mark with unique R-number through registration based on self-declaration of conformity.'
  },
  {
    id: 'SRC-CRS-REGISTRATION',
    title: 'CRS Registration Process',
    url: 'https://www.crsbis.in/BIS/registration-page.do',
    documentName: 'crsbis.in — Registration',
    type: 'website',
    snippet: 'Login, generate test request, get product tested from a BIS recognized lab, verify the test report, apply within 90 days of its issue, submit documents as per checklist.'
  },
  {
    id: 'SRC-CRS-LABS',
    title: 'BIS Recognised Labs (CRS)',
    url: 'https://www.crsbis.in/BIS/bis_lab.do',
    documentName: 'crsbis.in — BIS Recognised Labs',
    type: 'website'
  },

  // ── Scheme-X ──────────────────────────────────────────────────────────────
  {
    id: 'SRC-SCHEME-X',
    title: 'Scheme-X Certification',
    url: 'https://www.bis.gov.in/scheme-x-certification/',
    documentName: 'BIS — Scheme-X Certification',
    type: 'website'
  },
  {
    id: 'SRC-SCHEME-X-PROCESS',
    title: 'Scheme-X — Certification Process',
    url: 'https://www.bis.gov.in/scheme-x-certification/certification-process-4/',
    documentName: 'BIS — Scheme-X Certification Process',
    type: 'website'
  },

  // ── FMCS (manufacturers outside India) ────────────────────────────────────
  {
    id: 'SRC-FMCS-HOW-TO-APPLY',
    title: 'FMCS — How To Apply',
    url: 'https://www.bis.gov.in/fmcs/certification-process/how-to-apply/',
    documentName: 'BIS — FMCS How To Apply',
    type: 'website',
    snippet: 'From 01 June 2026, only applications submitted through the online portal shall be accepted.'
  },
  {
    id: 'SRC-FMCS-GRANT',
    title: 'FMCS — Grant of Licence',
    url: 'https://www.bis.gov.in/fmcs/certification-process/grant-of-licence/',
    documentName: 'BIS — FMCS Grant of Licence',
    type: 'website',
    snippet: 'Average time taken for grant of licence is generally six months; Performance Bank Guarantee of USD 10000 is furnished after grant.'
  },
  {
    id: 'SRC-FMCS-AIR',
    title: 'FMCS — Nomination of Authorized Indian Representative (AIR)',
    url: 'https://www.bis.gov.in/fmcs/certification-process/nomination-of-air/',
    documentName: 'BIS — Nomination of AIR',
    type: 'website',
    snippet: 'The Authorized Indian Representative (AIR) shall be an Indian resident, nominated using Form-VI.'
  },
  {
    id: 'SRC-FMCS-APPLY-ONLINE',
    title: 'FMCS — Apply Online',
    url: 'https://www.manakonline.in/FMCS/eBISLogin',
    documentName: 'manakonline.in/FMCS',
    type: 'website'
  },

  // ── Hallmarking ───────────────────────────────────────────────────────────
  {
    id: 'SRC-HALLMARKING',
    title: 'Hallmarking — Overview',
    url: 'https://www.bis.gov.in/hallmarking-overview/',
    documentName: 'BIS — Hallmarking',
    type: 'website'
  }
];

const sourceIndex = new Map(certificationSources.map((s) => [s.id, s]));

export function getCertificationSource(id: string): SourceCitation | undefined {
  return sourceIndex.get(id);
}

export function getCertificationSources(ids: string[]): SourceCitation[] {
  return ids.map((id) => sourceIndex.get(id)).filter((s): s is SourceCitation => Boolean(s));
}
