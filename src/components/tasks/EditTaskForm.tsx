import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '../../types/task';
import { supabase } from '../../config/supabase';

interface UserOption {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditTaskForm({ task, onClose, onSuccess }: EditTaskFormProps) {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    owner_id: task.owner_id,
    account_id: task.account_id || ''
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
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      }
    }
    loadUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      // Handle form submission here
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('Error updating task:', err);
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
    <div className="w-96 border-l border-emerald-100 bg-white overflow-auto">
      <div className="sticky top-0 bg-white border-b border-emerald-100 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-emerald-900">Edit Task</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-emerald-600" />
        </button>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Task Title*
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Due Date*
            </label>
            <input
              type="date"
              name="dueDate"
              required
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Priority*
            </label>
            <select
              name="priority"
              required
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Status*
            </label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Assigned To*
            </label>
            <select
              name="assigned_to"
              required
              value={formData.assigned_to}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Related Account
            </label>
            <select
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select account</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}