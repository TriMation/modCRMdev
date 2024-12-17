import React, { useState, useEffect } from 'react';
import { Calendar, Hash, FileText, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../../config/supabase';

interface AccountOption {
  id: string;
  name: string;
}

export function BidProcessing() {
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [formData, setFormData] = useState({
    account_id: '',
    bid_number: '',
    release_date: '',
    submission_date: '', // Includes both date and time
    award_date: '',
    word_count: '',
    bid_no_bid_date: '',
    bid_no_bid_decision: null as boolean | null,
    bid_no_bid_rationale: '',
    bid_website: '',
  });

  // Fetch accounts from Supabase
  useEffect(() => {
    async function loadAccounts() {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setAccounts(data || []);
      } catch (err) {
        console.error('Error loading accounts:', err);
      }
    }
    loadAccounts();
  }, []);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'datetime-local'
          ? value.replace('T', ' ')
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      // Add submission logic here, e.g., save to Supabase
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Selection */}
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
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bid Number */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Bid Number
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="text"
              name="bid_number"
              value={formData.bid_number}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter bid number"
            />
          </div>
        </div>

        {/* Word Count Limit */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Word Count Limit
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="number"
              name="word_count"
              value={formData.word_count}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter word count limit"
            />
          </div>
        </div>

        {/* Release Date */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Release Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Submission Date */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Submission Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="datetime-local"
              name="submission_date"
              value={formData.submission_date}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Bid Website */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Bid Website
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="url"
              name="bid_website"
              value={formData.bid_website}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Bid/No-Bid Decision */}
      <div>
        <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
          Bid/No-Bid Decision
        </label>
        <div className="flex items-center space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="bid_no_bid_decision"
              checked={formData.bid_no_bid_decision === true}
              onChange={() => setFormData(prev => ({ ...prev, bid_no_bid_decision: true }))}
              className="form-radio h-4 w-4 text-emerald-600 border-emerald-300 focus:ring-emerald-500"
            />
            <span className="ml-2 text-emerald-900 dark:text-emerald-100">Bid</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="bid_no_bid_decision"
              checked={formData.bid_no_bid_decision === false}
              onChange={() => setFormData(prev => ({ ...prev, bid_no_bid_decision: false }))}
              className="form-radio h-4 w-4 text-emerald-600 border-emerald-300 focus:ring-emerald-500"
            />
            <span className="ml-2 text-emerald-900 dark:text-emerald-100">No-Bid</span>
          </label>
        </div>
      </div>

      {/* Bid/No-Bid Date */}
      <div>
        <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
          Bid/No-Bid Decision Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
          <input
            type="date"
            name="bid_no_bid_date"
            value={formData.bid_no_bid_date}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Bid/No-Bid Rationale */}
      <div>
        <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
          Bid/No-Bid Decision Rationale
        </label>
        <textarea
          name="bid_no_bid_rationale"
          value={formData.bid_no_bid_rationale}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder={`Enter rationale for ${formData.bid_no_bid_decision === true ? 'bid' : formData.bid_no_bid_decision === false ? 'no-bid' : 'bid/no-bid'} decision`}
        />
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
