import React, { useState } from 'react';
import { FileText, DollarSign, Target } from 'lucide-react';

export function BidOverview() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: '',
    currency: 'USD',
    win_probability: '',
    key_requirements: '',
    evaluation_criteria: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Bid Title*
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter bid title"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Bid Value*
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
              placeholder="Enter bid value"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Win Probability (%)*
          </label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <input
              type="number"
              name="win_probability"
              required
              min="0"
              max="100"
              value={formData.win_probability}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter win probability"
            />
          </div>
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
            placeholder="Enter bid description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Key Requirements
          </label>
          <textarea
            name="key_requirements"
            value={formData.key_requirements}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter key requirements"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
            Evaluation Criteria
          </label>
          <textarea
            name="evaluation_criteria"
            value={formData.evaluation_criteria}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter evaluation criteria"
          />
        </div>
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