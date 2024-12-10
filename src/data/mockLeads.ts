import { Lead } from '../types/lead';
import { mockContacts } from './mockContacts';
import { mockTasks } from './mockTasks';

export const mockLeads: Lead[] = [
  {
    id: '1',
    title: 'Enterprise Software Solution',
    value: 50000,
    stage: 'contacted',
    contact: mockContacts[0],
    description: 'Potential enterprise-wide software implementation',
    tasks: [mockTasks[0]],
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    value: 75000,
    stage: 'new',
    contact: mockContacts[1],
    description: 'Cloud infrastructure migration project',
    tasks: [mockTasks[1]],
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-14T16:45:00Z'
  }
];