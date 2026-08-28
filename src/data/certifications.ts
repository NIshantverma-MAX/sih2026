import { CertificationGuide } from '../types';

export const certificationGuides: CertificationGuide[] = [
  {
    id: 'CERT-001',
    productId: 'Stainless Steel Water Bottle',
    standardId: 'STD-001',
    isMandatory: true,
    estimatedTimeline: '30-45 Days',
    fees: '₹45,000 - ₹60,000 (excluding lab fees)',
    steps: [
      {
        step: 1,
        title: 'Identify Applicable Standard',
        description: 'Confirm that your product falls under IS 17526:2021 for Stainless Steel Water Bottles.',
        checklist: ['Check product scope in standard', 'Verify material grade (304 etc.)'],
        documents: ['Product technical specification'],
        status: 'completed'
      },
      {
        step: 2,
        title: 'In-house Testing Facility Setup',
        description: 'Establish in-house testing equipment as per the Scheme of Inspection and Testing (SIT) for daily quality control.',
        checklist: ['Procure test equipment', 'Calibrate equipment', 'Hire competent QC personnel'],
        documents: ['Calibration certificates', 'List of test equipment', 'QC staff qualifications'],
        status: 'current'
      },
      {
        step: 3,
        title: 'Independent Testing (BIS Lab)',
        description: 'Send product samples to a BIS recognized laboratory for comprehensive testing against all requirements of IS 17526.',
        checklist: ['Select BIS recognized lab', 'Send samples', 'Pay lab fees', 'Receive test report'],
        documents: ['Test Request Letter', 'Lab Test Report (not older than 90 days)'],
        status: 'upcoming'
      },
      {
        step: 4,
        title: 'Portal Registration & Application',
        description: 'Create an account on the manakonline portal and submit the formal application (Form-V) with all documents and the test report.',
        checklist: ['Register on portal', 'Fill Form-V', 'Upload test report and documents', 'Pay application fee'],
        documents: ['Factory registration/license', 'Business constitution document', 'Process flow chart'],
        status: 'upcoming'
      },
      {
        step: 5,
        title: 'Application Scrutiny',
        description: 'BIS officials will review the application and documents for completeness and correctness.',
        checklist: ['Respond to any queries from BIS'],
        documents: [],
        status: 'upcoming'
      },
      {
        step: 6,
        title: 'Factory Inspection (Optional/Conditional)',
        description: 'Depending on the scheme Option (Option 1 vs Option 2), a BIS officer may visit your factory to verify infrastructure and QC process.',
        checklist: ['Prepare factory for inspection', 'Demonstrate tests to inspecting officer'],
        documents: ['In-house test records'],
        status: 'upcoming'
      },
      {
        step: 7,
        title: 'Grant of License',
        description: 'Upon satisfactory evaluation, BIS grants the license allowing you to use the ISI mark on your water bottles.',
        checklist: ['Pay license fee', 'Sign marking fee agreement'],
        documents: ['BIS License Document'],
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'CERT-002',
    productId: 'LED Bulbs',
    standardId: 'STD-003',
    isMandatory: true,
    estimatedTimeline: '20-30 Days',
    fees: '₹30,000 - ₹50,000',
    steps: [
      { step: 1, title: 'Sample Testing', description: 'Test samples in BIS lab', checklist: [], documents: [], status: 'upcoming' },
      { step: 2, title: 'Portal Registration', description: 'Apply on CRS portal', checklist: [], documents: [], status: 'upcoming' },
      { step: 3, title: 'Grant of Registration', description: 'Get CRS registration number', checklist: [], documents: [], status: 'upcoming' }
    ]
  }
];
