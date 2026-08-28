import { Query } from '../types';

export const recentQueries: Query[] = [
  {
    id: 'QRY-001',
    question: 'Is BIS certification mandatory for stainless steel water bottles?',
    date: '2023-10-15T10:30:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'Yes, BIS certification is mandatory for stainless steel water bottles as per the recent Quality Control Order. You need to obtain an ISI mark under IS 17526: 2021.',
      certification: {
        isMandatory: true,
        scheme: 'Scheme-I (ISI Mark)',
        description: 'Mandatory certification required before selling in the Indian market.',
        timeline: '30-45 Days'
      }
    }
  },
  {
    id: 'QRY-002',
    question: 'What are the testing requirements for LED bulbs?',
    date: '2023-10-14T14:45:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'For LED bulbs (IS 16102 Part 1), the key testing requirements include safety tests like insulation resistance, temperature rise limits, and photobiological safety.',
      testing: [
        { test: 'Insulation Resistance', description: 'Ensures no current leakage.', standard: 'IS 16102', labRequired: true },
        { test: 'Temperature Rise', description: 'Checks heating under normal load.', standard: 'IS 16102', labRequired: true }
      ]
    }
  },
  {
    id: 'QRY-003',
    question: 'How can I verify if a hallmark on jewellery is genuine?',
    date: '2023-10-12T09:15:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'You can verify the hallmark by checking the 6-digit alphanumeric HUID (Hallmark Unique Identification) code stamped on the jewellery. Enter it in the BIS Care app or our portal to see the item details.'
    }
  },
  {
    id: 'QRY-004',
    question: 'Can I sell packaged drinking water with just an FSSAI license?',
    date: '2023-10-10T16:20:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'No. Packaged Drinking Water requires BOTH an FSSAI license and mandatory BIS Certification (ISI Mark) under IS 14543. Selling without an ISI mark is illegal.',
      warnings: ['Mandatory BIS Certification Required!']
    }
  },
  {
    id: 'QRY-005',
    question: 'What is the validity period of a BIS license?',
    date: '2023-10-09T11:00:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'A BIS license is initially granted for a period of 1 to 2 years, depending on the product and scheme. It can be renewed subsequently for up to 5 years at a time, subject to compliance and payment of fees.'
    }
  },
  {
    id: 'QRY-006',
    question: 'Are smart watches covered under mandatory BIS certification?',
    date: '2023-10-08T13:45:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'Yes, smart watches fall under the Compulsory Registration Scheme (CRS) for electronics and IT goods (IS 13252). They must be registered with BIS before being imported or sold in India.'
    }
  },
  {
    id: 'QRY-007',
    question: 'Where can I find BIS recognized labs in Mumbai?',
    date: '2023-10-07T15:30:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'There are several BIS recognized labs in Mumbai, including TUV SUD South Asia and Indian Institute of Packaging. You can use the Lab Directory section to search for specific labs based on the product standard.'
    }
  },
  {
    id: 'QRY-008',
    question: 'मुझे आईएसआई (ISI) मार्क कैसे मिल सकता है?',
    date: '2023-10-06T10:15:00Z',
    language: 'hi',
    status: 'answered',
    response: {
      answer: 'आईएसआई (ISI) मार्क प्राप्त करने के लिए आपको बीआईएस (BIS) पोर्टल पर आवेदन करना होगा, आवश्यक दस्तावेज़ जमा करने होंगे, और अपने उत्पाद का किसी मान्यता प्राप्त प्रयोगशाला में परीक्षण कराना होगा। इसके बाद बीआईएस अधिकारी आपके कारखाने का निरीक्षण करेंगे।'
    }
  },
  {
    id: 'QRY-009',
    question: 'Do imported toys need BIS certification?',
    date: '2023-10-05T14:20:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'Yes, all toys (both domestic and imported) require mandatory BIS certification (ISI Mark) under IS 9873 and IS 15644. Foreign manufacturers must obtain certification through the Foreign Manufacturers Certification Scheme (FMCS).'
    }
  },
  {
    id: 'QRY-010',
    question: 'How to file a complaint about a fake ISI mark?',
    date: '2023-10-04T09:45:00Z',
    language: 'en',
    status: 'answered',
    response: {
      answer: 'You can file a complaint against a fake ISI mark through the BIS Care App, by emailing complaints@bis.gov.in, or through the consumer grievance portal on the official BIS website.'
    }
  }
];
