import React from 'react';
import { DollarSign, User, Calendar } from 'lucide-react';
import { Lead } from '../../types/lead';

interface LeadListProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  selectedLeadId?: string;
}

export function LeadList({ leads, onLeadSelect, selectedLeadId }: LeadListProps) {
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'new':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900';
      case 'contacting':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
      case 'qualifying':
        return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900';
      case 'converted':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      case 'lost':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
        No leads found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div
          key={lead.id}
          onClick={() => onLeadSelect(lead)}
          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer transition-all ${
            selectedLeadId === lead.id
              ? 'ring-2 ring-emerald-500'
              : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-emerald-900 dark:text-emerald-100">{lead.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(lead.stage?.name || '')}`}>
              {lead.stage?.name}
            </span>
          </div>

          {lead.description && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4 line-clamp-2">{lead.description}</p>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>${lead.value.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                <User className="w-4 h-4 mr-1" />
                <span>{lead.contacts?.first_name} {lead.contacts?.last_name}</span>
              </div>
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(lead.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}