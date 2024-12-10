import { supabase } from '../config/supabase';
import { Task } from '../types/task';

export async function getTasks() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('tasks')
      .select('*, accounts(*), contacts(*), opportunities(*)')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        type: task.type,
        subject: task.subject,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        status: task.status,
        completed: task.completed,
        account_id: task.account_id,
        contact_id: task.contact_id,
        opportunity_id: task.opportunity_id,
        owner_id: userData.user.id,
        assigned_to: task.assigned_to || userData.user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(id: string, task: Partial<Task>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

export async function duplicateTask(task: Partial<Task>) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) throw new Error('No authenticated user');

    // Clean up the task data before duplication
    const duplicateTaskData = {
      type: task.type,
      subject: task.subject,
      description: task.description,
      due_date: task.due_date,
      priority: task.priority,
      account_id: task.account_id,
      contact_id: task.contact_id,
      opportunity_id: task.opportunity_id,
      owner_id: userData.user.id,
      status: 'todo', // Reset status for the duplicate
      completed: false // Reset completed status
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([duplicateTaskData])
      .select(`
        *,
        accounts (id, name),
        contacts (id, first_name, last_name),
        opportunities (id, name)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error duplicating task:', error);
    throw error;
  }
}