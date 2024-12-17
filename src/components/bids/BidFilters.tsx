import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Activity } from 'lucide-react';
import { Bid } from '../../types/bid';

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

interface BidFiltersProps {
  bids: Bid[];
  selectedFilters: {
    status?: string;
    submissionDate?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

export function BidFilters({ bids, selectedFilters, onFilterChange }: BidFiltersProps) {
  const [filterGroups, setFilterGroups] = useState<Record<string, boolean>>({
    status: true,
    submissionDate: true
  });

  const toggleGroup = (group: string) => {
    setFilterGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const filters: FilterGroup[] = [
    {
      label: 'Status',
      icon: <Activity className="w-4 h-4" />,
      isOpen: filterGroups.status,
      filters: [
        {
          value: 'draft',
          label: 'Draft',
          count: bids.filter(b => b.status === 'draft').length
        },
        {
          value: 'in_progress',
          label: 'In Progress',
          count: bids.filter(b => b.status === 'in_progress').length
        },
        {
          value: 'submitted',
          label: 'Submitted',
          count: bids.filter(b => b.status === 'submitted').length
        },
        {
          value: 'won',
          label: 'Won',
          count: bids.filter(b => b.status === 'won').length
        },
        {
          value: 'lost',
          label: 'Lost',
          count: bids.filter(b => b.status === 'lost').length
        }
      ]
    },
    {
      label: 'Submission Date',
      icon: <Calendar className="w-4 h-4" />,
      isOpen: filterGroups.submissionDate,
      filters: [
        {
          value: 'this_week',
          label: 'This Week',
          count: bids.filter(b => {
            const submissionDate = new Date(b.submission_date);
            const today = new Date();
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            return submissionDate >= weekStart && submissionDate <= weekEnd;
          }).length
        },
        {
          value: 'next_week',
          label: 'Next Week',
          count: bids.filter(b => {
            const submissionDate = new Date(b.submission_date);
            const today = new Date();
            const nextWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 7));
            const nextWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 13));
            return submissionDate >= nextWeekStart && submissionDate <= nextWeekEnd;
          }).length
        },
        {
          value: 'this_month',
          label: 'This Month',
          count: bids.filter(b => {
            const submissionDate = new Date(b.submission_date);
            const today = new Date();
            return submissionDate.getMonth() === today.getMonth() &&
                   submissionDate.getFullYear() === today.getFullYear();
          }).length
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