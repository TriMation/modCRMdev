import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { mockAccounts } from '../data/mockData';
import { LogoUpload } from '../components/accounts/LogoUpload';

export function EditAccountPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const account = mockAccounts.find(a => a.id === id);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    abn: '',
    phone: '',
    accountType: '',
    annualRevenue: '',
    employeeCount: '',
    logo: '',
    status: 'active',
    address: {
      line1: '',
      line2: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia'
    }
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        industry: account.industry,
        website: account.website,
        abn: account.abn || '',
        phone: account.phone || '',
        accountType: account.accountType,
        annualRevenue: account.annualRevenue || '',
        employeeCount: account.employeeCount || '',
        logo: account.logo || '',
        status: account.status,
        address: {
          line1: account.address?.line1 || '',
          line2: account.address?.line2 || '',
          suburb: account.address?.suburb || '',
          state: account.address?.state || '',
          postcode: account.address?.postcode || '',
          country: account.address?.country || 'Australia'
        }
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    navigate(`/dashboard/accounts/${id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!account) {
    return (
      <div className="flex-1 p-6">
        <p className="text-emerald-600">Account not found</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Accounts', path: '/dashboard/accounts' },
    { label: account.name, path: `/dashboard/accounts/${id}` },
    { label: 'Edit' }
  ];

  const states = [
    'ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'
  ];

  const annualRevenueOptions = [
    'Under $1M',
    '$1M - $5M',
    '$5M - $10M',
    '$10M - $50M',
    '$50M - $100M',
    'Over $100M'
  ];

  const employeeCountOptions = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-emerald-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Edit Account</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <LogoUpload
                currentLogo={formData.logo}
                onLogoChange={(logo) => setFormData(prev => ({ ...prev, logo }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Account Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter account name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    ABN*
                  </label>
                  <input
                    type="text"
                    name="abn"
                    required
                    value={formData.abn}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="XX XXX XXX XXX"
                    pattern="\d{2} \d{3} \d{3} \d{3}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Account Type*
                  </label>
                  <select
                    name="accountType"
                    required
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Select account type</option>
                    <option value="partner">Partner</option>
                    <option value="customer">Customer</option>
                    <option value="competitor">Competitor</option>
                    <option value="supplier">Supplier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Annual Revenue
                  </label>
                  <select
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Select annual revenue</option>
                    {annualRevenueOptions.map(revenue => (
                      <option key={revenue} value={revenue}>{revenue}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Number of Employees
                  </label>
                  <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Select employee count</option>
                    {employeeCountOptions.map(count => (
                      <option key={count} value={count}>{count}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-emerald-100 dark:border-gray-700 pt-6">
                <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Address Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="address.line1"
                      value={formData.address.line1}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address.line2"
                      value={formData.address.line2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Apartment, suite, unit, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Suburb
                    </label>
                    <input
                      type="text"
                      name="address.suburb"
                      value={formData.address.suburb}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter suburb"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      State
                    </label>
                    <select
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      name="address.postcode"
                      value={formData.address.postcode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter postcode"
                      pattern="[0-9]{4}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100 bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/accounts/${id}`)}
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
          </div>
        </div>
      </div>
    </div>
  );
}