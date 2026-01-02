import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, X } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Extract min/max price for slider
  const maxProductPrice = useMemo(() => Math.max(...products.map(p => p.price), 100), [products]);

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Catalog</h2>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`
          fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 overflow-y-auto
          md:relative md:transform-none md:translate-x-0 md:w-64 md:block md:bg-transparent md:p-0 md:z-0
          ${showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="flex justify-between items-center md:hidden mb-6">
            <h3 className="text-lg font-bold">Filters</h3>
            <button onClick={() => setShowMobileFilters(false)}><X size={24} /></button>
          </div>

          <div className="space-y-8">
            {/* Search */}
            <div>
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 block">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-shopify-green focus:border-shopify-green"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">Category</label>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-sm ${selectedCategory === cat ? 'text-shopify-green font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-shopify-green"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>$0</span>
                <span>${maxProductPrice.toFixed(0)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setPriceRange([0, maxProductPrice]);
                setSearchQuery('');
              }}
              className="w-full py-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All</h1>
                <p className="text-gray-500">Showing {filteredProducts.length} results</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};