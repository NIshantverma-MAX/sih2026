import { SourceCitation } from '../types';

export const sources: SourceCitation[] = [
  {
    id: 'SRC-001',
    title: 'IS 17526:2021 Stainless Steel Water Bottles',
    url: 'https://standardsbis.bsbedge.com/',
    documentName: 'IS_17526_2021.pdf',
    clause: '4.1',
    snippet: 'The material used for manufacturing the water bottle shall be stainless steel of designation 304 or better.',
    type: 'standard'
  },
  {
    id: 'SRC-002',
    title: 'Quality Control Order - Stainless Steel Products',
    url: 'https://dpiit.gov.in/',
    documentName: 'QCO_SS_Products_2023.pdf',
    type: 'regulation'
  },
  {
    id: 'SRC-003',
    title: 'Product Manual for IS 17526',
    url: 'https://bis.gov.in/product-manuals',
    documentName: 'PM_IS_17526.pdf',
    section: 'Scheme of Inspection and Testing',
    type: 'guideline'
  },
  {
    id: 'SRC-004',
    title: 'IS 16102 (Part 1): 2012 Self-Ballasted LED Lamps',
    url: 'https://standardsbis.bsbedge.com/',
    documentName: 'IS_16102_1_2012.pdf',
    type: 'standard'
  },
  {
    id: 'SRC-005',
    title: 'Compulsory Registration Scheme FAQ',
    url: 'https://crsbis.in/',
    documentName: 'CRS_FAQ_v2.pdf',
    type: 'website'
  }
];
