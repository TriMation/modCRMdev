import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Product } from '../types/product';
import { mockProducts } from '../data/mockProducts';
import { ProductList } from '../components/products/ProductList';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductDetail } from '../components/products/ProductDetail';
import { NewProductForm } from '../components/products/NewProductForm';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchField } from '../components/common/SearchField';

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    type?: string;
    status?: string;
  }>({});

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (prev[filterType as keyof typeof prev] === value) {
        delete newFilters[filterType as keyof typeof prev];
      } else {
        newFilters[filterType as keyof typeof prev] = value;
      }
      return newFilters;
    });
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !selectedFilters.type || product.type === selectedFilters.type;
    const matchesStatus = !selectedFilters.status || product.status === selectedFilters.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  const breadcrumbItems = [
    { label: 'Products' }
  ];

  const activeFilterCount = Object.keys(selectedFilters).length;

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Products</h1>
          <button 
            onClick={() => setShowNewProductForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Product</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-gray-700 dark:text-emerald-400 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-emerald-600 text-white dark:bg-emerald-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search products..."
          />
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <ProductFilters
              products={mockProducts}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          )}

          <div className="flex-1">
            <ProductList
              products={filteredProducts}
              onProductSelect={setSelectedProduct}
              selectedProductId={selectedProduct?.id}
            />
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showNewProductForm && (
        <NewProductForm onClose={() => setShowNewProductForm(false)} />
      )}
    </main>
  );
}