export interface Task {
  id: string;
  type: string;
  subject: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  owner_id: string;
  assigned_to?: string;
  opportunity_id?: string;
  contact_id?: string;
  account_id?: string;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  assigned_user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  account?: {
    id: string;
    name: string;
  };
  contact?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  opportunity?: {
    id: string;
    name: string;
  };
}