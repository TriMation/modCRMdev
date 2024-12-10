import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, Building2, User, Calendar, Pencil } from 'lucide-react';
import { Opportunity } from '../types/opportunity';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { TaskList } from '../components/tasks/TaskList';
import { getOpportunity } from '../services/opportunityService';
import { getTasks } from '../services/taskService';
import { Task } from '../types/task';

type TabType = 'overview' | 'tasks' | 'history';

export function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        if (!id) return;
        const [oppData, tasksData] = await Promise.all([
          getOpportunity(id),
          getTasks()
        ]);
        setOpportunity(oppData);
        setTasks(tasksData.filter(task => task.opportunity_id === id));
      } catch (err) {
        setError('Failed to load opportunity details');
        console.error('Error loading opportunity:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">Loading opportunity details...</div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="flex-1 p-6">
        <div className="text-red-600">{error || 'Opportunity not found'}</div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Opportunities', path: '/dashboard/opportunities' },
    { label: opportunity.name }
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'history', label: 'History' }
  ];

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-emerald-600 bg-emerald-50';
    if (probability >= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                  <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {opportunity.name}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(opportunity.probability)}`}>
                      {opportunity.probability}% probability
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ${opportunity.value.toLocaleString()} {opportunity.currency}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/dashboard/opportunities/${id}/edit`)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                {opportunity.account && (
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <Building2 className="w-5 h-5" />
                    <span>{opportunity.account.name}</span>
                  </div>
                )}
                {opportunity.contact && (
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <User className="w-5 h-5" />
                    <span>
                      {opportunity.contact.first_name} {opportunity.contact.last_name}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                  <span>Close Date: {new Date(opportunity.close_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-100 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-emerald-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {opportunity.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                      Description
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-400">
                      {opportunity.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <TaskList
                  tasks={tasks}
                  onTaskSelect={(task) => navigate(`/dashboard/tasks/${task.id}`)}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-emerald-600 dark:text-emerald-400">
                History view coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}