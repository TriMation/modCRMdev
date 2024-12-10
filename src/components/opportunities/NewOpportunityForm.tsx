import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { createOpportunity, getOpportunityStages } from '../../services/opportunityService';
import { supabase } from '../../config/supabase';

interface NewOpportunityFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface AccountOption {
  id: string;
  name: string;
}

interface ContactOption {
  id: string;
  first_name: string;
  last_name: string;
}

interface StageOption {
  id: string;
  name: string;
}

export function NewOpportunityForm({ onClose, onSuccess }: NewOpportunityFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [stages, setStages] = useState<StageOption[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    currency: 'USD',
    stage_id: '',
    account_id: '',
    contact_id: '',
    probability: '50',
    close_date: '',
    description: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Load accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('id, name')
          .order('name');
        
        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // Load stages
        const stagesData = await getOpportunityStages();
        setStages(stagesData);
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load form data');
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadContacts() {
      if (!formData.account_id) {
        setContacts([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('id, first_name, last_name')
          .eq('account_id', formData.account_id)
          .order('first_name');
        
        if (error) throw error;
        setContacts(data || []);
      } catch (err) {
        console.error('Error loading contacts:', err);
      }
    }
    loadContacts();
  }, [formData.account_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      await createOpportunity({
        ...formData,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability) || 0
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create opportunity';
      setError(errorMessage);
      console.error('Error creating opportunity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">New Opportunity</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Opportunity Name*
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter opportunity name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Value*
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
                <input
                  type="number"
                  name="value"
                  required
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter value"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Stage*
              </label>
              <select
                name="stage_id"
                required
                value={formData.stage_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select stage</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Account*
              </label>
              <select
                name="account_id"
                required
                value={formData.account_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Contact
              </label>
              <select
                name="contact_id"
                value={formData.contact_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Probability (%)*
              </label>
              <input
                type="number"
                name="probability"
                required
                value={formData.probability}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Expected Close Date*
              </label>
              <input
                type="date"
                name="close_date"
                required
                value={formData.close_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter opportunity description"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}