import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

interface OpportunityViewToggleProps {
  view: 'list' | 'kanban';
  onViewChange: (view: 'list' | 'kanban') => void;
}

export function OpportunityViewToggle({ view, onViewChange }: OpportunityViewToggleProps) {
  return (
    <div className="flex items-center bg-emerald-50 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
          view === 'list'
            ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-emerald-600 dark:text-emerald-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
        }`}
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">List</span>
      </button>
      <button
        onClick={() => onViewChange('kanban')}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
          view === 'kanban'
            ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-emerald-600 dark:text-emerald-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-medium">Kanban</span>
      </button>
    </div>
  );
}