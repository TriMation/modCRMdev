export interface Lead {
  id: string;
  title: string;
  description?: string;
  value: number;
  currency: string;
  stage_id: string;
  lost_reason?: string;
  probability: number;
  source?: string;
  account_id?: string;
  contact_id?: string;
  owner_id: string;
  converted_opportunity_id?: string;
  converted_at?: string;
  expected_close_date?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  stage?: {
    id: string;
    name: string;
    color: string;
  };
  accounts?: {
    id: string;
    name: string;
  };
  contacts?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  opportunities?: {
    id: string;
    name: string;
  };
}