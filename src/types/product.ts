import { Account } from './account';

export type ProductType = 'product' | 'service' | 'expense';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  price: number;
  sku?: string;
  status: 'active' | 'inactive';
  accounts?: Account[];
  createdAt: string;
  updatedAt: string;
}