import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createTask } from '../../services/taskService';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface NewTaskFormProps {
  onClose: () => void;
  opportunityId?: string;
  accountId?: string;
  onSuccess?: () => void;
}

interface AccountOption {
  id: string;
  name: string;
}

interface ContactOption {
  id: string;
  first_name: string;
  last_name: string;
}

interface UserOption {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function NewTaskForm({ onClose, opportunityId, accountId, onSuccess }: NewTaskFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [formData, setFormData] = useState({
    type: 'task',
    subject: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
    completed: false,
    account_id: accountId || '',
    contact_id: '',
    opportunity_id: opportunityId || '',
    assigned_to: user?.id || ''
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, email')
          .eq('active', true)
          .order('first_name');
        
        if (error) throw error;
        setUsers(data || []);
        
        // Set current user as default owner
        if (user && data) {
          const currentUser = data.find(u => u.email === user.email);
          if (currentUser) {
            setFormData(prev => ({
              ...prev,
              assigned_to: currentUser.id
            }));
          }
        }
      } catch (err) {
        console.error('Error loading users:', err);
      }
    }
    loadUsers();
  }, [user]);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setAccounts(data || []);
      } catch (err) {
        console.error('Error loading accounts:', err);
      }
    }
    loadAccounts();
  }, []);

  useEffect(() => {
    async function loadContacts() {
      if (!formData.account_id) {
        setContacts([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('id, first_name, last_name')
          .eq('account_id', formData.account_id)
          .order('first_name');
        
        if (error) throw error;
        setContacts(data || []);
      } catch (err) {
        console.error('Error loading contacts:', err);
      }
    }
    loadContacts();
  }, [formData.account_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('No authenticated user');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const taskData = {
        type: formData.type,
        subject: formData.subject,
        description: formData.description || null,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        priority: formData.priority,
        status: formData.status,
        completed: formData.completed,
        account_id: formData.account_id || null,
        contact_id: formData.contact_id || null,
        opportunity_id: formData.opportunity_id || null,
        assigned_to: formData.assigned_to || user.id,
        owner_id: user.id
      };

      await createTask(taskData);

      onClose();
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">New Task</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Subject*
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter task subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Type*
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="task">Task</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Priority*
              </label>
              <select
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Status*
              </label>
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Completed
              </label>
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Assigned To
              </label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select assignee</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Account
              </label>
              <select
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
                disabled={!!accountId}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Contact
              </label>
              <select
                name="contact_id"
                value={formData.contact_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter task description"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}