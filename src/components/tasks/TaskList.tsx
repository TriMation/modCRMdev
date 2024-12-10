import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../../types/task';

interface SortConfig {
  field: 'due_date' | 'priority';
  direction: 'asc' | 'desc';
}

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  selectedTaskId?: string;
  sortConfig?: SortConfig;
  onSort?: (config: SortConfig) => void;
}

export function TaskList({ tasks, onTaskSelect, selectedTaskId, sortConfig, onSort }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
      case 'low':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900';
      case 'todo':
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const handleSort = (field: 'due_date' | 'priority') => {
    if (!onSort) return;
    
    const newDirection = 
      sortConfig?.field === field && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    onSort({ field, direction: newDirection });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('default', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
        No tasks found.
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.field === 'due_date') {
      return (new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) * direction;
    }
    
    if (sortConfig.field === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction;
    }
    
    return 0;
  });

  const renderSortIndicator = (field: 'due_date' | 'priority') => {
    if (sortConfig?.field !== field) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div>
      <div className="mb-4 flex justify-end space-x-4">
        <button
          onClick={() => handleSort('due_date')}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          Sort by Due Date{renderSortIndicator('due_date')}
        </button>
        <button
          onClick={() => handleSort('priority')}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          Sort by Priority{renderSortIndicator('priority')}
        </button>
      </div>
      
      <div className="space-y-4">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskSelect(task)}
          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer transition-all ${
            selectedTaskId === task.id
              ? 'ring-2 ring-emerald-500'
              : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-emerald-900 dark:text-emerald-100">{task.subject}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status || 'todo')}`}>
                {(task.status || 'todo').replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{task.due_date ? formatDateTime(task.due_date) : 'No due date'}</span>
              </div>
              {task.account_id && task.account && (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>{task.account.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Assigned to: {task.assigned_user?.first_name} {task.assigned_user?.last_name || 'Unassigned'}</span>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}