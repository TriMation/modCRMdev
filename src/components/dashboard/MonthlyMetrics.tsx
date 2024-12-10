import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { DashboardMetrics } from '../../services/dashboardService';
import { getStageColors } from '../../utils/opportunityUtils';

interface MonthlyMetricsProps {
  metrics: DashboardMetrics;
}

export function MonthlyMetrics({ metrics }: MonthlyMetricsProps) {
  const [timePeriod, setTimePeriod] = useState<'last6' | 'next6'>('next6');
  
  const getMonthlyData = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() + (timePeriod === 'last6' ? -5 : 1), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + (timePeriod === 'last6' ? 1 : 6), 0);

    const monthlyData = new Map();
    const stages = new Set<string>();

    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
      const monthKey = d.toISOString().substring(0, 7);
      monthlyData.set(monthKey, {
        opportunities: new Map(),
        total: 0
      });
    }

    metrics.opportunities.forEach(opp => {
      const closeDate = new Date(opp.close_date);
      if (closeDate >= startDate && closeDate <= endDate) {
        const monthKey = closeDate.toISOString().substring(0, 7);
        const monthData = monthlyData.get(monthKey);
        if (monthData) {
          const stage = opp.stage?.name || 'Unknown';
          stages.add(stage);
          
          if (!monthData.opportunities.has(stage)) {
            monthData.opportunities.set(stage, {
              value: 0,
              items: []
            });
          }
          
          const stageData = monthData.opportunities.get(stage);
          stageData.value += opp.value;
          stageData.items.push({
            name: opp.name,
            value: opp.value
          });
          monthData.total += opp.value;
        }
      }
    });

    return {
      months: Array.from(monthlyData.entries())
        .map(([month, data]) => ({
          month,
          ...data,
          stages: Array.from(data.opportunities.entries()).map(([stage, stageData]) => ({
            stage,
            ...stageData
          }))
        }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      stages: Array.from(stages)
    };
  };

  const { months, stages } = getMonthlyData();
  const maxValue = Math.max(...months.map(m => m.total));

  const lastMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];
  
  const valueChange = lastMonth && previousMonth
    ? ((lastMonth.total - previousMonth.total) / (previousMonth.total || 1) * 100).toFixed(1)
    : '0';

  const countChange = lastMonth && previousMonth
    ? ((lastMonth.total - previousMonth.total) / previousMonth.total * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Monthly Metrics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as typeof timePeriod)}
            className="px-3 py-1 bg-emerald-50 dark:bg-gray-700 border border-emerald-100 dark:border-gray-600 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="last6">Last 6 Months</option>
            <option value="next6">Next 6 Months</option>
          </select>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Monthly Value</span>
            <div className={`flex items-center space-x-1 text-sm ${
              Number(valueChange) >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span>{valueChange}%</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100 mt-1">
            ${lastMonth?.total?.toLocaleString() || '0'}
          </p>
        </div>

        <div className="bg-emerald-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Deal Count</span>
            <div className={`flex items-center space-x-1 text-sm ${
              Number(countChange) >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span>{countChange}%</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100 mt-1">
            {lastMonth?.stages.size || 0}
          </p>
        </div>
      </div>

      <div className="relative h-80">
        {/* Y-axis labels */}
        <div className="absolute inset-y-0 left-0 w-16 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map((tick) => (
            <div key={tick} className="flex items-center">
              <span className="text-xs text-emerald-500 dark:text-emerald-400 w-full text-right pr-2">
                ${((maxValue * tick) / 100).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="absolute inset-y-0 left-16 right-0">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 75, 50, 25, 0].map((tick) => (
              <div 
                key={tick}
                className="w-full h-px bg-emerald-100 dark:bg-gray-700"
              />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex justify-between items-end pb-8">
            {months.map((data) => {
              const [year, month] = data.month.split('-');
              const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
              const yearNum = parseInt(year);
              let currentHeight = 0;
              
              return (
                <div key={data.month} className="flex-1 flex flex-col px-1">
                  <div className="relative h-full">
                    {stages.map(stage => {
                        const stageData = data.stageData[stage] || { value: 0, opportunities: [] };
                        const height = maxValue > 0 ? (stageData.value / maxValue) * 100 : 0;
                        const prevHeight = currentHeight;
                        currentHeight += height;

                        return (
                          <div
                            key={stage}
                            className={`absolute w-full ${getStageColor(stage)} group`}
                            style={{
                              bottom: `${prevHeight}%`,
                              height: `${height}%`,
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-emerald-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                              <div className="font-medium">{stage}</div>
                              <div>${stageData.value.toLocaleString()}</div>
                              {stageData.opportunities.map((opp, i) => (
                                <div key={i} className="text-xs opacity-75">
                                  {opp.name}: ${opp.value.toLocaleString()}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                    })}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                      {monthName} {yearNum !== new Date().getFullYear() ? yearNum : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex justify-center flex-wrap gap-4">
        {stages.map(stage => (
          <div key={stage} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${getStageColor(stage)}`} />
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}