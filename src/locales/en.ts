export const en = {
  nav: {
    home: 'Home',
    standards: 'Standards',
    certificationGuide: 'Certification Guide',
    labs: 'Testing Laboratories',
    hallmarking: 'Hallmarking',
    consumerHelp: 'Consumer Help',
    yourAccount: 'Your Account',
    myQueries: 'My Queries',
    uploadDocument: 'Upload Document',
    savedItems: 'Saved Items',
    settings: 'Settings',
    needHelp: 'Need Help?',
    contactSupportDesc: 'Contact our support team for technical assistance.',
    contactSupport: 'Contact Support',
    askSmartGuide: 'Ask SmartGuide'
  },
  header: {
    searchPlaceholder: 'Search standards, products, or ask a question...',
    searchButton: 'Search',
    signIn: 'Sign In',
    profile: 'Profile',
    signOut: 'Sign Out',
    bis: 'Bureau of Indian Standards',
    bisSub: 'The National Standards Body of India'
  },
  notifications: {
    title: 'Notifications',
    new: 'new',
    empty: 'No notifications yet.'
  },
  home: {
    goi: 'Government of India',
    nationalPortal: 'National Portal for Indian Standards',
    serviceBy: 'A service by the Bureau of Indian Standards',
    searchAcross: 'Search across standards, certification schemes and testing laboratories',
    popularFeatured: 'Popular & featured',
    welcome: 'Welcome to',
    welcomeBrand: 'BIS SmartGuide',
    subtitle: 'Your intelligent guide to Indian Standards, Certification, Testing, Hallmarking and more.',
    searchTitle: 'What can we help you find today?',
    searchPlaceholder: 'e.g. I manufacture LED bulbs, which BIS standard applies to me?',
    findStandards: 'Find Standards',
    popularSearches: 'Popular searches:',
    popular: {
      waterPurifier: 'Water Purifier',
      ledBulb: 'LED Bulb',
      steelBottle: 'Steel Bottle',
      goldJewellery: 'Gold Jewellery',
      pressureCooker: 'Pressure Cooker',
      electricalSwitch: 'Electrical Switch',
      helmet: 'Helmet',
      textile: 'Textiles'
    },
    exploreServices: 'Explore Services',
    services: {
      findStandard: {
        title: 'Find Standard',
        desc: 'Search and discover applicable Indian Standards.'
      },
      certification: {
        title: 'Certification Guide',
        desc: 'Step-by-step guide to get certified.'
      },
      labs: {
        title: 'Testing Laboratories',
        desc: 'Find recognized labs near you.'
      },
      hallmarking: {
        title: 'Hallmarking',
        desc: 'Verify HUID, understand hallmarking and find assaying centres.'
      },
      consumerHelp: {
        title: 'Consumer Help',
        desc: 'Get answers to consumer queries and file complaints.'
      },
      askSmartGuide: {
        title: 'Ask SmartGuide',
        desc: 'Ask any question related to BIS, standards or certification.'
      }
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Get the right guidance in 3 simple steps',
      step1Title: '1. Describe Your Product',
      step1Desc: 'Tell us about your product or upload a document.',
      step2Title: '2. Get AI Analysis',
      step2Desc: 'Our AI finds relevant standards, requirements and guidance.',
      step3Title: '3. Take Action',
      step3Desc: 'Follow the certification path and stay compliant.'
    },
    whyBis: {
      title: 'Why BIS SmartGuide',
      point1: 'Accurate & Source-backed Information',
      point2: 'Saves Time & Effort',
      point3: 'Simple & Easy to Use',
      point4: 'Available in Multiple Languages'
    },
    recentQueries: 'Recent Queries',
    viewAll: 'View All',
    announcement: 'Latest Announcement',
    readMore: 'Read More',
    bisResources: 'BIS Resources',
    knowYourStandard: 'Know Your Standard',
    productCertification: 'Product Certification',
    bisCareApp: 'BIS Care App',
    exploreBtn: 'Explore'
  },
  // UI chrome for the Certification Guide (page + all child components). Official regulatory
  // *content* — quoted BIS snippets, IS numbers, scheme names, QCO codes, URLs — stays in the
  // data layer and is localized there via a Hindi overlay, not here.
  certification: {
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Certification',
    title: 'Certification Guide',
    subtitle: 'Get the right certification guidance for your product.',
    journeyTitle: 'Your certification journey',
    journeyHint:
      'Seven stages from product to ongoing compliance. What each stage asks of you depends on your scheme and your standard — select a stage to see its detail.',
    indicativeTimeline: 'Indicative timeline:',
    indicativeCost: 'Indicative cost:',
    estimateNote: 'Planning estimates held in SmartGuide — confirm current fees and timelines with BIS.',
    errorTitle: 'We could not build your certification guidance',
    errorDesc:
      'Something went wrong while assembling the guidance for this product. Try again, or start from the applicable standard.',

    // Shared labels used by more than one child component.
    findApplicableStandard: 'Find applicable standard',
    whatBisStates: 'What BIS states',
    sourcePrefix: 'Source:',

    start: {
      heading: 'Select or describe your product to begin.',
      introBeforeQco:
        'Certification requirements are decided by the Indian Standard that covers your product — which tests you need, whether a ',
      introAfterQco:
        ' makes it compulsory, which scheme applies, and what BIS will check. Until we know your standard we can only show generic information, so tell us what you make.',
      productPlaceholder: 'e.g. stainless steel water bottle, LED bulb, pressure cooker',
      describeAria: 'Describe your product',
      knowBeforeLink: 'Already know your standard? Browse ',
      knowLink: 'Standards',
      knowBetween: ' and open ',
      knowCta: 'Get certification guidance',
      knowAfter: ' from the standard’s page.',
      suggestBefore: 'Standards that may cover ',
      yourProduct: 'your product',
      suggestSubtitle:
        'Pick the one whose scope matches your product. The certification guidance below will then be built for it.',
      seeAll: 'See all matching standards',
      match: {
        high: 'High match',
        medium: 'Medium match',
        low: 'Low match'
      }
    },

    help: {
      title: 'Need help?',
      desc: 'Ask a follow-up question about your product, or find a laboratory that can run the tests your standard requires.',
      askAssistant: 'Ask the assistant',
      findLabs: 'Find testing labs',
      contactBis: 'Contact BIS'
    },

    sources: {
      title: 'Official sources',
      desc: 'Only bis.gov.in, crsbis.in and the BIS portals — nothing on this page comes from a blog.',
      page: 'page',
      moreOne: 'more source is cited inside the individual steps above.',
      moreMany: 'more sources are cited inside the individual steps above.',
      typeLabel: {
        regulation: 'Regulation',
        guideline: 'Guideline',
        notification: 'Notification',
        website: 'BIS page',
        standard: 'Standard'
      }
    },

    scheme: {
      confConfirmed: 'Confirmed against BIS',
      confInferred: 'Best match — verify',
      confUnknown: 'Not determined yet',
      notDetermined: 'Certification scheme not determined',
      why: 'Why this scheme',
      inPlainWords: 'In plain words: ',
      whatYouGet: 'What you end up with',
      legalBasis: 'Legal basis',
      hideDetails: 'Hide scheme details',
      viewDetails: 'View scheme details',
      whoApplies: 'Who it applies to',
      howItWorks: 'How the scheme works',
      officialPages: 'Official pages for this scheme',
      goToPrefix: 'Go to ',
      checkListed: 'Check if your product is listed'
    },

    context: {
      originStandard: 'Carried over from the standard you were viewing',
      originProduct: 'Matched from the product you described',
      originNone: 'No product context yet',
      title: 'Your product context',
      product: 'Product',
      notSpecified: 'Not specified',
      applicableStandard: 'Applicable standard',
      notIdentifiedYet: 'Not identified yet',
      whereMfg: 'Where is your manufacturing unit?',
      mfgHint:
        'A factory outside India applies through a different BIS scheme, so this changes the guidance below.',
      inIndia: 'In India',
      outsideIndia: 'Outside India',
      changeProduct: 'Change product',
      changeStandard: 'Change standard'
    },

    stage: {
      confirmedLabel: 'From official BIS sources',
      confirmedNote: 'The statements in this step come from the BIS pages cited below.',
      inferredLabel: 'Assembled from BIS sources',
      inferredNote:
        'This step is put together from the BIS sources cited below rather than quoted from one instruction. Check the sources before you commit money or time.',
      unknownLabel: 'Read the official source',
      unknownNote:
        'BIS publishes this step inside a document we cannot quote here. We would rather point you at it than fill in a plausible answer.',
      step: 'Step',
      markedDone: 'Marked done',
      question: 'The question at this step',
      whyMatters: 'Why this matters',
      termsHere: 'Terms here',
      docsNeeded: 'Documents you will need at this step',
      doNext: 'Do this next',
      sourcesForStep: 'Sources for this step',
      prevStep: 'Previous step',
      markedAsDone: 'Marked as done',
      markStepDone: 'Mark this step done',
      nextStep: 'Next step'
    },

    verdict: {
      mandatory: 'Mandatory',
      voluntary: 'Voluntary',
      needsVerification: 'Check required',
      voluntaryUnlessBefore: 'BIS certification is voluntary unless a ',
      voluntaryUnlessAfter: ' makes it compulsory for your product.'
    },

    progress: {
      title: 'Your progress',
      youAreHere: 'You are here',
      upNext: 'Up next: '
    },

    checklist: {
      title: 'Checklist for this step',
      done: 'done'
    },

    glossary: {
      close: 'Close explanation',
      source: 'Source: '
    },

    warnings: {
      title: 'Watch out for'
    }
  },

  settings: {
    title: 'Settings',
    subtitle: 'Manage your account preferences and app settings',
    profile: {
      title: 'Profile Information',
      name: 'Name',
      email: 'Email',
      role: 'Role'
    },
    prefs: {
      title: 'Preferences',
      language: 'Language',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System Default'
    },
    notifs: {
      title: 'Notifications & Privacy',
      email: 'Email Notifications',
      emailDesc: 'Receive updates and newsletters via email.',
      push: 'Push Notifications',
      pushDesc: 'Receive real-time alerts in the browser.',
      data: 'Data Sharing',
      dataDesc: 'Share anonymous usage data to help us improve.'
    },
    actions: {
      reset: 'Reset Defaults',
      save: 'Save Settings'
    },
    toast: {
      saved: 'Settings saved successfully.',
      reset: 'Settings reset to defaults.'
    }
  },
  common: {
    general: 'General',
    explore: 'Explore',
    guest: 'Guest',
    search: 'Search',
    cancel: 'Cancel',
    submit: 'Submit',
    save: 'Save',
    saved: 'Saved',
    back: 'Back',
    close: 'Close',
    retry: 'Try Again',
    loading: 'Loading...',
    viewStandard: 'View Standard',
    viewDetails: 'View Details',
    relevanceScore: 'Relevance score',
    ai: 'AI:',
    highlyRelevant: 'Highly relevant based on product',
    errorTitle: 'Something went wrong',
    errorDesc: 'An error occurred while loading the data. Please try again.',
    noData: 'No data available',
    searchPlaceholder: 'Search...'
  },
  // Accessibility strings (aria-labels, alt text). User-facing to screen readers, so localized.
  a11y: {
    breadcrumb: 'Breadcrumb',
    tabs: 'Tabs',
    bisLogo: 'BIS Logo'
  },
  auth: {
    brandTagline: 'AI Standards & Certification Assistant'
  },
  labs: {
    title: 'BIS Recognized Testing Laboratories',
    subtitle: 'For Standard: IS 17803:2022',
    subtitleGeneric: 'BIS-recognised laboratories for product testing',
    forStandard: 'For standard:',
    filterByState: 'Filter laboratories by state',
    filterByStandard: 'Filter laboratories by standard',
    searchPlaceholder: 'Search by city or lab name...',
    allStates: 'All States',
    allStandards: 'All Standards',
    errorTitle: 'Error Loading Laboratories',
    errorDesc: 'Failed to load laboratories. Please try again later.',
    emptyTitle: 'No laboratories found',
    emptyDesc: 'Try adjusting your filters or search query to find relevant testing laboratories.',
    prototypeData: 'Prototype data — replace with official BIS laboratory data.',
    search: 'Search',
    relevanceScore: 'Relevance Score',
    ai: 'AI:',
    highlyRelevant: 'Highly relevant based on product',
    viewStandard: 'View Standard',
    cancel: 'Cancel',
    submit: 'Submit',
    save: 'Save',
    back: 'Back',
    loading: 'Loading...',
  },
  consumerHelp: {
    title: 'Consumer Help',
    subtitle: 'File complaints and get assistance with BIS related queries',
    faqTitle: 'Frequently Asked Questions',
    complaintTitle: 'File a Complaint',
    complaintDesc: 'Have an issue with a BIS certified product? Let us know.',
    submitComplaint: 'Submit Complaint',
    contactTitle: 'Contact Support',
    contactDesc: 'Need direct assistance? Our team is here to help.',
    callUs: 'Call Us',
  },
  hallmarking: {
    title: 'Hallmarking',
    subtitle: 'Verify HUID and understand gold/silver purity',
    verifyTitle: 'Verify HUID',
    verifyDesc: 'Enter the 6-digit alphanumeric HUID code to verify authenticity',
    verifyPlaceholder: 'Enter HUID Code...',
    verifyBtn: 'Verify',
    assayingTitle: 'Find Assaying & Hallmarking Centres',
    assayingDesc: 'Locate authorized centres near your city',
    purityTitle: 'Understanding Purity',
    purityDesc: 'Know the BIS hallmarking standards for precious metals',
  },
  savedItems: {
    title: 'Saved Items',
    subtitle: 'Your bookmarked standards and guidelines',
    emptyTitle: 'No saved items',
    emptyDesc: 'You havent saved any items yet. Bookmark standards to access them easily here.',
  },
  myQueries: {
    title: 'My Queries',
    subtitle: 'History of your questions and AI analysis',
    emptyTitle: 'No past queries',
    emptyDesc: 'Ask SmartGuide a question to see your query history here.',
  },
  uploadDocument: {
    title: 'Upload Document',
    subtitle: 'Upload your product manual or specifications for AI analysis',
    dragDrop: 'Drag and drop your file here, or click to browse',
    supportedFormats: 'Supported formats: PDF, DOCX, TXT',
    analyzeBtn: 'Analyze Document',
  },
  assistant: {
    welcome: 'Welcome to BIS SmartGuide! I can help you find relevant Indian Standards, understand certification processes, and more. Ask me anything related to BIS.',
    title: 'Ask BIS SmartGuide',
    subtitle: 'Your AI assistant for all BIS related queries.',
    placeholder: 'Type your question here...',
    send: 'Send',
    contextLabel: 'Asking about',
    standardQuestion: 'What are the certification and testing requirements for',
    errorMessage:
      'That question could not be answered just now. Please try again, or rephrase it.',
  },
  standards: {
    title: 'Standards Discovery',
    subtitle: 'Identify and understand applicable Indian Standards',
    backToHome: 'Back to Home',
    backToResults: 'Back to results',
    breadcrumbHome: 'Home',
    breadcrumbStandards: 'Standards',

    searchLabel: 'Search standards',
    searchPlaceholder: 'Search by product, material, or IS number...',
    searchHint: 'Describe your product, its material, intended use, or search directly by an IS number.',
    search: 'Search',
    clearSearch: 'Clear search',

    emptyTitle: 'Find the right Indian Standard',
    popularCategories: 'Popular categories',
    exampleSearches: 'Try an example search',
    categories: {
      electrical: 'Electrical',
      food: 'Food & Agriculture',
      construction: 'Construction',
      mechanical: 'Mechanical',
      consumer: 'Consumer Products',
      textiles: 'Textiles'
    },
    categoryNotInDataset: 'No standard in this prototype dataset is classified here yet.',
    examples: {
      waterPurifier: 'Water purifier',
      ledBulb: 'LED bulb',
      pressureCooker: 'Pressure cooker',
      steelBottle: 'Stainless steel bottle'
    },

    productTitle: 'Product identified',
    productPrototype: 'Prototype analysis based on your query. Verify against official BIS source.',
    productCategory: 'Category',
    productMaterial: 'Material',
    productUse: 'Intended use',
    productMatchStrength: 'Interpretation confidence',
    productNotIdentified: 'Could not identify a specific product from this query.',
    productEdit: 'Correct this',
    productEditHint: 'Change any detail we read wrongly, then re-run the recommendations.',
    productName: 'Product',
    productMaterialOptional: 'Material (optional)',
    productUseOptional: 'Intended use (optional)',
    productMaterialPlaceholder: 'e.g. Stainless steel',
    productUsePlaceholder: 'e.g. Drinking water',
    productUpdate: 'Update recommendations',
    productNotIdentifiedTitle: 'Product not identified',
    productNotIdentifiedDesc:
      'Your words were used to search, but they did not match a product this prototype knows. Correct the details below, or try a more specific description.',
    productAmbiguousTitle: 'More detail is needed',
    productAmbiguousDesc: 'is too broad to point to specific Indian Standards. Add the product type and what it is made of or used for.',
    productTypeQuestion: 'What type of product?',
    productTypePlaceholder: 'e.g. Injection moulding machine',
    productUseOrMaterial: 'Intended use or material',
    productUseOrMaterialPlaceholder: 'e.g. Industrial / steel',
    productUpdateSearch: 'Search again',

    recommendedTitle: 'Recommended standards',
    potentialTitle: 'Potentially applicable standards',
    resultsFor: 'Results for',
    standardsFound: 'standards found',
    showing: 'Showing',
    of: 'of',
    loadMore: 'Load More',
    filtersHid: 'filters are hiding some matches',
    clearToSeeAll: 'Clear filters to see all matches',

    filters: 'Filters',
    filtersTitle: 'Refine results',
    openFilters: 'Filters',
    clearFilters: 'Clear all',
    activeFilters: 'active',
    category: 'Category',
    sector: 'BIS sector',
    status: 'Status',
    relevanceFilter: 'Relevance',
    certification: 'Certification requirement',
    icsGroup: 'ICS subject group',
    icsHint: 'ICS is the international subject classification carried by each standard.',
    latestRevisionOnly: 'Current revisions only',
    latestRevisionHint: 'Hides standards that are withdrawn or under revision.',
    allCategories: 'All categories',
    allSectors: 'All sectors',
    allStatuses: 'All statuses',
    allRelevance: 'Any relevance',
    allCertification: 'Any requirement',
    allIcs: 'All ICS groups',

    sortLabel: 'Sort by',
    mostRelevant: 'Most Relevant',
    recent: 'Recently Updated',
    az: 'A–Z',
    standardNumber: 'Standard Number',

    relevance: {
      high: 'High relevance',
      medium: 'Medium relevance',
      low: 'Low relevance'
    },
    relevanceShort: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    matchScore: 'Match score',
    whyRelevant: 'Why this is relevant',
    matchedOn: 'Matched on',
    noReason: 'Listed because it matches the filters you selected.',

    notFoundTitle: 'No standards match this search',
    notFoundDesc: 'Nothing in the current dataset matches your query and filters.',
    tryInstead: 'Try one of these instead',
    tryAnother: 'Try Another Search',
    askSmartGuide: 'Ask SmartGuide',
    askAboutThis: 'Ask SmartGuide',
    askAria: 'Ask SmartGuide about this standard',

    errorTitle: 'Could not load standards',
    errorDesc: 'Something went wrong while searching. Please try again.',

    whyTitle: 'Why these standards?',
    whyDesc: 'Each result is matched by comparing your query against the title, scope, description and requirements recorded for every standard.',
    whyEmpty: 'Search for a product to see how standards are matched.',
    viewAnalysis: 'View Detailed Analysis',
    analysisTitle: 'How these standards were matched',
    analysis: {
      interpreted: 'Terms searched',
      interpretedNote: 'Words you typed, plus related keywords added by the product interpretation.',
      weights: 'Points per matched field',
      weightsNote: 'A full-phrase match on a field scores the points shown. Single words score less, and keywords added by interpretation score half.',
      thresholds: 'Relevance bands',
      thresholdsHigh: 'High relevance from',
      thresholdsMedium: 'Medium relevance from',
      thresholdsLow: 'Below that, low relevance',
      points: 'points',
      topMatches: 'Top matches and their signals',
      limitations: 'Limits of this analysis',
      limitation: {
        'text-matching': 'This is text matching over the project dataset, not a semantic or legal assessment.',
        'not-official-ranking': 'The scores and bands are this prototype’s own. They are not BIS ranking rules.',
        'dataset-subset': 'The dataset holds a small subset of Indian Standards, so a genuinely applicable standard may be absent.',
        'verify-source': 'Confirm any standard against the official BIS source before acting on it.'
      }
    },
    signal: {
      'standard-number': 'Standard number',
      title: 'Title',
      scope: 'Official scope',
      description: 'Description',
      requirement: 'Key requirement',
      category: 'Category',
      sector: 'BIS sector',
      'product-category': 'Interpreted product category'
    },

    // Keyed by the literal values held in src/data/standards.ts so a label is only ever
    // shown for a value that exists in the dataset.
    statusLabel: {
      active: 'Active',
      'under-revision': 'Under revision',
      withdrawn: 'Withdrawn'
    },
    certLabel: {
      mandatory: 'Mandatory (BIS certification required)',
      voluntary: 'Voluntary',
      'self-declaration': 'Self-declaration'
    },
    certLabelShort: {
      mandatory: 'Mandatory',
      voluntary: 'Voluntary',
      'self-declaration': 'Self-declaration'
    },
    categoryLabel: {
      Household: 'Household',
      Electrical: 'Electrical',
      Food: 'Food',
      Construction: 'Construction',
      'Consumer Goods': 'Consumer Goods',
      Other: 'Other'
    },
    sectorLabel: {
      Metallurgical: 'Metallurgical',
      Mechanical: 'Mechanical',
      Electrotechnical: 'Electrotechnical',
      'Food and Agriculture': 'Food and Agriculture',
      'Civil Engineering': 'Civil Engineering',
      Chemical: 'Chemical',
      Other: 'Other'
    },

    aiAssisted: 'AI-assisted recommendation',
    verifyOfficial: 'Verify against official BIS source',
    prototypeNote: 'Prototype data — verify against official BIS sources.',
    officialFacts: 'From the BIS record',
    interpretation: 'System interpretation',
    interpretationNote: 'Generated by this prototype from the text above, not quoted from BIS.',

    evidence: {
      title: 'Source documents',
      note: {
        'clause-level': 'The documents below include a specific clause or section for this standard.',
        'document-only': 'The documents below reference this standard, but no clause-level extract is held.',
        none: 'No source document is on file for this standard in the prototype dataset.'
      },
      catalogueRef: 'Catalogue reference',
      catalogueRefNote: 'A pointer to the standard’s own entry, not an extract from it.',
      clause: 'Clause',
      section: 'Section',
      page: 'Page',
      openDocument: 'Open document',
      viewSource: 'View source',
      viewAllSources: 'View all sources',
      sourcesCount: 'source document(s)',
      noneShort: 'No source on file'
    },

    version: {
      current: 'Current revision',
      'under-revision': 'Under revision',
      withdrawn: 'Withdrawn',
      underRevisionNote: 'BIS records this standard as under revision. A newer revision may be published.',
      withdrawnNote: 'This standard has been withdrawn. Do not rely on it without checking the current replacement.',
      supersededBy: 'Superseded by',
      viewLatest: 'View Latest',
      checkLatest: 'Check Current Revision',
      verifyNote: 'Opens the official BIS standards catalogue.'
    },

    related: {
      title: 'Related standards',
      none: 'No related standards are recorded for this standard.',
      basis: {
        declared: 'Listed as related in the BIS record',
        'same-ics-group': 'Same ICS subject group',
        'same-category': 'Same category in this dataset'
      },
      basisNote: 'Relations derived from shared classification are this prototype’s grouping, not a BIS declaration.'
    },

    compare: {
      add: 'Compare',
      added: 'Added to compare',
      remove: 'Remove from compare',
      title: 'Compare standards',
      open: 'Compare',
      clear: 'Clear',
      limit: 'You can compare up to 3 standards.',
      empty: 'Select at least two standards to compare.',
      selected: 'selected',
      field: 'Field',
      close: 'Close comparison'
    },

    save: {
      save: 'Save',
      saved: 'Saved',
      aria: 'Save standard',
      savedToast: 'Standard saved.',
      removedToast: 'Standard removed from saved items.',
      viewSaved: 'View saved items'
    },

    actions: {
      viewStandard: 'View Standard',
      viewDetails: 'View Details',
      certification: 'Get Certification Guidance',
      certificationDesc: 'Check schemes & requirements',
      labs: 'Find Testing Laboratories',
      labsDesc: 'Authorized testing facilities',
      ask: 'Ask SmartGuide',
      askDesc: 'Chat about this standard'
    },

    needHelp: 'Need Help?',
    needHelpDesc: 'Unsure which standard applies? Ask our intelligent assistant.',

    notFoundStandard: 'Standard not found.',
    notFoundStandardDesc: 'No standard with this identifier exists in the dataset.',
    backToStandards: 'Back to Standards'
  },
  standardDetails: {
    scope: 'Scope',
    techScope: 'Technical Scope:',
    extractedRequirements: 'Key Requirements',
    requirementsNote: 'Recorded against this standard in the project dataset.',
    noRequirements: 'No specific requirements are recorded for this standard.',
    newerVersion: 'A newer version of this standard is available.',
    underRevision: 'This standard is currently under revision.',
    saved: 'Saved',
    saveStandard: 'Save Standard',
    certGuidance: 'Certification Guidance',
    checkSchemes: 'Check schemes & requirements',
    findLabs: 'Find Testing Labs',
    authFacilities: 'Authorized testing facilities',
    askSmartGuide: 'Ask SmartGuide',
    chatAbout: 'Chat about this standard',
    officialSources: 'Official Sources',
    atAGlance: 'At a glance',
    icsCode: 'ICS code',
    sector: 'BIS sector',
    category: 'Category',
    revision: 'Revision',
    year: 'Year',
    certificationRequirement: 'Certification requirement',
    nextSteps: 'Next steps'
  },
};
