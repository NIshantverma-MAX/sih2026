import { GlossaryTerm } from '../types';

/**
 * Plain-language explanations for the BIS terminology that appears on the
 * Certification page. The target reader understands their product but has never
 * dealt with BIS, so every acronym rendered in the UI must resolve to one of these.
 */
export const glossary: GlossaryTerm[] = [
  {
    key: 'qco',
    term: 'QCO',
    expansion: 'Quality Control Order',
    plain:
      'An order issued by the Central Government that makes an Indian Standard compulsory for a product. BIS certification is voluntary by default — a QCO is what turns it into a legal requirement. Once a QCO is in force, the product cannot be manufactured, imported, sold or stored for sale unless it conforms to the named standard and carries the BIS mark.',
    sourceId: 'SRC-COMPULSORY'
  },
  {
    key: 'conformity-assessment',
    term: 'Conformity assessment',
    plain:
      'The checking BIS does to satisfy itself that your product actually meets the Indian Standard — through testing, factory assessment, document review, or a combination. The rules for it are in the BIS (Conformity Assessment) Regulations, 2018.',
    sourceId: 'SRC-CA-REG-2018'
  },
  {
    key: 'scheme-i',
    term: 'Scheme-I',
    plain:
      'The BIS licensing route that lets you put the ISI mark on your product. BIS assesses your factory, your quality control and your testing capability, then grants a licence tied to that factory and that Indian Standard.',
    sourceId: 'SRC-CA-REG-SCHEME-I'
  },
  {
    key: 'scheme-ii',
    term: 'Scheme-II (CRS)',
    expansion: 'Compulsory Registration Scheme',
    plain:
      'A registration route used mainly for electronics and IT goods. You get the product tested in a BIS-recognised lab first, then register on the CRS portal on the basis of a self-declaration of conformity. BIS issues a unique R-number instead of a factory licence.',
    sourceId: 'SRC-CRS-ABOUT'
  },
  {
    key: 'scheme-iv',
    term: 'Scheme-IV (CoC)',
    expansion: 'Certificate of Conformity',
    plain:
      'A route where BIS grants a Certificate of Conformity for a product or consignment rather than an open factory licence. It is used for a small set of notified products.',
    sourceId: 'SRC-CA-REG-SCHEME-IV'
  },
  {
    key: 'scheme-x',
    term: 'Scheme-X',
    plain:
      'A newer BIS certification scheme with its own product list, process and fee structure, notified for categories such as machinery and electrical equipment. Check the Scheme-X pages for whether your product is covered.',
    sourceId: 'SRC-SCHEME-X'
  },
  {
    key: 'fmcs',
    term: 'FMCS',
    expansion: 'Foreign Manufacturers Certification Scheme',
    plain:
      'The route a manufacturer whose factory is outside India uses to get a BIS licence. It works like the domestic scheme but additionally needs an Authorized Indian Representative and a performance bank guarantee.',
    sourceId: 'SRC-FMCS-GRANT'
  },
  {
    key: 'isi-mark',
    term: 'ISI mark',
    plain:
      'The BIS Standard Mark you are licensed to print on a certified product. It tells a buyer that the product is made to a specific Indian Standard under BIS licence. You may only use it while your licence is valid and only for the products in its scope.',
    sourceId: 'SRC-CA-REG-SCHEME-I'
  },
  {
    key: 'standard-mark',
    term: 'Standard Mark',
    plain:
      'The general name for the BIS mark. Under Scheme-I it appears as the ISI mark; under the Compulsory Registration Scheme it appears with a unique R-number.',
    sourceId: 'SRC-CRS-ABOUT'
  },
  {
    key: 'r-number',
    term: 'R-number',
    plain:
      'The unique registration number BIS gives you under the Compulsory Registration Scheme. It is printed alongside the Standard Mark on the product or its packaging.',
    sourceId: 'SRC-CRS-ABOUT'
  },
  {
    key: 'sit',
    term: 'SIT',
    expansion: 'Scheme of Inspection and Testing',
    plain:
      'The per-standard document that tells you exactly which tests you must run in your own factory, how often, on what sample size, and what records to keep. It is the practical checklist BIS holds you to after certification, and it is published with the product manuals.',
    sourceId: 'SRC-SIT'
  },
  {
    key: 'product-manual',
    term: 'Product Manual',
    plain:
      'A technical guidance document BIS publishes for a specific product, describing the test equipment, controls and inspection arrangements expected of a manufacturer. Read yours before you apply — it prevents most first-visit surprises.',
    sourceId: 'SRC-PRODUCT-MANUALS'
  },
  {
    key: 'ics-code',
    term: 'ICS code',
    expansion: 'International Classification for Standards',
    plain:
      'A numeric subject code used to file standards by topic. It helps you find neighbouring standards for the same kind of product; it has no legal effect on your certification.',
    sourceId: 'SRC-KNOW-YOUR-STANDARD'
  },
  {
    key: 'bis-licence',
    term: 'BIS licence',
    plain:
      'The permission BIS grants you to apply the Standard Mark to a named product made to a named Indian Standard at a named factory. It is time-limited and has to be renewed.',
    sourceId: 'SRC-CERT-FAQ'
  },
  {
    key: 'recognised-lab',
    term: 'BIS-recognised laboratory',
    plain:
      'An outside laboratory BIS accepts test reports from. For the test-report-first route, BIS accepts reports issued only by BIS, BIS-recognised or empanelled laboratories.',
    sourceId: 'SRC-CERT-FAQ'
  },
  {
    key: 'marking-fee',
    term: 'Marking fee',
    plain:
      'A recurring fee charged for use of the Standard Mark, set per Indian Standard and usually linked to how much you produce. It is separate from the application and licence fees.',
    sourceId: 'SRC-CERT-FEE'
  },
  {
    key: 'cbtf',
    term: 'CBTF',
    expansion: 'Cluster Based Test Facility',
    plain:
      'A shared testing facility that MSMEs can use instead of buying every test instrument themselves. BIS publishes separate guidelines for using one.',
    sourceId: 'SRC-CBTF-MSME'
  },
  {
    key: 'air',
    term: 'AIR',
    expansion: 'Authorized Indian Representative',
    plain:
      'An India-resident person a foreign manufacturer must nominate to be answerable to BIS on its behalf. The AIR is named on the licence and is nominated using Form-VI.',
    sourceId: 'SRC-FMCS-AIR'
  },
  {
    key: 'surveillance',
    term: 'Surveillance',
    plain:
      'The checks BIS keeps doing after you are certified — surprise visits to your factory and samples picked up from the market — to confirm the product still conforms.',
    sourceId: 'SRC-CERT-FAQ'
  },
  {
    key: 'manakonline',
    term: 'manakonline',
    plain:
      "BIS's online portal for product certification applications and payments. Applications are accepted only online, including the fees.",
    sourceId: 'SRC-MANAK-ONLINE'
  }
];

const glossaryIndex = new Map(glossary.map((g) => [g.key, g]));

export function getGlossaryTerm(key: string): GlossaryTerm | undefined {
  return glossaryIndex.get(key);
}
