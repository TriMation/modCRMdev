export interface QuickAccessRecord {
  id: string;
  user_id: string;
  name: string;
  type: 'account' | 'contact';
  accessed_at: string;
  created_at: string;
  updated_at: string;
  path: string;
}