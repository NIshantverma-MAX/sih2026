import { CertificationJourneyStage, SchemeCode } from '../types';

/**
 * Journey stage templates per conformity assessment scheme.
 *
 * The seven stages are a NAVIGATION model only — the content inside them differs by
 * scheme, because BIS does not run one universal process. Scheme-I is an assessment-led
 * factory licence; Scheme-II (CRS) is test-report-led with no factory visit in the
 * published process; FMCS adds an Indian representative and a bank guarantee.
 *
 * `confidence` tells the UI how hard it may state each stage:
 *   confirmed — the wording comes from the cited bis.gov.in / crsbis.in page
 *   inferred  — assembled from those pages but not quoted as a single instruction
 *   unknown   — BIS publishes it only in a document we have not parsed; the UI must
 *               say so and link the source instead of filling in a plausible answer
 *
 * The service layer injects product/standard specifics (IS number, key requirements,
 * lab links) on top of these templates.
 */

const STAGE_TITLES = [
  'Applicable Standard',
  'Certification Requirement',
  'Meet the Requirements',
  'Testing',
  'Application',
  'BIS Assessment',
  'Certificate & Compliance'
] as const;

/** Stages shared by every scheme up to the point where the routes diverge. */
function stageIdentifyStandard(sourceIds: string[]): CertificationJourneyStage {
  return {
    key: 'standard',
    step: 1,
    title: STAGE_TITLES[0],
    plainQuestion: 'Which Indian Standard does my product have to be made to?',
    whyItMatters:
      'Everything downstream is decided by the standard — which tests you run, which equipment you need in your factory, which scheme applies, and what BIS checks. BIS itself starts the application process here.',
    description:
      'Find the Indian Standard that covers your product. A standard covers a product type, not a brand — so match on what the product is, what it is made of and what it is used for. If more than one standard looks close, read the scope clause of each; the scope tells you what the standard does and does not cover.',
    checklist: [
      'Identify the Indian Standard (IS) number that covers your product',
      'Read the scope clause and confirm your product falls inside it',
      'Note the year/revision — you must work to the current version',
      'Check whether the standard has parts, and which part applies to you',
      'Buy or download the full standard; the summary is not enough to manufacture to'
    ],
    documents: ['Product description, drawings or specification sheet', 'Copy of the applicable Indian Standard'],
    actions: [
      { label: 'Find Applicable Standard', to: '/standards' },
      { label: 'Know Your Standard (BIS)', href: 'https://www.bis.gov.in/know-your-standard/' },
      { label: 'Download Indian Standards', href: 'https://standardsbis.bsbedge.com/' }
    ],
    warnings: [
      'Working to a withdrawn or superseded revision is a common and expensive mistake — confirm the current revision on the BIS portal.'
    ],
    facts: [
      {
        label: 'Where BIS starts',
        value:
          'The application process starts with identification of the Indian Standard against the product for which the licence is desired.',
        sourceId: 'SRC-APPLY-LICENCE'
      }
    ],
    sourceIds: ['SRC-KNOW-YOUR-STANDARD', 'SRC-KYS-PORTAL', 'SRC-APPLY-LICENCE', ...sourceIds],
    confidence: 'confirmed'
  };
}

