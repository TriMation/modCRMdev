import { Opportunity } from '../types/opportunity';
import { mockContacts } from './mockContacts';
import { mockAccounts } from './mockData';
import { mockTasks } from './mockTasks';
import { mockProducts } from './mockProducts';

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Enterprise Software Solution',
    estimatedValue: 50000,
    actualValue: 52500, // Sum of products
    stage: 'negotiation',
    contact: mockContacts[0],
    account: mockAccounts[0],
    description: 'Potential enterprise-wide software implementation',
    products: [
      {
        product: mockProducts[0],
        quantity: 10,
        price: 5000
      },
      {
        product: mockProducts[1],
        quantity: 1,
        price: 2500
      }
    ],
    tasks: [mockTasks[0]],
    probability: 60,
    expectedCloseDate: '2024-06-30',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    estimatedValue: 75000,
    actualValue: 77500,
    stage: 'qualification',
    contact: mockContacts[1],
    account: mockAccounts[1],
    description: 'Cloud infrastructure migration project',
    products: [
      {
        product: mockProducts[1],
        quantity: 30,
        price: 2500
      },
      {
        product: mockProducts[2],
        quantity: 5,
        price: 500
      }
    ],
    tasks: [mockTasks[1]],
    probability: 40,
    expectedCloseDate: '2024-07-15',
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-14T16:45:00Z'
  }
];