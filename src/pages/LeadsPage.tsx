import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Lead } from '../types/lead';
import { getLeads, convertToOpportunity, getLeadStages } from '../services/leadService';
import { LeadList } from '../components/leads/LeadList';
import { LeadKanban } from '../components/leads/LeadKanban';
import { LeadViewToggle } from '../components/leads/LeadViewToggle';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadDetail } from '../components/leads/LeadDetail';
import { NewLeadForm } from '../components/leads/NewLeadForm';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchField } from '../components/common/SearchField';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LeadsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<{ id: string; name: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    stage?: string;
    value?: string;
    hideConverted: boolean;
  }>({
    hideConverted: true
  });

  const loadLeads = async () => {
    try {
      if (!user) return;
      const [leadsData, stagesData] = await Promise.all([
        getLeads(),
        getLeadStages()
      ]);
      setLeads(leadsData);
      setStages(stagesData);
    } catch (err) {
      setError('Failed to load leads');
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [user]);

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (filterType === 'hideConverted') {
        newFilters.hideConverted = value as boolean;
      } else if (prev[filterType as keyof typeof prev] === value) {
        delete newFilters[filterType as keyof typeof prev];
      } else {
        newFilters[filterType as keyof typeof prev] = value;
      }
      return newFilters;
    });
  };

  const handleLeadCreated = async () => {
    await loadLeads();
  };

  const handleConvertToOpportunity = async (lead: Lead) => {
    try {
      await convertToOpportunity(lead.id);
      // Refresh leads list
      await loadLeads();
      setSelectedLead(null);
      // Show success message or redirect to opportunity
    } catch (err) {
      console.error('Error converting lead:', err);
      // Show error message
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.contacts?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.contacts?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Filter out converted leads if hideConverted is true
    if (selectedFilters.hideConverted && lead.stage?.name === 'Converted') {
      return false;
    }

    const matchesStage = !selectedFilters.stage || lead.stage_id === selectedFilters.stage;
    const matchesValue = !selectedFilters.value || (
      selectedFilters.value === 'high' ? lead.value >= 50000 :
      selectedFilters.value === 'medium' ? (lead.value >= 10000 && lead.value < 50000) :
      lead.value < 10000
    );

    return matchesSearch && matchesStage && matchesValue;
  });

  const breadcrumbItems = [
    { label: 'Leads' }
  ];

  const activeFilterCount = Object.keys(selectedFilters).length;

  if (loading) {
    return <div className="flex-1 p-6">
      <div className="animate-pulse">Loading leads...</div>
    </div>;
  }

  if (error) {
    return <div className="flex-1 p-6">
      <div className="text-red-600">{error}</div>
    </div>;
  }

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Leads</h1>
          <div className="flex items-center space-x-4">
            <LeadViewToggle view={view} onViewChange={setView} />
            <button 
              onClick={() => setShowNewLeadForm(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Lead</span>
            </button>
          </div>
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
            placeholder="Search leads..."
          />
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <LeadFilters
              leads={leads}
              stages={stages}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          )}

          <div className="flex-1">
            {view === 'list' ? (
              <LeadList
                leads={filteredLeads}
                onLeadSelect={setSelectedLead}
                selectedLeadId={selectedLead?.id}
              />
            ) : (
              <LeadKanban
                leads={filteredLeads}
                stages={stages}
                onLeadSelect={setSelectedLead}
                selectedLeadId={selectedLead?.id}
                onLeadUpdate={loadLeads}
              />
            )}
          </div>
        </div>
      </div>

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onConvertToOpportunity={handleConvertToOpportunity}
        />
      )}

      {showNewLeadForm && (
        <NewLeadForm 
          onClose={() => setShowNewLeadForm(false)} 
          onSuccess={handleLeadCreated}
        />
      )}
    </main>
  );
}