import { supabase } from '../config/supabase';
import { Bid, BidTeamMember, BidSection } from '../types/bid';

export async function getBids() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bids:', error);
    throw error;
  }
}

export async function getBid(id: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('bids')
      .select(`
        id,
        title,
        bid_number,
        release_date,
        submission_date,
        award_date,
        status,
        word_count,
        win_strategy,
        bid_no_bid_date,
        bid_no_bid_decision,
        bid_no_bid_rationale,
        owner_id,
        created_at,
        updated_at,
        bid_team_members!inner (
          id, user_id, role, responsibilities
        ),
        bid_sections!inner (
          id, section_type, content, status
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bid:', error);
    throw error;
  }
}

export async function createBid(bid: Omit<Bid, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('No authenticated user');

    // Validate required fields
    if (!bid.submission_date) {
      throw new Error('Submission date is required');
    }

    const { data, error } = await supabase
      .from('bids')
      .insert([{
        ...bid,
        owner_id: userData.user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating bid:', error);
    throw error;
  }
}

export async function updateBid(id: string, bid: Partial<Bid>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('bids')
      .update(bid)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating bid:', error);
    throw error;
  }
}

export async function addTeamMember(bidId: string, teamMember: Omit<BidTeamMember, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('bid_team_members')
      .insert([{
        ...teamMember,
        bid_id: bidId
      }])
      .select(`
        *,
        user:users (
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
}

export async function removeTeamMember(bidId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('bid_team_members')
      .delete()
      .eq('bid_id', bidId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
}

export async function updateBidSection(
  bidId: string, 
  sectionType: BidSection['section_type'], 
  content: Record<string, any>
) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    // First try to update existing section
    const { data: existingSection, error: selectError } = await supabase
      .from('bid_sections')
      .select('*')
      .eq('bid_id', bidId)
      .eq('section_type', sectionType)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw selectError;
    }

    if (existingSection) {
      // Update existing section
      const { data, error } = await supabase
        .from('bid_sections')
        .update({ content })
        .eq('id', existingSection.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new section
      const { data, error } = await supabase
        .from('bid_sections')
        .insert([{
          bid_id: bidId,
          section_type: sectionType,
          content
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating bid section:', error);
    throw error;
  }
}

export async function getBidSection(bidId: string, sectionType: BidSection['section_type']) {
  try {
    const { data, error } = await supabase
      .from('bid_sections')
      .select('*')
      .eq('bid_id', bidId)
      .eq('section_type', sectionType)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bid section:', error);
    throw error;
  }
}

export async function deleteBid(id: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('bids')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting bid:', error);
    throw error;
  }
}