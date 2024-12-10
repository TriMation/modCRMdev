import { supabase } from '../config/supabase';
import { Contact } from '../types/contact';

export async function getContacts() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Contact[]) || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
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
      .from('contacts')
      .insert([{
        ...contact,
        owner_id: userRecord.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}
export async function getContactsByAccount(accountId: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Contact[]) || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}