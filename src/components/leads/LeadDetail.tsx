import React, { useState } from 'react';
import { X, DollarSign, User, Calendar, Building2, MessageSquare, Pencil } from 'lucide-react';
import { Lead } from '../../types/lead';
import { EditLeadForm } from './EditLeadForm';
import { ConvertToOpportunityModal } from './ConvertToOpportunityModal';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onConvertToOpportunity: (lead: Lead) => void;
}

export function LeadDetail({ lead, onClose, onConvertToOpportunity }: LeadDetailProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

  const getStageColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
      case 'orange':
        return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900';
      case 'green':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      case 'red':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  if (showEditForm) {
    return <EditLeadForm lead={lead} onClose={() => setShowEditForm(false)} />;
  }

  return (
    <div className="w-96 border-l border-emerald-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Lead Details</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">{lead.title}</h3>
          {lead.stage && (
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(lead.stage.color)}`}>
                {lead.stage.name}
              </span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                {lead.probability}% probability
              </span>
            </div>
          )}
          {lead.description && (
            <p className="text-emerald-600 dark:text-emerald-400 mt-2">{lead.description}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5 mr-2" />
            <span>Value: ${lead.value.toLocaleString()} {lead.currency}</span>
          </div>
          {lead.accounts && (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-5 h-5 mr-2" />
              <span>Account: {lead.accounts.name}</span>
            </div>
          )}
          {lead.contacts && (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <User className="w-5 h-5 mr-2" />
              <span>Contact: {lead.contacts.first_name} {lead.contacts.last_name}</span>
            </div>
          )}
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Created: {new Date(lead.created_at).toLocaleDateString()}</span>
          </div>
          {lead.expected_close_date && (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Expected Close: {new Date(lead.expected_close_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {!lead.converted_opportunity_id && (
          <div className="pt-4">
            <button
              onClick={() => setShowConvertModal(true)}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Convert to Opportunity
            </button>
          </div>
        )}

        {lead.lost_reason && (
          <div className="border-t border-emerald-100 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2">Lost Reason</h4>
            <p className="text-emerald-600 dark:text-emerald-400">{lead.lost_reason}</p>
          </div>
        )}
      </div>
      
      {showConvertModal && (
        <ConvertToOpportunityModal
          lead={lead}
          onClose={() => setShowConvertModal(false)}
          onConvert={onConvertToOpportunity}
        />
      )}
    </div>
  );
}