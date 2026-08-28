import { CertificationScheme, SchemeCode } from '../types';

/**
 * BIS conformity assessment schemes, as described on bis.gov.in and crsbis.in.
 *
 * Facts carry the id of the official source they came from so the UI can cite them.
 * Where BIS publishes the detail only inside a PDF that we have not parsed, the fact
 * is deliberately omitted rather than estimated — the UI links the source instead.
 */
export const certificationSchemes: Record<SchemeCode, CertificationScheme> = {
  'scheme-i': {
    code: 'scheme-i',
    name: 'Scheme-I — ISI Mark',
    plainName: 'Factory licence to put the ISI mark on your product',
    markName: 'ISI mark (Standard Mark)',
    legalBasis: 'Scheme-I of Schedule II, BIS (Conformity Assessment) Regulations, 2018',
    appliesTo:
      'Most manufactured goods certified by BIS — household articles, construction materials, food products, electrical accessories, and anything covered by a QCO that names the ISI mark.',
    inPlainWords:
      'BIS comes to your factory, checks that you can make the product to the standard and test it yourself, tests samples independently, and then licenses you to print the ISI mark on that product.',
    howItWorks: [
      'You identify the Indian Standard your product must be made to.',
      'You put the manufacturing controls, quality control and test facilities described in that standard in place.',
      'BIS assesses your premises and gets samples tested — in a third-party lab, in your factory, or both.',
      'On a satisfactory assessment, BIS grants a licence to use the ISI mark for that product at that factory.',
      'BIS then keeps checking through surprise factory surveillance and market samples.'
    ],
    keyFacts: [
      {
        label: 'Two routes available',
        value:
          'BIS offers two options under Scheme-I. They differ mainly in how test reports are handled and how long grant takes.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'Typical time to grant',
        value: 'Generally about one month under option-2 and about four months under option-1.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'Application fee',
        value: 'Rs. 1,000 application fee; inspection charged at Rs. 7,000 per man day.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'After the decision to grant',
        value: 'Annual licence fee of Rs. 1,000 plus the minimum marking fee specified for the product.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'Licence validity',
        value:
          'Granted initially up to two years, and may then be renewed up to five years from the last date of validity.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'Test report validity',
        value: 'Test reports shall not generally be more than 90 days old.',
        sourceId: 'SRC-CERT-FAQ'
      }
    ],
    applyPortalUrl: 'https://www.manakonline.in/',
    applyPortalLabel: 'Apply on manakonline',
    productListUrl:
      'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/',
    sourceIds: [
      'SRC-CA-REG-SCHEME-I',
      'SRC-APPLY-LICENCE',
      'SRC-CERT-PROCESS',
      'SRC-CERT-FAQ',
      'SRC-GRANT-LICENCE'
    ]
  },

  'scheme-ii': {
    code: 'scheme-ii',
    name: 'Scheme-II — Compulsory Registration Scheme (CRS)',
    plainName: 'Registration with a unique R-number, based on lab testing',
    markName: 'Standard Mark with unique R-number',
    legalBasis: 'Scheme-II of Schedule II, BIS (Conformity Assessment) Regulations, 2018',
    appliesTo:
      'Goods notified under a Compulsory Registration Order — electronics and IT goods notified by MeitY, solar photovoltaic products notified by MNRE, certain chemicals, and cotton bales.',
    inPlainWords:
      'You get your product tested in a BIS-recognised laboratory first, then register on the CRS portal declaring that it conforms. BIS gives you a registration number instead of inspecting your factory.',
    howItWorks: [
      'Create login credentials on the CRS portal, supported by your business licence in English.',
      'Generate a test request and pick an approved laboratory from the list.',
      'Send the sample and the test request to that laboratory.',
      'Verify the test report the laboratory issues.',
      'Apply on the portal using the verified test report, with the documents on the checklist and an undertaking declaring conformity.',
      'BIS grants registration and a unique R-number for use with the Standard Mark.'
    ],
    keyFacts: [
      {
        label: 'Basis of grant',
        value:
          'Registration is granted on self-declaration of conformity, supported by a test report from a BIS-recognised laboratory.',
        sourceId: 'SRC-CRS-ABOUT'
      },
      {
        label: 'Who can apply',
        value:
          'The manufacturer (factory owner) of a product that falls under the ambit of a Compulsory Registration Order.',
        sourceId: 'SRC-CRS-ABOUT'
      },
      {
        label: 'Sample deadline',
        value: 'Send the sample and test request to the laboratory within 60 days of generating the test request.',
        sourceId: 'SRC-CRS-REGISTRATION'
      },
      {
        label: 'Test report deadline',
        value: 'Apply on the portal using the verified test report within 90 days of its issue.',
        sourceId: 'SRC-CRS-REGISTRATION'
      },
      {
        label: 'Legal effect of the order',
        value:
          'No person shall manufacture, store for sale, import, sell or distribute goods that do not conform to the named Indian Standard and do not bear the Standard Mark with the BIS registration number.',
        sourceId: 'SRC-CRS-ABOUT'
      }
    ],
    applyPortalUrl: 'https://www.crsbis.in/BIS/registration-page.do',
    applyPortalLabel: 'Apply on the CRS portal',
    productListUrl:
      'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/',
    sourceIds: ['SRC-CRS-ABOUT', 'SRC-CRS-REGISTRATION', 'SRC-LIST-SCHEME-II', 'SRC-CRS-LABS']
  },

  'scheme-iv': {
    code: 'scheme-iv',
    name: 'Scheme-IV — Certificate of Conformity',
    plainName: 'A certificate of conformity rather than an open factory licence',
    markName: 'Standard Mark under a Certificate of Conformity',
    legalBasis: 'Scheme-IV of Schedule II, BIS (Conformity Assessment) Regulations, 2018',
    appliesTo:
      'A small set of notified products, such as stampings, laminations and cores of transformers, and bicycle retro-reflective devices.',
    inPlainWords:
      'BIS grants a Certificate of Conformity for the product instead of a continuing factory licence. The detailed procedure is set out in the BIS guidelines for grant of a certificate of conformity.',
    howItWorks: [
      'Confirm your product is in the Scheme-IV compulsory certification list.',
      'Read the BIS guidelines for grant of a certificate of conformity, and any product-specific guideline for your category.',
      'Follow the application route in those guidelines and get the product tested as they require.',
      'BIS grants the Certificate of Conformity, with surveillance and renewal as set out in the guidelines.'
    ],
    keyFacts: [
      {
        label: 'Step-level detail',
        value:
          'BIS publishes the Scheme-IV procedure inside the linked guideline PDFs rather than on the web page. Read the guidelines for grant and renewal of a certificate of conformity before planning your timeline.',
        sourceId: 'SRC-CERT-PROCESS'
      }
    ],
    applyPortalUrl: 'https://www.manakonline.in/',
    applyPortalLabel: 'Apply on manakonline',
    productListUrl: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-4/',
    sourceIds: ['SRC-CA-REG-SCHEME-IV', 'SRC-CERT-PROCESS', 'SRC-LIST-SCHEME-IV', 'SRC-PRODUCT-SPECIFIC']
  },

  'scheme-x': {
    code: 'scheme-x',
    name: 'Scheme-X Certification',
    plainName: 'A separate BIS scheme with its own product list and process',
    markName: 'Standard Mark under Scheme-X',
    legalBasis: 'Scheme-X, BIS (Conformity Assessment) Regulations, 2018',
    appliesTo:
      'Products notified under Scheme-X, including machinery and electrical equipment categories. The authoritative list is on the BIS Scheme-X pages.',
    inPlainWords:
      'Scheme-X is run separately from the ISI-mark scheme, with its own certification process, product-specific information, fee schedule and registration portal.',
    howItWorks: [
      'Check the Scheme-X compulsory certification list for your product.',
      'Read the Scheme-X certification process and product-specific information pages.',
      'Apply through the Scheme-X registration portal.'
    ],
    keyFacts: [
      {
        label: 'Step-level detail',
        value:
          'The Scheme-X process is published on its own BIS pages. Confirm the current steps, fee and portal there before planning — do not assume the Scheme-I sequence applies.',
        sourceId: 'SRC-SCHEME-X'
      }
    ],
    applyPortalUrl: 'https://www.bis.gov.in/scheme-x-certification/registration-portal/',
    applyPortalLabel: 'Scheme-X registration portal',
    productListUrl: 'https://www.bis.gov.in/products-under-compulsory-certification-scheme-x/',
    sourceIds: ['SRC-SCHEME-X', 'SRC-SCHEME-X-PROCESS', 'SRC-LIST-SCHEME-X']
  },

  fmcs: {
    code: 'fmcs',
    name: 'FMCS — Foreign Manufacturers Certification Scheme',
    plainName: 'BIS licence for a factory located outside India',
    markName: 'ISI mark (Standard Mark)',
    legalBasis: 'BIS (Conformity Assessment) Regulations, 2018, as operated under FMCS',
    appliesTo: 'Manufacturers whose manufacturing premises are outside India and who want to sell into India.',
    inPlainWords:
      'The same idea as the domestic licence — BIS visits your factory and tests samples — with two extra obligations: you must nominate an India-resident representative, and you must furnish a performance bank guarantee after grant.',
    howItWorks: [
      'Complete the prescribed application form with the documentation on the checklist.',
      'Nominate an Authorized Indian Representative using Form-VI.',
      'Submit the application with the requisite fees through the manakonline FMCS portal.',
      'BIS examines the application and raises queries by email; a visit is paid to the factory location and samples are drawn for independent testing.',
      'On a satisfactory inspection report and independent test reports, pay the licence fee, advance minimum marking fee and dues.',
      'Sign the agreement and indemnity bond, and furnish the performance bank guarantee.'
    ],
    keyFacts: [
      {
        label: 'Typical time to grant',
        value: 'Average time taken for grant of licence is generally six months from recording of a complete application.',
        sourceId: 'SRC-FMCS-GRANT'
      },
      {
        label: 'Authorized Indian Representative',
        value:
          'The AIR shall be an Indian resident, at least a graduate, nominated on Form-VI, and is endorsed on the licence.',
        sourceId: 'SRC-FMCS-AIR'
      },
      {
        label: 'Performance bank guarantee',
        value:
          'A performance bank guarantee of USD 10,000 from a bank having an RBI-approved branch in India is furnished after the licence is granted.',
        sourceId: 'SRC-FMCS-GRANT'
      },
      {
        label: 'Licence validity',
        value:
          'Granted initially for not less than one year and up to two years, then renewable up to five years.',
        sourceId: 'SRC-FMCS-GRANT'
      },
      {
        label: 'Online only',
        value:
          'Hard-copy applications are accepted only up to 31 May 2026; from 01 June 2026 only applications submitted through the online portal are accepted.',
        sourceId: 'SRC-FMCS-HOW-TO-APPLY'
      },
      {
        label: 'Testing costs',
        value:
          'Responsibility for safe deposition of samples and remittance of testing charges lies with the applicant firm.',
        sourceId: 'SRC-FMCS-GRANT'
      }
    ],
    applyPortalUrl: 'https://www.manakonline.in/FMCS/eBISLogin',
    applyPortalLabel: 'Apply on the FMCS portal',
    sourceIds: ['SRC-FMCS-HOW-TO-APPLY', 'SRC-FMCS-GRANT', 'SRC-FMCS-AIR', 'SRC-FMCS-APPLY-ONLINE']
  },

  hallmarking: {
    code: 'hallmarking',
    name: 'Hallmarking',
    plainName: 'Jeweller registration and hallmarking of precious metal articles',
    markName: 'BIS Hallmark with HUID',
    legalBasis: 'BIS Act 2016 and the hallmarking orders and regulations made under it',
    appliesTo: 'Gold and silver jewellery and artefacts, and the jewellers who sell them.',
    inPlainWords:
      'Precious metal articles are not certified through the product certification schemes. Jewellers register with BIS and get articles hallmarked at an Assaying and Hallmarking Centre.',
    howItWorks: [
      'Register as a jeweller with BIS.',
      'Get articles assayed and hallmarked at a BIS-recognised Assaying and Hallmarking Centre.',
      'Sell only hallmarked articles carrying a HUID where hallmarking is mandatory.'
    ],
    keyFacts: [
      {
        label: 'Different route',
        value:
          'Hallmarking is administered separately from product certification, with its own registration, centres and mandatory-hallmarking notifications.',
        sourceId: 'SRC-HALLMARKING'
      }
    ],
    applyPortalUrl: 'https://www.bis.gov.in/hallmarking-overview/',
    applyPortalLabel: 'BIS Hallmarking',
    internalRoute: '/hallmarking',
    sourceIds: ['SRC-HALLMARKING']
  }
};

export const schemeList: CertificationScheme[] = [
  certificationSchemes['scheme-i'],
  certificationSchemes['scheme-ii'],
  certificationSchemes['scheme-iv'],
  certificationSchemes['scheme-x'],
  certificationSchemes.fmcs,
  certificationSchemes.hallmarking
];
