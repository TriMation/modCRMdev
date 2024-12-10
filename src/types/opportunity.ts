export interface Opportunity {
  id: string;
  name: string;
  value: number;
  currency: string;
  stage_id: string;
  account_id: string;
  contact_id?: string;
  owner_id: string;
  probability: number;
  close_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}