import React from 'react';
import { DollarSign, User, Building2, Calendar } from 'lucide-react';
import { Opportunity } from '../../types/opportunity';

interface OpportunityWithRelations extends Opportunity {
  opportunity_stages: {
    name: string;
  };
  accounts: {
    name: string;
  };
  contacts?: {
    first_name: string;
    last_name: string;
  };
}

interface OpportunityListProps {
  opportunities: OpportunityWithRelations[];
  onOpportunitySelect: (opportunity: OpportunityWithRelations) => void;
  selectedOpportunityId?: string;
}

export function OpportunityList({ opportunities, onOpportunitySelect, selectedOpportunityId }: OpportunityListProps) {
  const getStageColor = (stageName: string) => {
    switch (stageName.toLowerCase()) {
      case 'prospecting':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900';
      case 'qualification':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
      case 'negotiation':
        return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900';
      case 'closed_won':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      case 'closed_lost':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) {
      return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
    } else if (probability >= 30) {
      return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
    }
    return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
  };

  return (
    <div className="space-y-4">
      {opportunities.map((opportunity) => (
        <div
          key={opportunity.id}
          onClick={() => onOpportunitySelect(opportunity)}
          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer transition-all ${
            selectedOpportunityId === opportunity.id
              ? 'ring-2 ring-emerald-500'
              : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium text-emerald-900 dark:text-emerald-100">{opportunity.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.opportunity_stages.name)}`}>
                  {opportunity.opportunity_stages.name}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(opportunity.probability)}`}>
                  {opportunity.probability}% probability
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="font-semibold">Est: ${opportunity.value.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4 line-clamp-2">{opportunity.description}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-4 h-4 mr-1" />
                <span>{opportunity.accounts?.name || 'No Account'}</span>
              </div>
              {opportunity.contacts && (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <User className="w-4 h-4 mr-1" />
                  <span>{opportunity.contacts.first_name} {opportunity.contacts.last_name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Close: {new Date(opportunity.close_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
      {opportunities.length === 0 && (
        <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
          No opportunities found.
        </div>
      )}
    </div>
  );
}