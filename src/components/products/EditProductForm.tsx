import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { Product } from '../../types/product';
import { mockAccounts } from '../../data/mockData';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

export function EditProductForm({ product, onClose }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    type: product.type,
    description: product.description,
    price: product.price.toString(),
    sku: product.sku || '',
    status: product.status,
    accountIds: product.accounts?.map(a => a.id) || []
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

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      accountIds: selectedOptions
    }));
  };

  return (
    <div className="w-96 border-l border-emerald-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
            <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Edit Product</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </button>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Product Name*
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Type*
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Price*
            </label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Status*
            </label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Associated Accounts
            </label>
            <select
              multiple
              name="accountIds"
              value={formData.accountIds}
              onChange={handleAccountChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              size={4}
            >
              {mockAccounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
              Hold Ctrl/Cmd to select multiple accounts
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
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
  );
}