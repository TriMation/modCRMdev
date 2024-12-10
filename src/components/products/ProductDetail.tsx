import React, { useState } from 'react';
import { X, Package, DollarSign, Calendar, Building2, Pencil } from 'lucide-react';
import { Product } from '../../types/product';
import { EditProductForm } from './EditProductForm';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  const getTypeColor = (type: Product['type']) => {
    switch (type) {
      case 'product':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900';
      case 'service':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      case 'expense':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
    }
  };

  if (showEditForm) {
    return <EditProductForm product={product} onClose={() => setShowEditForm(false)} />;
  }

  return (
    <div className="w-96 border-l border-emerald-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Product Details</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">{product.name}</h3>
          <p className="text-emerald-600 dark:text-emerald-400">{product.description}</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(product.type)}`}>
            {product.type}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {product.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Package className="w-5 h-5 mr-2" />
            <span>SKU: {product.sku || 'N/A'}</span>
          </div>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5 mr-2" />
            <span>Price: ${product.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Last Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {product.accounts && product.accounts.length > 0 && (
          <div className="border-t border-emerald-100 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-3">Associated Accounts</h4>
            <div className="space-y-2">
              {product.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center space-x-2 p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg"
                >
                  <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-900 dark:text-emerald-100">{account.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}