function stageRequirement(sourceIds: string[]): CertificationJourneyStage {
  return {
    key: 'requirement',
    step: 2,
    title: STAGE_TITLES[1],
    plainQuestion: 'Do I actually have to get certified, or is it optional?',
    whyItMatters:
      'BIS certification is voluntary by default. It becomes compulsory only when the Central Government issues a Quality Control Order (QCO) for the product. If a QCO covers you, selling without the mark is not a business choice — it is a legal breach.',
    description:
      'Check whether your product appears in a Quality Control Order or a compulsory certification list. The lists are published per scheme, so check the list for the scheme your product falls under, and also check the upcoming-QCO list — a product that is voluntary today may become mandatory on a notified date.',
    checklist: [
      'Search the compulsory certification list for your product and standard',
      'Check the upcoming-QCO list for a future implementation date',
      'Note the QCO notification number and its effective date',
      'Confirm whether the QCO covers your specific variant, size or rating',
      'If you import or export, check the requirement for that route too'
    ],
    documents: ['Applicable QCO notification (if any)', 'Product category and variant details'],
    actions: [
      { label: 'Products under Compulsory Certification', href: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/' },
      { label: 'Upcoming QCOs', href: 'https://www.bis.gov.in/upcoming-qcos-notified-and-due-for-implementation/' },
      { label: 'Guidance document on QCOs', href: 'https://www.bis.gov.in/wp-content/uploads/2021/07/Guidance-document-on-QCOs-Revised-1.pdf' }
    ],
    warnings: [
      'Do not treat a requirement as settled without seeing it in an official list or notification. QCOs are amended and their dates are extended.'
    ],
    facts: [
      {
        label: 'Default position',
        value:
          'The BIS certification scheme is essentially voluntary; the Central Government makes conformity mandatory for certain products by issuing Quality Control Orders.',
        sourceId: 'SRC-COMPULSORY'
      }
    ],
    sourceIds: ['SRC-COMPULSORY', 'SRC-QCO-UPCOMING', 'SRC-QCO-GUIDANCE', ...sourceIds],
    confidence: 'confirmed'
  };
}

// ── Scheme-I (ISI mark) ─────────────────────────────────────────────────────

const schemeIStages: CertificationJourneyStage[] = [
  stageIdentifyStandard(['SRC-LIST-SCHEME-I']),
  stageRequirement(['SRC-LIST-SCHEME-I']),
  {
    key: 'prepare',
    step: 3,
    title: STAGE_TITLES[2],
    plainQuestion: 'What do I need in my factory before BIS will license me?',
    whyItMatters:
      'Under Scheme-I the licence is granted to a factory, not to a design. BIS has to be satisfied that you can make the product to the standard repeatedly and check it yourself — so the manufacturing process, the quality control and the in-house test facility all have to exist before the visit, not after it.',
    description:
      'Work from two documents together: the Indian Standard, which sets what the product must achieve, and the BIS Product Manual and Scheme of Inspection and Testing (SIT) for your product, which set out what BIS expects to see in your works — the test equipment, the controls and the records. Read them before you apply; most first-visit failures are things named in these documents.',
    checklist: [
      'Read the BIS Product Manual for your product, if one is published',
      'Read the Scheme of Inspection and Testing (SIT) for your standard',
      'Confirm the in-house testing equipment named there is installed and working',
      'Have calibration certificates for your test and measuring equipment',
      'Assign a competent person for quality control and testing',
      'Start keeping raw-material, process-control and test records now',
      'Confirm the factory is complete and capable of regular production'
    ],
    documents: [
      'Manufacturing process flow chart',
      'List of manufacturing plant and machinery',
      'List of testing equipment with calibration certificates',
      'Quality control / in-house test records',
      'Factory registration or business licence',
      'Layout plan of the manufacturing premises'
    ],
    actions: [
      { label: 'Product Manuals (BIS)', href: 'https://www.bis.gov.in/index.php/product-certification/product-specific-information-2/product-manualsmk/' },
      { label: 'Product Specific Information', href: 'https://www.bis.gov.in/product-certification/product-specific-guideline/' },
      { label: 'CBTF guidelines for MSMEs', href: 'https://www.bis.gov.in/wp-content/uploads/2023/07/GuidelinesForUtilisationOfClusterLabByMSMEs.pdf' }
    ],
    warnings: [
      'The exact equipment and QC arrangements are product-specific. Take them from your Product Manual and SIT, not from a general checklist.',
      'Uncalibrated test equipment is treated as no test equipment.'
    ],
    facts: [
      {
        label: 'Shared testing for MSMEs',
        value:
          'BIS publishes guidelines for MSMEs to use a Cluster Based Test Facility (CBTF) instead of installing every instrument in-house.',
        sourceId: 'SRC-CBTF-MSME'
      }
    ],
    sourceIds: ['SRC-PRODUCT-MANUALS', 'SRC-SIT', 'SRC-PRODUCT-SPECIFIC', 'SRC-CBTF-MSME'],
    confidence: 'inferred'
  },
  {
    key: 'testing',
    step: 4,
    title: STAGE_TITLES[3],
    plainQuestion: 'Which tests do I need, and can I do them myself?',
    whyItMatters:
      'Under Scheme-I both kinds of testing matter. Your own factory testing is what BIS licenses you to keep doing; independent third-party testing is what proves conformity at the time of grant. Which one comes first depends on which of the two options you choose.',
    description:
      'The tests are those in the Indian Standard for your product, applied as set out in its Scheme of Inspection and Testing. Where independent testing is needed, BIS accepts reports only from BIS laboratories, BIS-recognised laboratories or empanelled laboratories — not from any accredited lab. Reports also age: BIS generally does not accept a report more than 90 days old.',
    checklist: [
      'List the tests the Indian Standard requires for your product',
      'Split them into tests you can run in-house and tests needing an outside lab',
      'Confirm the outside lab is a BIS or BIS-recognised / empanelled laboratory',
      'Search the BIS lab directory by your IS number to find one',
      'Plan the timing so the test report is not more than 90 days old when used',
      'Keep the sample details and test report traceable to the tested batch'
    ],
    documents: ['Test report from a BIS-recognised laboratory', 'In-house test records against the SIT'],
    actions: [
      { label: 'Find Testing Labs', to: '/labs' },
      { label: 'Testing facilities by IS number (BIS LIMS)', href: 'https://lims.bis.gov.in/home/search_is_number/' },
      { label: 'Product Certification FAQ', href: 'https://www.bis.gov.in/product-certification/product-certification-faq/' }
    ],
    warnings: [
      'A report from a lab that is accredited but not BIS-recognised or empanelled can be rejected. Confirm the lab before you send the sample.',
      'Test reports shall generally not be more than 90 days old.'
    ],
    facts: [
      {
        label: 'Acceptable laboratories',
        value:
          'Test reports are accepted from BIS laboratories, BIS-recognised laboratories or laboratories empanelled by BIS.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'Report validity',
        value: 'Test reports shall not generally be more than 90 days old.',
        sourceId: 'SRC-CERT-FAQ'
      }
    ],
    sourceIds: ['SRC-CERT-FAQ', 'SRC-TESTING-FACILITIES', 'SRC-SIT'],
    confidence: 'confirmed'
  },
  {
    key: 'application',
    step: 5,
    title: STAGE_TITLES[4],
    plainQuestion: 'Where do I apply, and what will it cost me to start?',
    whyItMatters:
      'BIS accepts product certification applications only online, including the payments. An incomplete application is not "recorded", and timelines are counted from the point the application is complete — so gaps here cost you weeks before anyone visits.',
    description:
      'Apply on the BIS manakonline portal against the Indian Standard you identified, for the specific product and factory. Choose between the two options BIS offers under Scheme-I: they differ mainly in whether an independent test report accompanies the application, and that choice changes how long grant takes.',
    checklist: [
      'Register on the manakonline portal for your firm',
      'Select the correct Indian Standard and product variety',
      'Choose between option-1 and option-2 deliberately, not by default',
      'Upload the documents on the application checklist',
      'Pay the application fee online',
      'Keep the application number for tracking'
    ],
    documents: [
      'Completed online application',
      'Proof of establishment of the firm / factory licence',
      'Test report (for the option that requires it)',
      'List of machinery and test equipment',
      'Proof of payment of the application fee'
    ],
    actions: [
      { label: 'Apply on manakonline', href: 'https://www.manakonline.in/' },
      { label: 'Apply for a Licence (BIS)', href: 'https://www.bis.gov.in/apply-for-a-license/' },
      { label: 'Product Certification Fee', href: 'https://www.bis.gov.in/product-certification/product-certification-fee/' }
    ],
    warnings: [
      'Applications and payments are accepted only online.',
      'Fees change by notification. Confirm the current amount on the BIS fee page before you budget.'
    ],
    facts: [
      {
        label: 'Application fee',
        value: 'Rs. 1,000 application fee, with inspection charged at Rs. 7,000 per man day.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'Online only',
        value: 'Applications are accepted only through online mode, including all payments.',
        sourceId: 'SRC-MANAK-ONLINE'
      },
      {
        label: 'Effect of the option you choose',
        value: 'Time to grant is generally about one month under option-2 and about four months under option-1.',
        sourceId: 'SRC-CERT-FAQ'
      }
    ],
    sourceIds: ['SRC-MANAK-ONLINE', 'SRC-APPLY-LICENCE', 'SRC-CERT-FAQ', 'SRC-CERT-FEE', 'SRC-APPLY-ONLINE'],
    confidence: 'confirmed'
  },
  {
    key: 'assessment',
    step: 6,
    title: STAGE_TITLES[5],
    plainQuestion: 'What happens when BIS visits, and what if I fail?',
    whyItMatters:
      'This is the stage that decides the licence. BIS is checking two things at once: that the product conforms, and that your works can keep making it conform. A shortfall found here is normally something to correct and re-verify, not a permanent rejection — but it does reset your timeline.',
    description:
      'A BIS officer visits the manufacturing premises, verifies the manufacturing and quality-control arrangements against the standard and the Scheme of Inspection and Testing, and draws samples. Samples are tested independently, and may also be tested in your factory in the officer\'s presence. Grant follows a satisfactory inspection report together with satisfactory test reports.',
    checklist: [
      'Keep the factory in regular production at the time of the visit',
      'Have the in-house test facility ready to demonstrate, not just present',
      'Have QC records, calibration certificates and raw-material records available',
      'Make the person responsible for testing available on the day',
      'Be ready for samples to be drawn and sealed',
      'If a non-conformity is recorded, fix the cause and evidence the fix'
    ],
    documents: ['Inspection report', 'Independent test report on the drawn samples', 'Records produced during the visit'],
    actions: [
      { label: 'Product Certification Process', href: 'https://www.bis.gov.in/product-certification/product-certification-process/' },
      { label: 'Guidelines for Grant of Licence', href: 'https://www.bis.gov.in/wp-content/uploads/2026/02/GrantofLicence-Guidelines-25Feb2026.pdf' },
      { label: 'Dealing with product non-conformity', href: 'https://www.bis.gov.in/wp-content/uploads/2026/02/Dealing-WithNon-Conformity-Guidelines-25Feb2026.pdf' }
    ],
    warnings: [
      'Inspection is charged per man day, so a repeat visit caused by an avoidable shortfall is a direct cost.'
    ],
    facts: [
      {
        label: 'Inspection charge',
        value: 'Inspection is charged at Rs. 7,000 per man day.',
        sourceId: 'SRC-CERT-FAQ'
      }
    ],
    sourceIds: ['SRC-CERT-PROCESS', 'SRC-GRANT-LICENCE', 'SRC-CERT-FAQ', 'SRC-NON-CONFORMITY'],
    confidence: 'inferred'
  },
  {
    key: 'certificate',
    step: 7,
    title: STAGE_TITLES[6],
    plainQuestion: 'I have the licence — what am I now committed to?',
    whyItMatters:
      'The licence is a continuing obligation, not a certificate you file away. It is time-limited, it costs a recurring fee, it covers only the products in its scope, and BIS keeps checking through surprise visits and market samples.',
    description:
      'On grant you pay the licence fee and the advance minimum marking fee, sign the agreement, and may then apply the ISI mark to the covered product. From then on you keep testing to the Scheme of Inspection and Testing, keep the records, renew before expiry, and get the scope changed before you add a variety or a new standard.',
    checklist: [
      'Pay the licence fee and advance minimum marking fee',
      'Use the ISI mark only on the products and varieties inside your licence scope',
      'Keep running the in-house tests at the frequency in the SIT and retain the records',
      'Diarise renewal well before the last date of validity',
      'Apply for a change in scope before making a product not covered by the licence',
      'Have a plan for handling non-conforming product found by you or by BIS'
    ],
    documents: ['BIS licence', 'Signed agreement', 'Marking fee payment records', 'Ongoing SIT test records'],
    actions: [
      { label: 'Guidelines for Renewal of Licence', href: 'https://www.bis.gov.in/wp-content/uploads/2025/03/RenewalGuidelines-WebsiteHosting.pdf' },
      { label: 'Guidelines for Factory Surveillance', href: 'https://www.bis.gov.in/wp-content/uploads/2026/02/FactorySurveillance-Guidelines-25Feb2026.pdf' },
      { label: 'Change in Scope of Licence', href: 'https://www.bis.gov.in/wp-content/uploads/2021/05/Website-GuidelinesForChangeInScopeOfLicence_may.pdf' }
    ],
    warnings: [
      'Using the ISI mark on a product outside your licence scope is misuse of the Standard Mark.',
      'Surveillance visits are unannounced.'
    ],
    facts: [
      {
        label: 'Recurring fees',
        value: 'Annual licence fee of Rs. 1,000 plus the minimum marking fee specified for the product.',
        sourceId: 'SRC-CERT-FAQ'
      },
      {
        label: 'Validity and renewal',
        value:
          'Licence is granted initially up to two years and may be renewed up to five years from the last date of validity.',
        sourceId: 'SRC-CERT-FAQ'
      }
    ],
    sourceIds: ['SRC-CERT-FAQ', 'SRC-RENEWAL', 'SRC-FACTORY-SURVEILLANCE', 'SRC-CHANGE-SCOPE', 'SRC-CERT-FEE'],
    confidence: 'confirmed'
  }
];

// ── Scheme-II / CRS (registration, test-report led) ──────────────────────────

const schemeIIStages: CertificationJourneyStage[] = [
  stageIdentifyStandard(['SRC-LIST-SCHEME-II']),
  stageRequirement(['SRC-LIST-SCHEME-II', 'SRC-CRS-ABOUT']),
  {
    key: 'prepare',
    step: 3,
    title: STAGE_TITLES[2],
    plainQuestion: 'What do I need in place before I can register?',
    whyItMatters:
      'Under CRS there is no factory visit in the published registration process, so the burden sits on the test report and on your declaration. What you need ready is a portal account, a clean identity trail for your factory, and a sample that genuinely represents production.',
    description:
      'Create credentials on the CRS portal, supported by your business licence in English. Then prepare the sample and the paperwork: registration is granted on a self-declaration of conformity, so the documents you upload and the undertaking you sign are what BIS relies on.',
    checklist: [
      'Create login credentials on the CRS portal',
      'Have your business licence available in English',
      'Confirm the exact model and brand names you want registered',
      'Prepare a sample that represents regular production',
      'Collect the documents named on the CRS document checklist',
      'Read the undertaking you will have to sign before you sign it'
    ],
    documents: [
      'Business licence / proof of establishment (in English)',
      'Factory and brand details',
      'Documents as per the CRS checklist',
      'Undertaking declaring conformity'
    ],
    actions: [
      { label: 'CRS registration process', href: 'https://www.crsbis.in/BIS/registration-page.do' },
      { label: 'About CRS', href: 'https://www.crsbis.in/BIS/about-crs.do' }
    ],
    warnings: [
      'Registration rests on your own declaration of conformity. A declaration that does not hold up is your liability, not the laboratory\'s.'
    ],
    facts: [
      {
        label: 'Basis of grant',
        value:
          'Registration is granted on self-declaration of conformity, supported by a test report from a BIS-recognised laboratory.',
        sourceId: 'SRC-CRS-ABOUT'
      },
      {
        label: 'Who applies',
        value: 'The manufacturer (factory owner) of a product covered by a Compulsory Registration Order applies.',
        sourceId: 'SRC-CRS-ABOUT'
      }
    ],
    sourceIds: ['SRC-CRS-ABOUT', 'SRC-CRS-REGISTRATION'],
    confidence: 'confirmed'
  },
  {
    key: 'testing',
    step: 4,
    title: STAGE_TITLES[3],
    plainQuestion: 'How does testing work here — and does it come before applying?',
    whyItMatters:
      'Yes. Under CRS testing comes first: you cannot apply without a verified test report. Two deadlines run from this stage, and missing either one means starting the test cycle again.',
    description:
      'Generate a test request on the portal and choose an approved laboratory from the BIS list. Send the sample together with the test request to that laboratory within 60 days of generating the request. When the laboratory issues the report, verify it on the portal — then you have 90 days from its issue to apply.',
    checklist: [
      'Generate a test request on the CRS portal',
      'Select an approved laboratory from the BIS recognised-lab list',
      'Send the sample and the test request to the lab within 60 days of generating the request',
      'Verify the test report on the portal once issued',
      'Apply within 90 days of the test report being issued'
    ],
    documents: ['Test request', 'Test report from a BIS-recognised laboratory'],
    actions: [
      { label: 'BIS recognised labs (CRS)', href: 'https://www.crsbis.in/BIS/bis_lab.do' },
      { label: 'Find Testing Labs', to: '/labs' },
      { label: 'CRS registration process', href: 'https://www.crsbis.in/BIS/registration-page.do' }
    ],
    warnings: [
      'Sample and test request must reach the laboratory within 60 days of generating the test request.',
      'The application must be made within 90 days of the issue of the test report.'
    ],
    facts: [
      {
        label: 'Sample deadline',
        value: 'Send the sample and test request to the laboratory within 60 days of generating the test request.',
        sourceId: 'SRC-CRS-REGISTRATION'
      },
      {
        label: 'Application deadline',
        value: 'Apply using the verified test report within 90 days of its issue.',
        sourceId: 'SRC-CRS-REGISTRATION'
      }
    ],
    sourceIds: ['SRC-CRS-REGISTRATION', 'SRC-CRS-LABS'],
    confidence: 'confirmed'
  },
  {
    key: 'application',
    step: 5,
    title: STAGE_TITLES[4],
    plainQuestion: 'Where do I apply for registration?',
    whyItMatters:
      'CRS applications go through the CRS portal, not the manakonline product-certification portal. Applying in the wrong place is a common first mistake for manufacturers who have read general BIS licensing material.',
    description:
      'Apply on the CRS portal using the verified test report, with the documents on the checklist and the undertaking declaring conformity. Registration is granted against the specific Indian Standard, product, brand and model you declare.',
    checklist: [
      'Apply on the CRS portal, not on manakonline',
      'Attach the verified test report',
      'Upload every document on the CRS checklist',
      'Submit the undertaking declaring conformity',
      'Pay the applicable fee and keep the receipt',
      'Track the application on the portal and answer queries promptly'
    ],
    documents: [
      'Verified test report',
      'Documents as per the CRS checklist',
      'Undertaking declaring conformity',
      'Proof of fee payment'
    ],
    actions: [
      { label: 'Apply on the CRS portal', href: 'https://www.crsbis.in/BIS/registration-page.do' },
      { label: 'Scheme-II compulsory certification list', href: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/' }
    ],
    warnings: [
      'Confirm the current fee on the official portal — fee schedules are revised by notification.'
    ],
    facts: [],
    sourceIds: ['SRC-CRS-REGISTRATION', 'SRC-LIST-SCHEME-II'],
    confidence: 'confirmed'
  },
  {
    key: 'assessment',
    step: 6,
    title: STAGE_TITLES[5],
    plainQuestion: 'Will BIS inspect my factory under CRS?',
    whyItMatters:
      'The published CRS process is document-and-test based — it does not include a pre-grant factory visit like Scheme-I. What BIS scrutinises instead is your test report, your documents and your declaration.',
    description:
      'BIS examines the application, the verified test report and the supporting documents, and raises queries where something does not match. Because there is no factory assessment in the published process, discrepancies between your declared models, your brand names and your test report are the usual cause of delay.',
    checklist: [
      'Answer portal queries quickly and completely',
      'Keep the declared models, brands and test report perfectly consistent',
      'Retain evidence supporting your declaration of conformity',
      'Do not ship product bearing the mark before registration is granted'
    ],
    documents: ['Query responses', 'Supporting evidence for the declaration'],
    actions: [
      { label: 'About CRS', href: 'https://www.crsbis.in/BIS/about-crs.do' },
      { label: 'CRS registration process', href: 'https://www.crsbis.in/BIS/registration-page.do' }
    ],
    warnings: [
      'BIS does carry out surveillance and market sampling after registration even though there is no pre-grant factory visit in the published process.'
    ],
    facts: [],
    sourceIds: ['SRC-CRS-ABOUT', 'SRC-CRS-REGISTRATION'],
    confidence: 'inferred'
  },
  {
    key: 'certificate',
    step: 7,
    title: STAGE_TITLES[6],
    plainQuestion: 'What do I get, and what must I keep doing?',
    whyItMatters:
      'You get a registration with a unique R-number rather than a factory licence. The legal duty attaches to every unit you sell: the goods must conform to the named Indian Standard and must carry the Standard Mark with your BIS registration number.',
    description:
      'Mark the product or its packaging with the Standard Mark and your R-number as required, keep the product conforming to the standard, and keep the registration current. Registration covers only the models and brands you declared — adding a model means going back through testing and registration for it.',
    checklist: [
      'Apply the Standard Mark with your unique R-number as required',
      'Mark only the models and brands actually registered',
      'Keep the product conforming to the named Indian Standard on a continuing basis',
      'Renew the registration before it lapses',
      'Register any new model or brand before selling it'
    ],
    documents: ['Registration letter with R-number', 'Marking artwork showing the R-number'],
    actions: [
      { label: 'About CRS', href: 'https://www.crsbis.in/BIS/about-crs.do' },
      { label: 'CRS portal', href: 'https://www.crsbis.in/BIS/registration-page.do' }
    ],
    warnings: [
      'No person shall manufacture, store for sale, import, sell or distribute covered goods that do not conform to the named Indian Standard and do not bear the Standard Mark with the BIS registration number.'
    ],
    facts: [
      {
        label: 'What you receive',
        value:
          'BIS grants a licence to use or apply the Standard Mark with a unique R-number through registration based on self-declaration of conformity.',
        sourceId: 'SRC-CRS-ABOUT'
      }
    ],
    sourceIds: ['SRC-CRS-ABOUT'],
    confidence: 'confirmed'
  }
];

// ── FMCS (factory outside India) ─────────────────────────────────────────────

const fmcsStages: CertificationJourneyStage[] = [
  stageIdentifyStandard(['SRC-FMCS-HOW-TO-APPLY']),
  stageRequirement(['SRC-FMCS-HOW-TO-APPLY']),
  {
    key: 'prepare',
    step: 3,
    title: STAGE_TITLES[2],
    plainQuestion: 'What does a foreign manufacturer need that a domestic one does not?',
    whyItMatters:
      'Two things are specific to FMCS and both take time to arrange: an Authorized Indian Representative who is answerable to BIS on your behalf, and a performance bank guarantee from a bank with an RBI-approved branch in India. Start on both early — neither is a same-week task.',
    description:
      'Alongside the manufacturing and quality-control readiness any BIS licence requires, prepare the FMCS-specific items: nominate your Authorized Indian Representative on Form-VI, and line up the bank that will issue the performance bank guarantee after grant.',
    checklist: [
      'Identify an Authorized Indian Representative who is an Indian resident and at least a graduate',
      'Prepare the Form-VI nomination for the AIR',
      'Identify a bank with an RBI-approved branch in India for the performance guarantee',
      'Put the manufacturing and in-house testing arrangements for the standard in place',
      'Collect the documents on the FMCS application checklist',
      'Have documents in English or with certified translation'
    ],
    documents: [
      'Form-VI nomination of the Authorized Indian Representative',
      'Proof of establishment of the manufacturing unit',
      'List of manufacturing and testing equipment with calibration records',
      'Documents as per the FMCS checklist'
    ],
    actions: [
      { label: 'Nomination of AIR', href: 'https://www.bis.gov.in/fmcs/certification-process/nomination-of-air/' },
      { label: 'FMCS — How to Apply', href: 'https://www.bis.gov.in/fmcs/certification-process/how-to-apply/' }
    ],
    warnings: ['The AIR is endorsed on the licence, so choose someone who can actually act for you in India.'],
    facts: [
      {
        label: 'Who the AIR must be',
        value:
          'The Authorized Indian Representative shall be an Indian resident, at least a graduate, and is nominated on Form-VI.',
        sourceId: 'SRC-FMCS-AIR'
      }
    ],
    sourceIds: ['SRC-FMCS-AIR', 'SRC-FMCS-HOW-TO-APPLY'],
    confidence: 'confirmed'
  },
  {
    key: 'testing',
    step: 4,
    title: STAGE_TITLES[3],
    plainQuestion: 'Who tests the samples, and who pays?',
    whyItMatters:
      'Samples drawn at your factory are tested independently, and the cost and safe deposition of those samples sit with you. For a factory outside India that also means planning shipping and customs into the timeline.',
    description:
      'Samples are drawn during the factory visit and sent for independent testing. Responsibility for safe deposition of the samples and for remitting the testing charges lies with the applicant firm. Your own in-house testing against the standard still has to be in place, because BIS assesses that capability during the visit.',
    checklist: [
      'Confirm the tests the Indian Standard requires for your product',
      'Have the in-house test facility operational for the visit',
      'Budget for independent testing charges',
      'Plan sample shipment logistics and customs in advance',
      'Keep test records traceable to the sampled batch'
    ],
    documents: ['Independent test reports on drawn samples', 'In-house test records'],
    actions: [
      { label: 'FMCS — Grant of Licence', href: 'https://www.bis.gov.in/fmcs/certification-process/grant-of-licence/' },
      { label: 'Testing facilities by IS number', href: 'https://lims.bis.gov.in/home/search_is_number/' }
    ],
    warnings: ['Sample deposition and testing charges are the applicant firm\'s responsibility.'],
    facts: [
      {
        label: 'Who bears testing cost',
        value:
          'Responsibility for safe deposition of samples and remittance of testing charges lies with the applicant firm.',
        sourceId: 'SRC-FMCS-GRANT'
      }
    ],
    sourceIds: ['SRC-FMCS-GRANT', 'SRC-TESTING-FACILITIES'],
    confidence: 'confirmed'
  },
  {
    key: 'application',
    step: 5,
    title: STAGE_TITLES[4],
    plainQuestion: 'How and where do I apply from outside India?',
    whyItMatters:
      'The route is changing. Hard-copy applications are accepted only up to 31 May 2026; from 01 June 2026 BIS accepts only applications submitted through the online portal.',
    description:
      'Complete the prescribed application form with the documentation on the checklist, nominate your AIR on Form-VI, and submit through the manakonline FMCS portal with the requisite fees.',
    checklist: [
      'Register on the manakonline FMCS portal',
      'Complete the prescribed application form',
      'Attach the Form-VI AIR nomination',
      'Upload the checklist documents',
      'Pay the requisite fees',
      'Submit online — hard copy is not accepted from 01 June 2026'
    ],
    documents: ['Completed FMCS application', 'Form-VI', 'Checklist documents', 'Proof of fee payment'],
    actions: [
      { label: 'Apply on the FMCS portal', href: 'https://www.manakonline.in/FMCS/eBISLogin' },
      { label: 'FMCS — How to Apply', href: 'https://www.bis.gov.in/fmcs/certification-process/how-to-apply/' }
    ],
    warnings: ['From 01 June 2026, only applications submitted through the online portal are accepted.'],
    facts: [
      {
        label: 'Online only',
        value:
          'Hard-copy applications are accepted up to 31 May 2026; from 01 June 2026 only online applications are accepted.',
        sourceId: 'SRC-FMCS-HOW-TO-APPLY'
      }
    ],
    sourceIds: ['SRC-FMCS-HOW-TO-APPLY', 'SRC-FMCS-APPLY-ONLINE'],
    confidence: 'confirmed'
  },
  {
    key: 'assessment',
    step: 6,
    title: STAGE_TITLES[5],
    plainQuestion: 'What does BIS do after I apply, and how long does it take?',
    whyItMatters:
      'FMCS takes materially longer than a domestic licence — generally around six months from the point a complete application is recorded. Planning your India launch on a shorter assumption is the single most common commercial error here.',
    description:
      'BIS examines the application and raises queries by email. A visit is paid to the factory location and samples are drawn for independent testing. On a satisfactory inspection report together with satisfactory independent test reports, BIS moves to grant.',
    checklist: [
      'Monitor email for BIS queries and reply completely',
      'Prepare the factory and records for the audit visit',
      'Have the AIR available and informed',
      'Be ready for samples to be drawn and shipped for testing',
      'Plan for roughly six months from a complete application'
    ],
    documents: ['Inspection report', 'Independent test reports', 'Query correspondence'],
    actions: [
      { label: 'FMCS — Grant of Licence', href: 'https://www.bis.gov.in/fmcs/certification-process/grant-of-licence/' },
      { label: 'FMCS — Certification Process', href: 'https://www.bis.gov.in/fmcs/certification-process/how-to-apply/' }
    ],
    warnings: ['Timelines run from recording of a complete application, not from your first submission.'],
    facts: [
      {
        label: 'Typical time to grant',
        value: 'Average time taken for grant of licence is generally six months from recording of a complete application.',
        sourceId: 'SRC-FMCS-GRANT'
      }
    ],
    sourceIds: ['SRC-FMCS-GRANT'],
    confidence: 'confirmed'
  },
  {
    key: 'certificate',
    step: 7,
    title: STAGE_TITLES[6],
    plainQuestion: 'What do I sign and pay at the end?',
    whyItMatters:
      'Grant is conditional on completing several steps after the decision: fees, an agreement, an indemnity bond and a performance bank guarantee. Until those are done there is no licence to mark against.',
    description:
      'On a satisfactory inspection and test outcome you pay the licence fee, advance minimum marking fee and dues, sign the agreement and indemnity bond, and furnish the performance bank guarantee. The licence names your AIR and is time-limited.',
    checklist: [
      'Pay licence fee, advance minimum marking fee and dues',
      'Sign the agreement and indemnity bond',
      'Furnish the USD 10,000 performance bank guarantee from a bank with an RBI-approved branch in India',
      'Confirm the AIR endorsement on the licence',
      'Use the ISI mark only within the licence scope',
      'Diarise renewal ahead of the validity date'
    ],
    documents: ['BIS licence', 'Agreement and indemnity bond', 'Performance bank guarantee'],
    actions: [
      { label: 'FMCS — Grant of Licence', href: 'https://www.bis.gov.in/fmcs/certification-process/grant-of-licence/' },
      { label: 'Nomination of AIR', href: 'https://www.bis.gov.in/fmcs/certification-process/nomination-of-air/' }
    ],
    warnings: ['The performance bank guarantee is furnished after the licence is granted — budget for it up front.'],
    facts: [
      {
        label: 'Performance bank guarantee',
        value:
          'A performance bank guarantee of USD 10,000 from a bank having an RBI-approved branch in India is furnished after grant.',
        sourceId: 'SRC-FMCS-GRANT'
      },
      {
        label: 'Validity',
        value: 'Granted initially for not less than one year and up to two years, then renewable up to five years.',
        sourceId: 'SRC-FMCS-GRANT'
      }
    ],
    sourceIds: ['SRC-FMCS-GRANT', 'SRC-FMCS-AIR'],
    confidence: 'confirmed'
  }
];

// ── Schemes where BIS publishes the detail only in documents we have not parsed ──

/**
 * Honest fallback: the stage exists, but rather than borrowing Scheme-I wording we say
 * where the authoritative procedure lives and mark the stage `unknown`.
 */
function referredStage(
  key: string,
  step: number,
  title: string,
  plainQuestion: string,
  whyItMatters: string,
  scheme: { name: string; url: string; label: string },
  sourceIds: string[]
): CertificationJourneyStage {
  return {
    key,
    step,
    title,
    plainQuestion,
    whyItMatters,
    description: `BIS publishes the ${scheme.name} procedure for this stage on its own pages and guideline documents rather than as a general process. Read the official source below before planning this stage — the Scheme-I (ISI mark) sequence does not automatically apply.`,
    checklist: [`Read the official ${scheme.name} guidance for this stage`],
    documents: [],
    actions: [{ label: scheme.label, href: scheme.url }],
    warnings: [`We do not assert step-level detail for ${scheme.name} that BIS has not published in a form we can cite.`],
    facts: [],
    sourceIds,
    confidence: 'unknown'
  };
}

function referredScheme(scheme: { name: string; url: string; label: string }, sourceIds: string[]): CertificationJourneyStage[] {
  return [
    stageIdentifyStandard(sourceIds),
    stageRequirement(sourceIds),
    referredStage('prepare', 3, STAGE_TITLES[2], 'What must my factory and quality control look like?', 'The capability BIS expects is set by the standard and by the scheme-specific guidance, and it differs between schemes.', scheme, sourceIds),
    referredStage('testing', 4, STAGE_TITLES[3], 'Which tests are required, and by whom?', 'Testing arrangements differ by scheme — who may test, when, and how long a report stays valid.', scheme, sourceIds),
    referredStage('application', 5, STAGE_TITLES[4], 'Where do I apply and what does it cost?', 'This scheme uses its own portal and fee schedule; applying in the wrong place wastes weeks.', scheme, sourceIds),
    referredStage('assessment', 6, STAGE_TITLES[5], 'What will BIS assess?', 'Whether there is a factory visit at all depends on the scheme.', scheme, sourceIds),
    referredStage('certificate', 7, STAGE_TITLES[6], 'What do I receive and what are my ongoing duties?', 'Some schemes grant a continuing licence, others a certificate of conformity — the ongoing obligations differ accordingly.', scheme, sourceIds)
  ];
}

const stagesByScheme: Record<SchemeCode, CertificationJourneyStage[]> = {
  'scheme-i': schemeIStages,
  'scheme-ii': schemeIIStages,
  'scheme-iv': referredScheme(
    { name: 'Scheme-IV (Certificate of Conformity)', url: 'https://www.bis.gov.in/product-certification/product-certification-process/', label: 'Scheme-IV guidance (BIS)' },
    ['SRC-CA-REG-SCHEME-IV', 'SRC-CERT-PROCESS', 'SRC-LIST-SCHEME-IV']
  ),
  'scheme-x': referredScheme(
    { name: 'Scheme-X', url: 'https://www.bis.gov.in/scheme-x-certification/', label: 'Scheme-X Certification (BIS)' },
    ['SRC-SCHEME-X', 'SRC-SCHEME-X-PROCESS', 'SRC-LIST-SCHEME-X']
  ),
  fmcs: fmcsStages,
  hallmarking: referredScheme(
    { name: 'Hallmarking', url: 'https://www.bis.gov.in/hallmarking-overview/', label: 'BIS Hallmarking' },
    ['SRC-HALLMARKING']
  )
};

/** Journey stages when we do not yet know the product or the scheme. */
export const unknownSchemeStages: CertificationJourneyStage[] = [
  stageIdentifyStandard([]),
  stageRequirement([]),
  referredStage('prepare', 3, STAGE_TITLES[2], 'What will I need in my factory?', 'What BIS expects depends on the standard and the scheme, so this cannot be answered before both are known.', { name: 'BIS product certification', url: 'https://www.bis.gov.in/product-certification/product-certification-process/', label: 'Product Certification Process' }, ['SRC-CERT-PROCESS']),
  referredStage('testing', 4, STAGE_TITLES[3], 'Which tests will I need?', 'Tests come from the Indian Standard for your product, so the standard has to be identified first.', { name: 'BIS product certification', url: 'https://www.bis.gov.in/product-certification/product-certification-process/', label: 'Product Certification Process' }, ['SRC-CERT-PROCESS']),
  referredStage('application', 5, STAGE_TITLES[4], 'Where will I apply?', 'Different schemes use different portals — manakonline, the CRS portal or the Scheme-X portal.', { name: 'BIS product certification', url: 'https://www.bis.gov.in/product-certification/product-certification-process/', label: 'Product Certification Process' }, ['SRC-CERT-PROCESS', 'SRC-MANAK-ONLINE']),
  referredStage('assessment', 6, STAGE_TITLES[5], 'Will BIS visit my factory?', 'Scheme-I includes a factory assessment; the published CRS process does not.', { name: 'BIS product certification', url: 'https://www.bis.gov.in/product-certification/product-certification-process/', label: 'Product Certification Process' }, ['SRC-CERT-PROCESS']),
  referredStage('certificate', 7, STAGE_TITLES[6], 'What will I receive?', 'A licence to use the ISI mark, a registration with an R-number, or a certificate of conformity — depending on the scheme.', { name: 'BIS product certification', url: 'https://www.bis.gov.in/product-certification/product-certification-process/', label: 'Product Certification Process' }, ['SRC-CERT-PROCESS'])
];

export function getStagesForScheme(code: SchemeCode): CertificationJourneyStage[] {
  return stagesByScheme[code] ?? unknownSchemeStages;
}

export const journeyStageTitles = STAGE_TITLES;
