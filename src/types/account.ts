export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface Address {
  line1: string;
  line2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export type AnnualRevenue =
  | 'Under $1M'
  | '$1M - $5M'
  | '$5M - $10M'
  | '$10M - $50M'
  | '$50M - $100M'
  | 'Over $100M';

export type EmployeeCount =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';

export interface Account {
  id: UUID;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  owner_id: UUID;
  created_at: string;
  updated_at: string;
}