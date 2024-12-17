import React, { useState, useEffect } from 'react';
import { FileText, CheckSquare, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../config/supabase';

interface BidQuestion {
  id: string;
  question_number: number;
  question: string;
  response: string;
  compliant: boolean;
}

export function BidResponse() {
  const [formData, setFormData] = useState({
    executive_summary: '',
    technical_response: '',
    compliance_matrix: '',
    quality_plan: '',
    implementation_plan: '',
    assumptions: ''
  });
  const [questions, setQuestions] = useState<BidQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (id: string, field: keyof BidQuestion, value: any) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleAddQuestion = () => {
    const newQuestionNumber = questions.length > 0 
      ? Math.max(...questions.map(q => q.question_number)) + 1 
      : 1;

    const newQuestion: BidQuestion = {
      id: crypto.randomUUID(),
      question_number: newQuestionNumber,
      question: '',
      response: '',
      compliant: true
    };

    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Questions and Responses Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Questions and Responses
          </h3>
          <button
            onClick={handleAddQuestion}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-emerald-50 dark:bg-gray-700">
                <th className="px-4 py-2 text-left text-sm font-medium text-emerald-900 dark:text-emerald-100">#</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-emerald-900 dark:text-emerald-100">Question</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-emerald-900 dark:text-emerald-100">Response</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-emerald-900 dark:text-emerald-100">Comply</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-emerald-900 dark:text-emerald-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 dark:divide-gray-700">
              {questions.map((question) => (
                <tr key={question.id} className="hover:bg-emerald-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 text-emerald-900 dark:text-emerald-100">
                    {question.question_number}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                      className="w-full px-2 py-1 border border-emerald-100 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter question"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={question.response}
                      onChange={(e) => handleQuestionChange(question.id, 'response', e.target.value)}
                      className="w-full px-2 py-1 border border-emerald-100 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter response"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={question.compliant}
                      onChange={(e) => handleQuestionChange(question.id, 'compliant', e.target.checked)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {questions.length === 0 && (
            <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
              No questions added yet.
            </div>
          )}
        </div>
      </div>

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