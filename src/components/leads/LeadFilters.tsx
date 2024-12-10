import React, { useState } from 'react';
import { ChevronDown, ChevronRight, DollarSign, Activity } from 'lucide-react';
import { Lead } from '../../types/lead';
import { getStageColor } from '../../utils/leadUtils';

interface FilterGroup {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  filters: {
    value: string;
    label: string;
    count: number;
    color?: string;
  }[];
}

interface LeadFiltersProps {
  leads: Lead[];
  stages: { id: string; name: string; color: string }[];
  selectedFilters: {
    stage?: string;
    value?: string;
    hideConverted: boolean;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

export function LeadFilters({ leads, stages, selectedFilters, onFilterChange }: LeadFiltersProps) {
  const [filterGroups, setFilterGroups] = useState<Record<string, boolean>>({
    stage: true,
    value: true
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
      filters: stages.map(stage => ({
        value: stage.id,
        label: stage.name,
        count: leads.filter(l => l.stage_id === stage.id).length,
        color: stage.color
      }))
    },
    {
      label: 'Value',
      icon: <DollarSign className="w-4 h-4" />,
      isOpen: filterGroups.value,
      filters: [
        {
          value: 'high',
          label: 'High Value (>$50k)',
          count: leads.filter(l => l.value >= 50000).length
        },
        {
          value: 'medium',
          label: 'Medium Value ($10k-$50k)',
          count: leads.filter(l => l.value >= 10000 && l.value < 50000).length
        },
        {
          value: 'low',
          label: 'Low Value (<$10k)',
          count: leads.filter(l => l.value < 10000).length
        }
      ]
    }
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-emerald-900 mb-4">Filters</h2>
      
      {/* Hide Converted Toggle */}
      <div className="mb-4 pb-4 border-b border-emerald-100 dark:border-gray-700">
        <label className="flex items-center space-x-2 text-sm text-emerald-600 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters.hideConverted}
            onChange={() => onFilterChange('hideConverted', !selectedFilters.hideConverted)}
            className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Hide Converted Leads</span>
        </label>
      </div>
      
      <div className="space-y-4">
        {filters.map((group) => (
          <div key={group.label} className="space-y-2">
            <button
              onClick={() => toggleGroup(group.label.toLowerCase())}
              className="flex items-center justify-between w-full text-sm font-medium text-emerald-900 hover:text-emerald-700"
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
                    className="flex items-center space-x-2 text-sm text-emerald-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        group.label === 'Stage' 
                          ? selectedFilters.stage === filter.value
                          : selectedFilters.value === filter.value
                      }
                      onChange={() => onFilterChange(group.label.toLowerCase(), filter.value)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={filter.color ? getStageColor(filter.color) : ''}>{filter.label}</span>
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