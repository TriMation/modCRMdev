import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Activity, Percent } from 'lucide-react';
import { Opportunity } from '../../types/opportunity';

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

interface OpportunityFiltersProps {
  opportunities: Opportunity[];
  selectedFilters: {
    stage?: string;
    probability?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

export function OpportunityFilters({ opportunities, selectedFilters, onFilterChange }: OpportunityFiltersProps) {
  const [filterGroups, setFilterGroups] = useState<Record<string, boolean>>({
    stage: true,
    probability: true
  });

  const toggleGroup = (group: string) => {
    setFilterGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const filters: FilterGroup[] = [
    {
      label: 'Stage',
      icon: <Activity className="w-4 h-4" />,
      isOpen: filterGroups.stage,
      filters: [
        {
          value: 'new',
          label: 'New',
          count: opportunities.filter(o => o.stage === 'new').length
        },
        {
          value: 'contacted',
          label: 'Contacted',
          count: opportunities.filter(o => o.stage === 'contacted').length
        },
        {
          value: 'converted',
          label: 'Converted',
          count: opportunities.filter(o => o.stage === 'converted').length
        }
      ]
    },
    {
      label: 'Probability',
      icon: <Percent className="w-4 h-4" />,
      isOpen: filterGroups.probability,
      filters: [
        {
          value: 'high',
          label: 'High (70%+)',
          count: opportunities.filter(o => o.probability >= 70).length
        },
        {
          value: 'medium',
          label: 'Medium (30-69%)',
          count: opportunities.filter(o => o.probability >= 30 && o.probability < 70).length
        },
        {
          value: 'low',
          label: 'Low (<30%)',
          count: opportunities.filter(o => o.probability < 30).length
        }
      ]
    }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Filters</h2>
      <div className="space-y-4">
        {filters.map((group) => (
          <div key={group.label} className="space-y-2">
            <button
              onClick={() => toggleGroup(group.label.toLowerCase())}
              className="flex items-center justify-between w-full text-sm font-medium text-emerald-900 dark:text-emerald-100 hover:text-emerald-700 dark:hover:text-emerald-300"
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
                    className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400 cursor-pointer"
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