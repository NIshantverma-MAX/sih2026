import { Announcement } from '../types';

export const announcements: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'New Quality Control Order for Stainless Steel Water Bottles',
    description: 'The Ministry of Commerce and Industry has issued a QCO making BIS certification mandatory for stainless steel water bottles under IS 17526: 2021, effective from June 1, 2024.',
    date: '2023-12-01T00:00:00Z',
    category: 'QCO Notification',
    link: 'https://bis.gov.in/qco/ss-bottles'
  },
  {
    id: 'ANN-002',
    title: 'Revision of IS 4151 for Two-Wheeler Helmets',
    description: 'The standard for protective helmets for two-wheelers (IS 4151) is currently under revision. Stakeholders are invited to submit their comments by next month.',
    date: '2023-11-15T00:00:00Z',
    category: 'Standard Revision'
  },
  {
    id: 'ANN-003',
    title: 'Special Drive for Hallmarking Registration',
    description: 'BIS is organizing a special drive for jewellers in Tier-3 cities to complete their mandatory hallmarking registration. No processing fee will be charged during this period.',
    date: '2023-11-05T00:00:00Z',
    category: 'Hallmarking'
  },
  {
    id: 'ANN-004',
    title: 'New Testing Facilities Added for Electronic Goods',
    description: 'Three new laboratories have been recognized by BIS in South India for testing of smart watches and Bluetooth devices under the Compulsory Registration Scheme.',
    date: '2023-10-20T00:00:00Z',
    category: 'Laboratory Recognition'
  },
  {
    id: 'ANN-005',
    title: 'Launch of Upgraded BIS Care App',
    description: 'The upgraded BIS Care App version 3.0 is now available, featuring enhanced HUID verification speed and a more user-friendly interface for consumer complaints.',
    date: '2023-10-10T00:00:00Z',
    category: 'General Update'
  }
];
