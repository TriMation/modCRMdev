export interface Bid {
    id: string;
    title: string;
    bid_number?: string;
    release_date?: string;
    submission_date: string;
    award_date?: string;
    status: 'draft' | 'in_progress' | 'submitted' | 'won' | 'lost';
    word_count?: number;
    win_strategy?: string;
    bid_no_bid_date?: string;
    bid_no_bid_decision?: boolean;
    bid_no_bid_rationale?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface BidTeamMember {
    id: string;
    bid_id: string;
    user_id: string;
    role: string;
    responsibilities?: string;
    created_at: string;
    updated_at: string;
    user?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  }
  
  export interface BidSection {
    id: string;
    bid_id: string;
    section_type: 'processing' | 'team' | 'overview' | 'strategy' | 'response';
    content: Record<string, any>;
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
    updated_at: string;
  }