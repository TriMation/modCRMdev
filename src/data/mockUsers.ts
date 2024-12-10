import { User } from '../types/user';
import { mockContacts } from './mockContacts';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@acme.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    status: 'active',
    contact: mockContacts[0],
    lastLogin: '2024-03-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'jane@techstart.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    status: 'active',
    contact: mockContacts[1],
    lastLogin: '2024-03-14T15:45:00Z',
    createdAt: '2024-01-15T00:00:00Z'
  }
];