import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { TaskList } from '../tasks/TaskList';
import { DEFAULT_VALUES } from '../../utils/demoData';

interface AccountTasksProps {
  accountId: string;
}

export function AccountTasks({ accountId }: AccountTasksProps) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch tasks for this account
    setLoading(false);
  }, [accountId]);

  if (loading) {
    return <div className="animate-pulse">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Tasks</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      <TaskList 
        tasks={tasks}
        onTaskSelect={() => {}}
      />
    </div>
  );
}