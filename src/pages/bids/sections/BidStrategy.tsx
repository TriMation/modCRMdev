import React, { useState } from 'react';
import { Target, Shield, Zap, DollarSign } from 'lucide-react';

export function BidStrategy() {
  const [formData, setFormData] = useState({
    win_strategy: '',
    competitive_analysis: '',
    key_differentiators: '',
    risks_mitigations: '',
    pricing_strategy: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Win Strategy
          </h3>
        </div>
        <textarea
          name="win_strategy"
          value={formData.win_strategy}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter win strategy details"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Competitive Analysis
          </h3>
        </div>
        <textarea
          name="competitive_analysis"
          value={formData.competitive_analysis}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter competitive analysis"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Key Differentiators
          </h3>
        </div>
        <textarea
          name="key_differentiators"
          value={formData.key_differentiators}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter key differentiators"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Risks and Mitigations
          </h3>
        </div>
        <textarea
          name="risks_mitigations"
          value={formData.risks_mitigations}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter risks and mitigations"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Pricing Strategy
          </h3>
        </div>
        <textarea
          name="pricing_strategy"
          value={formData.pricing_strategy}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter pricing strategy"
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