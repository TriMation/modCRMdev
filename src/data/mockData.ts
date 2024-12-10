import { Account } from '../types/account';

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Technology',
    website: 'www.acme.com',
    abn: '12 345 678 901',
    phone: '(555) 123-4567',
    status: 'active',
    accountType: 'customer',
    annualRevenue: '$10M - $50M',
    employeeCount: '201-500',
    address: {
      line1: '123 Tech Street',
      line2: 'Level 30',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      country: 'Australia'
    },
    createdAt: '2024-03-15',
    contacts: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@acme.com',
        phone: '(555) 123-4567',
        role: 'CEO',
        isPrimary: true
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@acme.com',
        phone: '(555) 987-6543',
        role: 'CTO',
        isPrimary: false
      }
    ]
  },
  {
    id: '2',
    name: 'TechStart Inc',
    industry: 'Software',
    website: 'www.techstart.com',
    abn: '98 765 432 109',
    phone: '(555) 234-5678',
    status: 'active',
    accountType: 'partner',
    annualRevenue: '$1M - $5M',
    employeeCount: '11-50',
    address: {
      line1: '456 Innovation Avenue',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia'
    },
    createdAt: '2024-03-10',
    contacts: [
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@techstart.com',
        phone: '(555) 234-5678',
        role: 'Director',
        isPrimary: true
      }
    ]
  }
];