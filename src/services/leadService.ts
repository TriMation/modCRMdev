import { supabase } from '../config/supabase';
import { Lead } from '../types/lead';

export async function getLeads() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        stage:lead_stages(id, name, color),
        account:accounts(id, name),
        contact:contacts(id, first_name, last_name),
        opportunity:opportunities(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...lead,
        owner_id: userData.user.id,
        probability: lead.probability || 50,
        expected_close_date: lead.expected_close_date || new Date().toISOString().split('T')[0]
      }])
      .select(`
        *,
        stage:lead_stages(id, name, color),
        accounts (id, name),
        contacts (id, first_name, last_name)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

export async function updateLead(id: string, lead: Partial<Lead>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('leads')
      .update(lead)
      .select(`
        *,
        stage:lead_stages(id, name, color),
        accounts (id, name),
        contacts (id, first_name, last_name),
        opportunities (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

export async function convertToOpportunity(leadId: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');
    
    // Start a transaction
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select(`
        *,
        accounts (id, name),
        contacts (id, first_name, last_name)
      `)
      .eq('id', leadId)
      .single();

    if (leadError) throw leadError;
    if (!lead) throw new Error('Lead not found');

    // Create opportunity
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .insert([{
        name: lead.title,
        value: lead.value,
        currency: lead.currency,
        stage_id: (await getFirstStage()).id, // Get first stage ID
        account_id: lead.account_id,
        contact_id: lead.contact_id,
        owner_id: userData.user.id, // Use the authenticated user's ID
        probability: lead.probability,
        close_date: lead.expected_close_date,
        description: lead.description
      }])
      .select()
      .single();

    if (oppError) throw oppError;

    // Update lead with converted status
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        stage_id: (await getConvertedStage()).id,
        converted_opportunity_id: opportunity.id,
        converted_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (updateError) throw updateError;

    return opportunity;
  } catch (error) {
    console.error('Error converting lead to opportunity:', error);
    throw error;
  }
}

async function getConvertedStage() {
  const { data, error } = await supabase
    .from('lead_stages')
    .select('id')
    .eq('name', 'Converted')
    .single();

  if (error) throw error;
  return data;
}
async function getFirstStage() {
  const { data, error } = await supabase
    .from('opportunity_stages')
    .select('id')
    .order('order_position', { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

export async function updateLeadStage(id: string, stageId: string) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ stage_id: stageId })
      .select(`
        *,
        stage:lead_stages(id, name, color),
        accounts (id, name),
        contacts (id, first_name, last_name),
        opportunities (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating lead stage:', error);
    throw error;
  }
}

export async function getLeadStages() {
  try {
    const { data, error } = await supabase
      .from('lead_stages')
      .select('*')
      .order('order_position');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching lead stages:', error);
    throw error;
  }
}