import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { OpportunityKanban } from '../opportunities/OpportunityKanban';
import { DEFAULT_VALUES } from '../../utils/demoData';

interface AccountOpportunitiesProps {
  accountId: string;
}

export function AccountOpportunities({ accountId }: AccountOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch opportunities for this account
    setLoading(false);
  }, [accountId]);

  if (loading) {
    return <div className="animate-pulse">Loading opportunities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Opportunities</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          <span>New Opportunity</span>
        </button>
      </div>

      <OpportunityKanban 
        opportunities={opportunities}
        onOpportunitySelect={() => {}}
      />
    </div>
  );
}