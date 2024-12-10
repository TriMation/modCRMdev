import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, AlertCircle, Calendar } from 'lucide-react';
import { Task } from '../../types/task';

interface FilterGroup {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  filters: {
    value: string;
    label: string;
    count: number;
  }[];
}

interface TaskFiltersProps {
  tasks: Task[];
  selectedFilters: {
    hideCompleted: boolean;
    myTasks: boolean;
    status?: string;
    priority?: string;
    dueDate?: string;
  };
  onFilterChange: (filterType: string, value: string | boolean) => void;
}

export function TaskFilters({ tasks, selectedFilters, onFilterChange }: TaskFiltersProps) {
  const [filterGroups, setFilterGroups] = useState<Record<string, boolean>>({
    status: true,
    priority: true,
    dueDate: true
  });

  const toggleGroup = (group: string) => {
    setFilterGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const filters: FilterGroup[] = [
    {
      label: 'Status',
      icon: <Clock className="w-4 h-4" />,
      isOpen: filterGroups.status,
      filters: [
        {
          value: 'todo',
          label: 'To Do',
          count: tasks.filter(t => t.status === 'todo').length
        },
        {
          value: 'in_progress',
          label: 'In Progress',
          count: tasks.filter(t => t.status === 'in_progress').length
        },
        {
          value: 'completed',
          label: 'Completed',
          count: tasks.filter(t => t.status === 'completed').length
        }
      ]
    },
    {
      label: 'Priority',
      icon: <AlertCircle className="w-4 h-4" />,
      isOpen: filterGroups.priority,
      filters: [
        {
          value: 'high',
          label: 'High',
          count: tasks.filter(t => t.priority === 'high').length
        },
        {
          value: 'medium',
          label: 'Medium',
          count: tasks.filter(t => t.priority === 'medium').length
        },
        {
          value: 'low',
          label: 'Low',
          count: tasks.filter(t => t.priority === 'low').length
        }
      ]
    },
    {
      label: 'Due Date',
      icon: <Calendar className="w-4 h-4" />,
      isOpen: filterGroups.dueDate,
      filters: [
        {
          value: 'today',
          label: 'Due Today',
          count: tasks.filter(t => {
            const today = new Date();
            const dueDate = new Date(t.dueDate);
            return today.toDateString() === dueDate.toDateString();
          }).length
        },
        {
          value: 'week',
          label: 'Due This Week',
          count: tasks.filter(t => {
            const today = new Date();
            const dueDate = new Date(t.dueDate);
            const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
          }).length
        },
        {
          value: 'overdue',
          label: 'Overdue',
          count: tasks.filter(t => {
            const today = new Date();
            const dueDate = new Date(t.dueDate);
            return dueDate < today;
          }).length
        }
      ]
    }
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-emerald-900 mb-4">Filters</h2>
      
      {/* Default Filters */}
      <div className="mb-4 pb-4 border-b border-emerald-100 dark:border-gray-700 space-y-2">
        <label className="flex items-center space-x-2 text-sm text-emerald-600 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters.hideCompleted}
            onChange={() => onFilterChange('hideCompleted', !selectedFilters.hideCompleted)}
            className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Hide Completed Tasks</span>
        </label>
        
        <label className="flex items-center space-x-2 text-sm text-emerald-600 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters.myTasks}
            onChange={() => onFilterChange('myTasks', !selectedFilters.myTasks)}
            className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>My Tasks Only</span>
        </label>
      </div>
      <div className="space-y-4">
        {filters.map((group) => (
          <div key={group.label} className="space-y-2">
            <button
              onClick={() => toggleGroup(group.label.toLowerCase())}
              className="flex items-center justify-between w-full text-sm font-medium text-emerald-900 hover:text-emerald-700"
            >
              <div className="flex items-center space-x-2">
                {group.icon}
                <span>{group.label}</span>
              </div>
              {group.isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {group.isOpen && (
              <div className="pl-6 space-y-2">
                {group.filters.map((filter) => (
                  <label
                    key={filter.value}
                    className="flex items-center space-x-2 text-sm text-emerald-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[group.label.toLowerCase() as keyof typeof selectedFilters] === filter.value}
                      onChange={() => onFilterChange(group.label.toLowerCase(), filter.value)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{filter.label}</span>
                    <span className="text-emerald-400">({filter.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}