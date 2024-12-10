import React, { useState, useEffect } from 'react';
import { Plus, Filter, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Account } from '../types/account';
import { getAccounts } from '../services/accountService';
import { AccountCard } from '../components/accounts/AccountCard';
import { AccountFilters } from '../components/accounts/AccountFilters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchField } from '../components/common/SearchField';

export function AccountsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    industry?: string;
    state?: string;
    country?: string;
  }>({});

  useEffect(() => {
    async function loadAccounts() {
      try {
        if (!user) return;
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        setError('Failed to load accounts');
        console.error('Error loading accounts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAccounts();
  }, []);

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (prev[filterType as keyof typeof prev] === value) {
        delete newFilters[filterType as keyof typeof prev];
      } else {
        newFilters[filterType as keyof typeof prev] = value;
      }
      return newFilters;
    });
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.city || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = !selectedFilters.industry || account.industry === selectedFilters.industry;
    const matchesState = !selectedFilters.state || account.state === selectedFilters.state;
    const matchesCountry = !selectedFilters.country || account.country === selectedFilters.country;

    return matchesSearch && matchesIndustry && matchesState && matchesCountry;
  });

  const handleAccountClick = (account: Account) => {
    navigate(`/dashboard/accounts/${account.id}`);
  };

  const breadcrumbItems = [
    { label: 'Accounts' }
  ];

  if (loading) {
    return <div className="flex-1 p-6">
      <div className="animate-pulse">Loading accounts...</div>
    </div>;
  }

  if (error) {
    return <div className="flex-1 p-6">
      <div className="text-red-600">{error}</div>
    </div>;
  }

  const activeFilterCount = Object.keys(selectedFilters).length;

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Accounts</h1>
        <button 
          onClick={() => navigate('/dashboard/accounts/new')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Account</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-gray-700 dark:text-emerald-400 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-emerald-600 text-white dark:bg-emerald-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search accounts..."
        />
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <AccountFilters
            accounts={accounts}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        )}

        <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 ${showFilters ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-4`}>
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onClick={handleAccountClick}
            />
          ))}
        </div>
      </div>
    </main>
  );
};