import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building2, MapPin } from 'lucide-react';
import { Account } from '../../types/account';

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

interface AccountFiltersProps {
  accounts: Account[];
  selectedFilters: {
    industry?: string;
    state?: string;
    country?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

export function AccountFilters({ accounts, selectedFilters, onFilterChange }: AccountFiltersProps) {
  const [filterGroups, setFilterGroups] = useState<Record<string, boolean>>({
    industry: true,
    state: true,
    country: true
  });

  const toggleGroup = (group: string) => {
    setFilterGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const getIndustryFilters = () => {
    const industries = new Map<string, number>();
    accounts.forEach(account => {
      const industry = account.industry || 'Unspecified';
      industries.set(industry, (industries.get(industry) || 0) + 1);
    });
    return Array.from(industries.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({
        value,
        label: value,
        count
      }));
  };

  const getStateFilters = () => {
    const states = new Map<string, number>();
    accounts.forEach(account => {
      const state = account.state || 'Unspecified';
      states.set(state, (states.get(state) || 0) + 1);
    });
    return Array.from(states.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({
        value,
        label: value,
        count
      }));
  };

  const getCountryFilters = () => {
    const countries = new Map<string, number>();
    accounts.forEach(account => {
      const country = account.country || 'United States';
      countries.set(country, (countries.get(country) || 0) + 1);
    });
    return Array.from(countries.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({
        value,
        label: value,
        count
      }));
  };

  const filters: FilterGroup[] = [
    {
      label: 'Industry',
      icon: <Building2 className="w-4 h-4" />, 
      isOpen: filterGroups.industry,
      filters: getIndustryFilters()
    },
    {
      label: 'State',
      icon: <MapPin className="w-4 h-4" />,
      isOpen: filterGroups.state,
      filters: getStateFilters()
    },
    {
      label: 'Country',
      icon: <MapPin className="w-4 h-4" />,
      isOpen: filterGroups.country,
      filters: getCountryFilters()
    }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Filters</h2>
      <div className="space-y-4">
        {filters.map((group) => (
          <div key={group.label} className="space-y-2">
            <button
              type="button"
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
            {group.isOpen && group.filters.length > 0 && (
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
                    <span>{filter.label === 'Unspecified' ? 'Unspecified' : filter.label}</span>
                    <span className="text-emerald-400">({filter.count})</span>
                  </label>
                ))}
              </div>
            )}
            {group.isOpen && group.filters.length === 0 && (
              <div className="pl-6 text-sm text-emerald-600 dark:text-emerald-400">
                No filters available
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}