import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Lead } from '../../types/lead';

interface ConvertToOpportunityModalProps {
  lead: Lead;
  onClose: () => void;
  onConvert: (lead: Lead) => void;
}

export function ConvertToOpportunityModal({ lead, onClose, onConvert }: ConvertToOpportunityModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConvert(lead);
      onClose();
    } catch (error) {
      console.error('Error converting lead:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Convert Lead to Opportunity</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-medium text-emerald-900 dark:text-emerald-100">Lead Details</h4>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{lead.title}</p>
          </div>

          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5 mr-2" />
            <span>Value: ${lead.value.toLocaleString()} {lead.currency}</span>
          </div>

          {lead.accounts && (
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              Account: {lead.accounts.name}
            </div>
          )}

          {lead.contacts && (
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              Contact: {lead.contacts.first_name} {lead.contacts.last_name}
            </div>
          )}
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-6">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            This will create a new opportunity and mark this lead as converted. This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert to Opportunity'}
          </button>
        </div>
      </div>
    </div>
  );
}