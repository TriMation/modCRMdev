import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Opportunity } from '../types/opportunity';
import { getOpportunities } from '../services/opportunityService';
import { OpportunityList } from '../components/opportunities/OpportunityList';
import { OpportunityKanban } from '../components/opportunities/OpportunityKanban';
import { OpportunityFilters } from '../components/opportunities/OpportunityFilters';
import { OpportunityDetail } from '../components/opportunities/OpportunityDetail';
import { NewOpportunityForm } from '../components/opportunities/NewOpportunityForm';
import { OpportunityViewToggle } from '../components/opportunities/OpportunityViewToggle';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchField } from '../components/common/SearchField';

export function OpportunitiesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showNewOpportunityForm, setShowNewOpportunityForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    stage?: string;
    probability?: string;
  }>({});
  
  const loadOpportunities = async () => {
    try {
      if (!user) return;
      const oppsData = await getOpportunities();
      setOpportunities(oppsData);
    } catch (err) {
      setError('Failed to load opportunities');
      console.error('Error loading opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [user]);

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

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = !selectedFilters.stage || opportunity.stage?.id === selectedFilters.stage;
    const matchesProbability = !selectedFilters.probability || (
      selectedFilters.probability === 'high' ? opportunity.probability >= 70 :
      selectedFilters.probability === 'medium' ? (opportunity.probability >= 30 && opportunity.probability < 70) :
      opportunity.probability < 30
    );

    return matchesSearch && matchesStage && matchesProbability;
  });

  const breadcrumbItems = [
    { label: 'Opportunities' }
  ];

  if (loading) {
    return <div className="flex-1 p-6">
      <div className="animate-pulse">Loading opportunities...</div>
    </div>;
  }

  if (error) {
    return <div className="flex-1 p-6">
      <div className="text-red-600">{error}</div>
    </div>;
  }

  const activeFilterCount = Object.keys(selectedFilters).length;

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-6 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Opportunities</h1>
          <div className="flex items-center space-x-4">
            <OpportunityViewToggle view={view} onViewChange={setView} />
            <button 
              onClick={() => setShowNewOpportunityForm(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Opportunity</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
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
            placeholder="Search opportunities..."
          />
        </div>

        <div className="flex gap-6 h-full">
          {showFilters && (
            <OpportunityFilters
              opportunities={opportunities}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          )}

          <div className="flex-1">
            {view === 'list' ? (
              <OpportunityList
                opportunities={filteredOpportunities}
                onOpportunitySelect={(opp) => navigate(`/dashboard/opportunities/${opp.id}`)}
                selectedOpportunityId={selectedOpportunity?.id}
              />
            ) : (
              <OpportunityKanban
                opportunities={filteredOpportunities}
                onOpportunitySelect={(opp) => navigate(`/dashboard/opportunities/${opp.id}`)}
                selectedOpportunityId={selectedOpportunity?.id}
                onOpportunityUpdate={loadOpportunities}
              />
            )}
          </div>
        </div>
      </div>

      {showNewOpportunityForm && (
        <NewOpportunityForm 
          onClose={() => setShowNewOpportunityForm(false)}
          onSuccess={loadOpportunities}
        />
      )}
    </main>
  );
}