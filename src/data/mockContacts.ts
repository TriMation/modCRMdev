import { Contact } from '../types/contact';

export const mockContacts: Contact[] = [
  {
    id: '1',
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@acme.com',
    phone: '(555) 123-4567',
    role: 'CEO',
    company: 'Acme Corporation',
    dateOfBirth: '1980-05-15',
    linkedIn: 'https://linkedin.com/in/johndoe',
    status: 'active',
    lastContacted: '2024-03-15',
    tags: ['VIP', 'Decision Maker']
  },
  {
    id: '2',
    title: 'Dr',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@techstart.com',
    phone: '(555) 987-6543',
    role: 'CTO',
    company: 'TechStart Inc',
    dateOfBirth: '1985-08-22',
    linkedIn: 'https://linkedin.com/in/janesmith',
    status: 'active',
    lastContacted: '2024-03-14',
    tags: ['Technical', 'Decision Maker']
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@innovate.com',
    phone: '(555) 234-5678',
    role: 'Director of Sales',
    company: 'Innovate Solutions',
    status: 'inactive',
    lastContacted: '2024-02-28',
    tags: ['Sales']
  }
];