import { supabase } from '../config/supabase';
import { QuickAccessRecord } from '../types/quickAccess';

const MAX_RECORDS = 5;

export async function getQuickAccessRecords(): Promise<QuickAccessRecord[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return [];

    const { data, error } = await supabase
      .from('quick_access')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('user_id', userData.user.id)
      .order('accessed_at', { ascending: false })
      .limit(MAX_RECORDS);

    if (error) throw error;
    return data?.map(record => ({
      ...record,
      name: record.record_name // Map DB field to interface field
    })) || [];
  } catch (error) {
    console.error('Error fetching quick access records:', error);
    return [];
  }
}

export async function addQuickAccessRecord(record: Omit<QuickAccessRecord, 'id' | 'timestamp'>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    // Check if record already exists
    const { data: existing } = await supabase
      .from('quick_access')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('user_id', userData.user.id)
      .eq('record_id', record.id)
      .eq('record_type', record.type)
      .single();

    if (existing) {
      // Update existing record's timestamp
      await supabase
        .from('quick_access')
        .update({ accessed_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      // Insert new record
      await supabase
        .from('quick_access')
        .insert([{
          user_id: userData.user.id,
          user_id: userData.user.id,
          record_id: record.id,
          record_type: record.type,
          record_name: record.name,
          path: record.path,
          accessed_at: new Date().toISOString()
        }]);

      // Delete oldest record if limit exceeded
      const { data: records } = await supabase
        .from('quick_access')
        .select('id')
        .eq('user_id', userData.user.id)
        .order('accessed_at', { ascending: false });

      if (records && records.length > MAX_RECORDS) {
        const recordsToDelete = records.slice(MAX_RECORDS);
        await supabase
          .from('quick_access')
          .delete()
          .in('id', recordsToDelete.map(r => r.id));
      }
    }
  } catch (error) {
    console.error('Error adding quick access record:', error);
  }
}