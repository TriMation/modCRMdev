import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Globe, Phone, Mail, MapPin, Pencil } from 'lucide-react';
import { Account } from '../types/account';
import { Task } from '../types/task';
import { Lead } from '../types/lead';
import { Opportunity } from '../types/opportunity';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EditAccountForm } from '../components/accounts/EditAccountForm';
import { TaskList } from '../components/tasks/TaskList';
import { LeadList } from '../components/leads/LeadList';
import { OpportunityList } from '../components/opportunities/OpportunityList';
import { getAccount } from '../services/accountService';
import { getTasks } from '../services/taskService';
import { getLeads } from '../services/leadService';
import { getOpportunities } from '../services/opportunityService';

type TabType = 'overview' | 'tasks' | 'leads' | 'opportunities' | 'history';

export function AccountDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        if (!id) return;
        const [accountData, tasksData, leadsData, opportunitiesData] = await Promise.all([
          getAccount(id),
          getTasks(),
          getLeads(),
          getOpportunities()
        ]);
        
        setAccount(accountData);
        setTasks(tasksData.filter(task => task.account_id === id));
        setLeads(leadsData.filter(lead => lead.account_id === id));
        setOpportunities(opportunitiesData.filter(opp => opp.account_id === id));
      } catch (err) {
        setError('Failed to load account details');
        console.error('Error loading account:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">Loading account details...</div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex-1 p-6">
        <div className="text-red-600">{error || 'Account not found'}</div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Accounts', path: '/dashboard/accounts' },
    { label: account.name }
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: `Tasks (${tasks.length})` },
    { id: 'leads', label: `Leads (${leads.length})` },
    { id: 'opportunities', label: `Opportunities (${opportunities.length})` },
    { id: 'history', label: 'History' }
  ];

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
                  <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {account.name}
                  </h1>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    {account.industry || 'No industry specified'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                {account.website && (
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <Globe className="w-5 h-5" />
                    <a href={account.website} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700">
                      {account.website}
                    </a>
                  </div>
                )}
                {account.phone && (
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <Phone className="w-5 h-5" />
                    <span>{account.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {account.address && (
                  <div className="flex items-start space-x-2 text-emerald-600 dark:text-emerald-400">
                    <MapPin className="w-5 h-5 mt-1" />
                    <div>
                      <p>{account.address}</p>
                      {account.city && account.state && (
                        <p>{account.city}, {account.state} {account.country}</p>
                      )}
                    </div>
                  </div>
                )}
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
                <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  Account Overview
                </h2>
                {/* Add overview metrics and charts here */}
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

            {activeTab === 'leads' && (
              <div>
                <LeadList
                  leads={leads}
                  onLeadSelect={(lead) => navigate(`/dashboard/leads/${lead.id}`)}
                />
              </div>
            )}

            {activeTab === 'opportunities' && (
              <div>
                <OpportunityList
                  opportunities={opportunities}
                  onOpportunitySelect={(opp) => navigate(`/dashboard/opportunities/${opp.id}`)}
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
      
      {showEditForm && account && (
        <EditAccountForm
          account={account}
          onClose={() => setShowEditForm(false)}
          onSuccess={async () => {
            const updatedAccount = await getAccount(account.id);
            setAccount(updatedAccount);
          }}
        />
      )}
    </div>
  );
}