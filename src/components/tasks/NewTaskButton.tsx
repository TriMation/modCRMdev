import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { NewTaskForm } from './NewTaskForm';

interface NewTaskButtonProps {
  opportunityId?: string;
  accountId?: string;
}

export function NewTaskButton({ opportunityId, accountId }: NewTaskButtonProps) {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowNewTaskForm(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium">Add Task</span>
      </button>

      {showNewTaskForm && (
        <NewTaskForm 
          onClose={() => setShowNewTaskForm(false)}
          opportunityId={opportunityId}
          accountId={accountId}
        />
      )}
    </>
  );
}