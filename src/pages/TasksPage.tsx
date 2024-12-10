import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types/task';
import { getTasks } from '../services/taskService';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskDetail } from '../components/tasks/TaskDetail';
import { NewTaskForm } from '../components/tasks/NewTaskForm';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchField } from '../components/common/SearchField';

export function TasksPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    status?: string;
    priority?: string;
    dueDate?: string;
    hideCompleted: boolean;
    myTasks: boolean;
  }>({
    hideCompleted: true,
    myTasks: true
  });
  const [sortConfig, setSortConfig] = useState<{
    field: 'due_date' | 'priority';
    direction: 'asc' | 'desc';
  }>({
    field: 'due_date',
    direction: 'asc'
  });

  useEffect(() => {
    async function loadTasks() {
      try {
        if (!user) return;
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Error loading tasks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [user]);

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (typeof value === 'boolean') {
        newFilters[filterType as 'hideCompleted' | 'myTasks'] = value;
      } else {
        if (prev[filterType as keyof typeof prev] === value) {
          delete newFilters[filterType as keyof typeof prev];
        } else {
          newFilters[filterType as keyof typeof prev] = value as string;
        }
      }
      return newFilters;
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter out completed tasks if hideCompleted is true
    if (selectedFilters.hideCompleted && task.status === 'completed') {
      return false;
    }

    // Filter for current user's tasks if myTasks is true
    if (selectedFilters.myTasks && task.owner_id !== user?.id) {
      return false;
    }

    const matchesStatus = !selectedFilters.status || task.status === selectedFilters.status;
    const matchesPriority = !selectedFilters.priority || task.priority === selectedFilters.priority;
    
    let matchesDueDate = true;
    if (selectedFilters.dueDate) {
      const today = new Date();
      const dueDate = new Date(task.due_date);
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (selectedFilters.dueDate === 'today') {
        matchesDueDate = diffDays === 0;
      } else if (selectedFilters.dueDate === 'week') {
        matchesDueDate = diffDays <= 7 && diffDays >= 0;
      } else if (selectedFilters.dueDate === 'overdue') {
        matchesDueDate = diffDays < 0;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
  });

  const breadcrumbItems = [
    { label: 'Tasks' }
  ];

  if (loading) {
    return <div className="flex-1 p-6">
      <div className="animate-pulse">Loading tasks...</div>
    </div>;
  }

  if (error) {
    return <div className="flex-1 p-6">
      <div className="text-red-600">{error}</div>
    </div>;
  }

  const activeFilterCount = Object.keys(selectedFilters).length;

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Tasks</h1>
          <button 
            onClick={() => setShowNewTaskForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-gray-700 dark:text-emerald-400 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-emerald-600 text-white dark:bg-emerald-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search tasks..."
          />
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <TaskFilters
              tasks={tasks}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          )}

          <div className="flex-1">
            <TaskList
              tasks={filteredTasks}
              onTaskSelect={setSelectedTask}
              selectedTaskId={selectedTask?.id}
              sortConfig={sortConfig}
              onSort={setSortConfig}
            />
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {showNewTaskForm && (
        <NewTaskForm onClose={() => setShowNewTaskForm(false)} />
      )}
    </main>
  );
}