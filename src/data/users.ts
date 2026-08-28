import { User } from '../types';

export const defaultUser: User = {
  id: 'USR-001',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 9876543210',
  role: 'manufacturer',
  company: 'Sharma Steel Industries',
  productCategory: 'Household Utensils'
};

export const mockUsers: User[] = [
  defaultUser,
  {
    id: 'USR-002',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    role: 'consumer'
  },
  {
    id: 'USR-003',
    name: 'Amit Kumar',
    email: 'amit.k@university.edu.in',
    role: 'student'
  }
];
