import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { mockContacts } from '../../data/mockContacts';
import { Lead, LeadStage } from '../../types/lead';

interface EditLeadFormProps {
  lead: Lead;
  onClose: () => void;
}

export function EditLeadForm({ lead, onClose }: EditLeadFormProps) {
  const [formData, setFormData] = useState({
    title: lead.title,
    value: lead.value.toString(),
    stage: lead.stage,
    contactId: lead.contact.id,
    description: lead.description
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const stages: LeadStage[] = ['new', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

  return (
    <div className="w-96 border-l border-emerald-100 bg-white overflow-auto">
      <div className="sticky top-0 bg-white border-b border-emerald-100 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-emerald-900">Edit Lead</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-emerald-600" />
        </button>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Lead Title*
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter lead title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Value*
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5" />
              <input
                type="number"
                name="value"
                required
                value={formData.value}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter value"
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Stage*
            </label>
            <select
              name="stage"
              required
              value={formData.stage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Contact*
            </label>
            <select
              name="contactId"
              required
              value={formData.contactId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select contact</option>
              {mockContacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName} - {contact.company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Enter lead description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
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
      </div>
    </div>
  );
}