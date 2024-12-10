import { Contact } from './contact';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  contact?: Contact;
  lastLogin?: string;
  createdAt: string;
}