import { Task } from '../types/task';
import { mockAccounts } from './mockData';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with client proposal',
    description: 'Review and send updated proposal to Acme Corporation',
    dueDate: '2024-03-20',
    priority: 'high',
    status: 'todo',
    assignedTo: 'John Doe',
    relatedAccount: mockAccounts[0],
    comments: [
      {
        id: '1',
        content: 'Initial proposal sent on March 10',
        createdBy: 'Jane Smith',
        createdAt: '2024-03-10T10:00:00Z'
      }
    ],
    createdAt: '2024-03-08T09:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Schedule quarterly review',
    description: 'Set up Q1 review meeting with TechStart Inc',
    dueDate: '2024-03-25',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Jane Smith',
    relatedAccount: mockAccounts[1],
    comments: [],
    createdAt: '2024-03-12T14:30:00Z',
    updatedAt: '2024-03-12T14:30:00Z'
  }
];