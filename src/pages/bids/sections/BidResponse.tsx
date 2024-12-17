import React, { useState } from 'react';
import { FileText, CheckSquare, AlertCircle } from 'lucide-react';

export function BidResponse() {
  const [formData, setFormData] = useState({
    executive_summary: '',
    technical_response: '',
    compliance_matrix: '',
    quality_plan: '',
    implementation_plan: '',
    assumptions: ''
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
          <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Executive Summary
          </h3>
        </div>
        <textarea
          name="executive_summary"
          value={formData.executive_summary}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter executive summary"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Technical Response
          </h3>
        </div>
        <textarea
          name="technical_response"
          value={formData.technical_response}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter technical response"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Compliance Matrix
          </h3>
        </div>
        <textarea
          name="compliance_matrix"
          value={formData.compliance_matrix}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter compliance matrix"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Quality Plan
          </h3>
        </div>
        <textarea
          name="quality_plan"
          value={formData.quality_plan}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter quality plan"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Implementation Plan
          </h3>
        </div>
        <textarea
          name="implementation_plan"
          value={formData.implementation_plan}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter implementation plan"
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Assumptions and Dependencies
          </h3>
        </div>
        <textarea
          name="assumptions"
          value={formData.assumptions}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter assumptions and dependencies"
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