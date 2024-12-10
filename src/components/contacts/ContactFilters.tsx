import React from 'react';
import { ChevronDown, ChevronRight, User, Building2, MapPin } from 'lucide-react';
import { Contact } from '../../types/contact';
import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

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

interface ContactFiltersProps {
  contacts: Contact[];
  selectedFilters: {
    role?: string;
    account?: string;
    country?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

interface AccountInfo {
  id: string;
  name: string;
  country: string;
}

export function ContactFilters({ contacts, selectedFilters, onFilterChange }: ContactFiltersProps) {
  const [filterGroups, setFilterGroups] = useState<Record<string, boolean>>({
    role: true,
    account: true,
    country: true
  });
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('id, name, country');
        
        if (error) throw error;
        setAccounts(data || []);
      } catch (err) {
        console.error('Error loading accounts:', err);
      }
    }
    loadAccounts();
  }, []);

  const toggleGroup = (group: string) => {
    setFilterGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const getRoleFilters = () => {
    const roles = new Map<string, number>();
    contacts.forEach(contact => {
      if (contact.position) {
        roles.set(contact.position, (roles.get(contact.position) || 0) + 1);
      }
    });
    return Array.from(roles.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({
        value,
        label: value,
        count
      }));
  };

  const getAccountFilters = () => {
    const accountCounts = new Map<string, number>();
    contacts.forEach(contact => {
      const account = accounts.find(a => a.id === contact.account_id);
      if (account) {
        accountCounts.set(account.id, (accountCounts.get(account.id) || 0) + 1);
      }
    });
    
    return Array.from(accountCounts.entries()).map(([id, count]) => {
      const account = accounts.find(a => a.id === id);
      return {
        value: id,
        label: account?.name || 'Unknown Account',
        count
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  };

  const getCountryFilters = () => {
    const countryCounts = new Map<string, number>();
    contacts.forEach(contact => {
      const account = accounts.find(a => a.id === contact.account_id);
      if (account?.country) {
        countryCounts.set(account.country, (countryCounts.get(account.country) || 0) + 1);
      }
    });
    
    return Array.from(countryCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({
        value,
        label: value,
        count
      }));
  };

  const filters: FilterGroup[] = [
    {
      label: 'Role',
      icon: <User className="w-4 h-4" />,
      isOpen: filterGroups.role,
      filters: getRoleFilters()
    },
    {
      label: 'Account',
      icon: <Building2 className="w-4 h-4" />,
      isOpen: filterGroups.account,
      filters: getAccountFilters(),
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
                    key={`${group.label}-${filter.value}`}
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