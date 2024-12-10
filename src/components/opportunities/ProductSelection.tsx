import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Product } from '../../types/product';
import { OpportunityProduct } from '../../types/opportunity';
import { mockProducts } from '../../data/mockProducts';

interface ProductSelectionProps {
  selectedProducts: OpportunityProduct[];
  onProductsChange: (products: OpportunityProduct[]) => void;
}

export function ProductSelection({ selectedProducts, onProductsChange }: ProductSelectionProps) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<{
    productId: string;
    quantity: number;
  }>({
    productId: '',
    quantity: 1
  });

  const handleAddProduct = () => {
    const product = mockProducts.find(p => p.id === newProduct.productId);
    if (product) {
      const newProductEntry: OpportunityProduct = {
        product,
        quantity: newProduct.quantity,
        price: product.price
      };
      onProductsChange([...selectedProducts, newProductEntry]);
      setNewProduct({ productId: '', quantity: 1 });
      setShowAddProduct(false);
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    onProductsChange(updatedProducts);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-emerald-900 dark:text-emerald-100">Products</h4>
        <button
          type="button"
          onClick={() => setShowAddProduct(true)}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {showAddProduct && (
        <div className="bg-emerald-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                Product
              </label>
              <select
                value={newProduct.productId}
                onChange={(e) => setNewProduct(prev => ({ ...prev, productId: e.target.value }))}
                className="w-full px-3 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Select product</option>
                {mockProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (${product.price})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                min="1"
                className="w-full px-3 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddProduct(false)}
              className="px-3 py-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={!newProduct.productId}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          {selectedProducts.map((item, index) => (
            <div
              key={`${item.product.id}-${index}`}
              className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">{item.product.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                  {item.quantity} × ${item.price} = ${item.quantity * item.price}
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end text-emerald-900 dark:text-emerald-100 font-medium">
            Total: ${calculateTotal()}
          </div>
        </div>
      )}
    </div>
  );
}