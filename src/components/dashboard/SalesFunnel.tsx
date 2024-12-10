import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, DollarSign } from 'lucide-react';
import { DashboardMetrics } from '../../services/dashboardService';

interface SalesFunnelProps {
  metrics: DashboardMetrics;
}

export function SalesFunnel({ metrics }: SalesFunnelProps) {
  const navigate = useNavigate();
  
  const leadStats = {
    total: metrics.totalLeads,
    value: metrics.leadsByStage.reduce((sum, stage) => sum + stage.value, 0),
    byStage: metrics.leadsByStage
  };

  const opportunityStats = {
    total: metrics.totalOpportunities,
    value: metrics.opportunitiesByStage.reduce((sum, stage) => sum + stage.value, 0),
    byStage: metrics.opportunitiesByStage
  };

  const conversionRate = leadStats.total > 0 
    ? ((opportunityStats.byStage.find(s => s.stage === 'Closed Won')?.count || 0) / leadStats.total * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-6">Sales Funnel</h2>
      
      <div className="space-y-8">
        {/* Leads Section */}
        <div 
          onClick={() => navigate('/dashboard/leads')}
          className="cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Leads</h3>
            </div>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Total Value: ${leadStats.value.toLocaleString()}
            </span>
          </div>
          
          <div className="relative h-12">
            <div className="absolute inset-0 bg-emerald-50 dark:bg-gray-700 rounded-lg transform skew-x-[-20deg] group-hover:bg-emerald-100 dark:group-hover:bg-gray-600 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-around">
              {leadStats.byStage.map((stage, index) => (
                <div key={stage.stage} className="text-center">
                  <div className="relative group">
                    <div className="font-semibold text-emerald-900 dark:text-emerald-100">{stage.count}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">{stage.stage}</div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-16 left-1/2 transform -translate-x-1/2 bg-emerald-900 dark:bg-emerald-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity z-10">
                      <div>Value: ${stage.value.toLocaleString()}</div>
                      <div>{stage.count} leads</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Arrow */}
        <div className="flex justify-center">
          <div className="text-center px-4 py-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{conversionRate}%</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Conversion Rate</div>
          </div>
        </div>

        {/* Opportunities Section */}
        <div 
          onClick={() => navigate('/dashboard/opportunities')}
          className="cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Opportunities</h3>
            </div>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Total Value: ${opportunityStats.value.toLocaleString()}
            </span>
          </div>
          
          <div className="relative h-16">
            <div className="absolute inset-0 bg-emerald-50 dark:bg-gray-700 rounded-lg transform skew-x-[-20deg] group-hover:bg-emerald-100 dark:group-hover:bg-gray-600 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-around">
              {opportunityStats.byStage.map((stage, index) => (
                <div key={stage.stage} className="text-center">
                  <div className="relative group">
                    <div className="font-semibold text-emerald-900 dark:text-emerald-100">{stage.count}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">{stage.stage}</div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-16 left-1/2 transform -translate-x-1/2 bg-emerald-900 dark:bg-emerald-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity z-10">
                      <div>Value: ${stage.value.toLocaleString()}</div>
                      <div>{stage.count} opportunities</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}