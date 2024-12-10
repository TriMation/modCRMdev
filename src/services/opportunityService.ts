import { supabase } from '../config/supabase';
import { Opportunity } from '../types/opportunity';

export async function getOpportunities() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('opportunities')
      .select('*, accounts(*), contacts(*), opportunity_stages(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw error;
  }
}

export async function getOpportunity(id: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        account:accounts(id, name),
        contact:contacts(id, first_name, last_name),
        stage:opportunity_stages(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    throw error;
  }
}

export async function createOpportunity(opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('No authenticated user');

    // Get the user record
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', userData.user.id)
      .single();

    if (userError) throw userError;
    if (!userRecord) throw new Error('User record not found');

    const { data, error } = await supabase
      .from('opportunities')
      .insert([{
        ...opportunity,
        owner_id: userRecord.id,
        value: parseFloat(opportunity.value.toString()) || 0,
        probability: parseInt(opportunity.probability.toString()) || 0
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating opportunity:', error);
    throw error;
  }
}

export async function updateOpportunity(id: string, opportunity: Partial<Opportunity>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('opportunities')
      .update({
        ...opportunity,
        value: parseFloat(opportunity.value?.toString() || '0'),
        probability: parseInt(opportunity.probability?.toString() || '0')
      })
      .eq('id', id)
      .select(`
        *,
        account:accounts(id, name),
        contact:contacts(id, first_name, last_name),
        stage:opportunity_stages(id, name)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating opportunity:', error);
    throw error;
  }
}

export async function updateOpportunityStage(id: string, stageId: string) {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .update({ stage_id: stageId })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating opportunity stage:', error);
    throw error;
  }
}

export async function getOpportunityStages() {
  try {
    const { data, error } = await supabase
      .from('opportunity_stages')
      .select('*')
      .order('order_position');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching opportunity stages:', error);
    throw error;
  }
}