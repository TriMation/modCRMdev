import React, { useState, useEffect } from 'react';
import { Calendar, Hash, FileText, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { createBid, updateBid } from '../../../services/bidService'; // Fixed import
import { useAuth } from '../../../contexts/AuthContext';

interface AccountOption {
  id: string;
  name: string;
}

interface BidProcessingProps {
  bid: Bid;
  onUpdate: () => Promise<void>;
}

export function BidProcessing({ bid, onUpdate }: BidProcessingProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [formData, setFormData] = useState({
    account_id: bid.account_id || '',
    bid_number: bid.bid_number || '',
    release_date: bid.release_date || '',
    submission_date: bid.submission_date || '',
    award_date: bid.award_date || '',
    word_count: bid.word_count?.toString() || '',
    bid_no_bid_date: bid.bid_no_bid_date || '',
    bid_no_bid_decision: bid.bid_no_bid_decision,
    bid_no_bid_rationale: bid.bid_no_bid_rationale || '',
    bid_website: bid.bid_website || '',
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
        setError('Failed to load accounts');
      }
    }
    loadAccounts();
  }, []);

  // Update form data when bid changes
  useEffect(() => {
    setFormData({
      account_id: bid.account_id || '',
      bid_number: bid.bid_number || '',
      release_date: bid.release_date || '',
      submission_date: bid.submission_date || '',
      award_date: bid.award_date || '',
      word_count: bid.word_count?.toString() || '',
      bid_no_bid_date: bid.bid_no_bid_date || '',
      bid_no_bid_decision: bid.bid_no_bid_decision,
      bid_no_bid_rationale: bid.bid_no_bid_rationale || '',
      bid_website: bid.bid_website || '',
    });
  }, [bid]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError('');
      setSuccess(false);
      setLoading(true);

      await updateBid(bid.id, {
        ...formData,
        word_count: formData.word_count ? parseInt(formData.word_count) : null,
        owner_id: user.id
      });

      setSuccess(true);
      
      await onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save bid');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
          Bid saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Selection */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 mb-2">Account*</label>
          <select
            name="account_id"
            required
            value={formData.account_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          <label className="block text-sm font-medium text-emerald-900 mb-2">Bid Number</label>
          <input
            type="text"
            name="bid_number"
            value={formData.bid_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter bid number"
          />
        </div>

        {/* Submission Date */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 mb-2">Submission Date</label>
          <input
            type="datetime-local"
            name="submission_date"
            value={formData.submission_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Bid Website */}
        <div>
          <label className="block text-sm font-medium text-emerald-900 mb-2">Bid Website</label>
          <input
            type="url"
            name="bid_website"
            value={formData.bid_website}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}