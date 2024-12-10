import React from 'react';
import { Package, DollarSign, Tag } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  selectedProductId?: string;
}

export function ProductList({ products, onProductSelect, selectedProductId }: ProductListProps) {
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

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductSelect(product)}
          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer transition-all ${
            selectedProductId === product.id
              ? 'ring-2 ring-emerald-500'
              : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-900 dark:text-emerald-100">{product.name}</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{product.sku}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(product.type)}`}>
              {product.type}
            </span>
          </div>

          <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>${product.price.toLocaleString()}</span>
              </div>
              {product.accounts && product.accounts.length > 0 && (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{product.accounts.length} accounts</span>
                </div>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {product.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}