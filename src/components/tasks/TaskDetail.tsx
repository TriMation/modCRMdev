import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Building2, MessageSquare, Pencil, Copy } from 'lucide-react';
import { Task } from '../../types/task';
import { createTask, updateTask } from '../../services/taskService';
import { EditTaskForm } from './EditTaskForm';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate?: () => void;
}

export function TaskDetail({ task, onClose, onUpdate }: TaskDetailProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
      case 'low':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900';
      case 'todo':
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const handleDuplicate = async () => {
    try {
      setLoading(true);
      setError('');
      
      await createTask({
        type: task.type,
        subject: `${task.subject} (Copy)`,
        description: task.description || '',
        due_date: task.due_date,
        priority: task.priority || 'medium',
        status: 'todo',
        account_id: task.account_id || null,
        contact_id: task.contact_id || null,
        opportunity_id: task.opportunity_id || null
      });
      onUpdate?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate task';
      setError(errorMessage);
      console.error('Error duplicating task:', err);
    } finally {
      setLoading(false);
    }
  };

  if (showEditForm) {
    return <EditTaskForm task={task} onClose={() => setShowEditForm(false)} onSuccess={onUpdate} />;
  }

  return (
    <div className="w-96 border-l border-emerald-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Task Details</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDuplicate}
            disabled={loading}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
            title="Duplicate Task"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">{task.subject}</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status || 'todo')}`}>
              {(task.status || 'todo').replace(/_/g, ' ')}
            </span>
          </div>
          {task.description && (
            <p className="text-emerald-600 dark:text-emerald-400 mt-2">{task.description}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Clock className="w-5 h-5 mr-2" />
            <span>Created by: {task.owner?.first_name} {task.owner?.last_name}</span>
          </div>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Clock className="w-5 h-5 mr-2" />
            <span>Assigned to: {task.assigned_user?.first_name} {task.assigned_user?.last_name || 'Unassigned'}</span>
          </div>
          {task.account_id && task.account && (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-5 h-5 mr-2" />
              <span>Related to: {task.account.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}