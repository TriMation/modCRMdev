import React, { useState } from 'react';
import { Calendar, DollarSign, FileText } from 'lucide-react';

export function BidProcessing() {
  const [formData, setFormData] = useState({
    bid_number: '',
    release_date: '',
    submission_date: '',
    award_date: '',
    word_count: '',
    bid_no_bid_date: '',
    bid_no_bid_decision: false,
    bid_no_bid_rationale: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Word Count Limit
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
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

        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Submission Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="date"
              name="submission_date"
              value={formData.submission_date}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Award Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="date"
              name="award_date"
              value={formData.award_date}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

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
      </div>

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
          placeholder="Enter rationale for bid/no-bid decision"
        />
      </div>

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
    </div>
  );
}