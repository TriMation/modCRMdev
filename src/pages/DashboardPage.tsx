import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, Clock, CheckSquare } from 'lucide-react';
import { getDashboardMetrics, DashboardMetrics } from '../services/dashboardService';
import { SalesFunnel } from '../components/dashboard/SalesFunnel';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMetrics() {
      try {
        if (!user) return;
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load dashboard metrics');
        console.error('Error loading metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, [user]);

  if (loading) {
    return <div className="flex-1 p-6">
      <div className="animate-pulse">Loading dashboard metrics...</div>
    </div>;
  }

  if (error || !metrics) {
    return <div className="flex-1 p-6">
      <div className="text-red-600">{error || 'Failed to load metrics'}</div>
    </div>;
  }

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          title="Total Pipeline"
          value={`$${metrics.totalValue.toLocaleString()}`}
          change={`${metrics.totalOpportunities} opportunities`}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          title="New Leads"
          value={metrics.totalLeads.toString()}
          change={`${metrics.leadsByStage[0]?.count || 0} new`}
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          title="Won Opportunities"
          value={metrics.opportunitiesByStage.find(s => s.stage === 'Closed Won')?.count.toString() || '0'}
          change={`$${(metrics.opportunitiesByStage.find(s => s.stage === 'Closed Won')?.value || 0).toLocaleString()}`}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          title="Tasks Due"
          value={metrics.totalTasks.toString()}
          change={`${metrics.upcomingTasks.length} upcoming`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <SalesFunnel metrics={metrics} />
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {metrics.upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{task.subject}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' 
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, title, value, change }: { icon: React.ReactNode; title: string; value: string; change: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{title}</h3>
      <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">{value}</p>
    </div>
  );
}