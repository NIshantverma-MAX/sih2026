import { AppNotification } from '../types';

export const notifications: AppNotification[] = [
  {
    id: 'NOT-001',
    title: 'Application Status Updated',
    message: 'Your application for IS 17526 certification has moved to "Scrutiny" stage.',
    date: '2023-11-28T09:00:00Z',
    read: false,
    type: 'info'
  },
  {
    id: 'NOT-002',
    title: 'New QCO Alert',
    message: 'A new Quality Control Order affecting your registered product category has been issued.',
    date: '2023-11-25T14:30:00Z',
    read: false,
    type: 'warning'
  },
  {
    id: 'NOT-003',
    title: 'Payment Successful',
    message: 'Application fee of ₹45,000 received successfully.',
    date: '2023-11-20T11:15:00Z',
    read: true,
    type: 'success'
  },
  {
    id: 'NOT-004',
    title: 'Document Analysis Complete',
    message: 'The technical specification document you uploaded has been analyzed.',
    date: '2023-11-18T16:45:00Z',
    read: true,
    type: 'info'
  },
  {
    id: 'NOT-005',
    title: 'Welcome to BIS SmartGuide',
    message: 'Complete your profile to get personalized standard recommendations.',
    date: '2023-11-15T10:00:00Z',
    read: true,
    type: 'info'
  }
];
