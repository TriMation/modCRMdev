import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { mockContacts } from '../data/mockContacts';
import { getActiveAccounts } from '../utils/accountUtils';

const initialFormState = {
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  company: '',
  dateOfBirth: '',
  linkedIn: '',
  tags: [] as string[],
  status: 'active'
};

export function EditContactPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const contact = mockContacts.find(c => c.id === id);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (contact) {
      setFormData({
        title: contact.title || '',
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        role: contact.role || '',
        company: contact.company || '',
        dateOfBirth: contact.dateOfBirth || '',
        linkedIn: contact.linkedIn || '',
        tags: contact.tags || [],
        status: contact.status || 'active'
      });
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    navigate(`/dashboard/contacts/${id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!contact) {
    return (
      <div className="flex-1 p-6">
        <p className="text-emerald-600">Contact not found</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Contacts', path: '/dashboard/contacts' },
    { label: `${contact.firstName} ${contact.lastName}`, path: `/dashboard/contacts/${id}` },
    { label: 'Edit' }
  ];

  const titles = [
    'Mr',
    'Mrs',
    'Ms',
    'Miss',
    'Dr',
    'Prof'
  ];

  const roles = [
    'CEO',
    'CTO',
    'CFO',
    'Director',
    'Manager',
    'Developer',
    'Sales Representative',
    'Marketing Manager',
    'Other'
  ];

  const accounts = getActiveAccounts();

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-emerald-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-full">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-semibold text-emerald-900">Edit Contact</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-2">
                      Title
                    </label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select title</option>
                      {titles.map(title => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-emerald-900 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    Company*
                  </label>
                  <select
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select company</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.name}>{account.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-emerald-900 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/contacts/${id}`)}
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
      </div>
    </div>
  );
}