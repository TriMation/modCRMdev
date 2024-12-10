import { Product } from '../types/product';
import { mockAccounts } from './mockData';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Enterprise Software License',
    type: 'product',
    description: 'Annual enterprise software license',
    price: 5000,
    sku: 'SFT-001',
    status: 'active',
    accounts: [mockAccounts[0]],
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Implementation Service',
    type: 'service',
    description: 'Software implementation and setup service',
    price: 2500,
    sku: 'SRV-001',
    status: 'active',
    accounts: [mockAccounts[1]],
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-14T16:45:00Z'
  },
  {
    id: '3',
    name: 'Server Hosting',
    type: 'expense',
    description: 'Monthly server hosting costs',
    price: 500,
    sku: 'EXP-001',
    status: 'active',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  }
];