import { supabase } from '../config/supabase';
import { Account } from '../types/account';

export async function getAccounts() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Account[]) || [];
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}

export async function getAccount(id: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        contacts (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
}

export async function createAccount(account: Omit<Account, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('No authenticated user');

    // First, get or create the user record
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', userData.user.id)
      .single();

    if (userError) throw userError;
    if (!userRecord) throw new Error('User record not found');

    const { data, error } = await supabase
      .from('accounts')
      .insert([{
        ...account,
        owner_id: userRecord.id,
        country: account.country || 'United States'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export async function updateAccount(id: string, account: Partial<Account>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
}

export async function deleteAccount(id: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}