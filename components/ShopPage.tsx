import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, X, Image as ImageIcon } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ products, onAddToCart, initialSearch = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Visual Search Simulation
      if (e.target.files && e.target.files[0]) {
          alert("Analyzing image... (Visual Search Simulation)");
          setTimeout(() => {
             setSearchQuery("Ceramics"); // Mock result
          }, 1000);
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Catalog</h2>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium dark:text-white"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`
          fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 transform transition-transform duration-300 overflow-y-auto
          md:relative md:transform-none md:translate-x-0 md:w-64 md:block md:bg-transparent md:p-0 md:z-0
          ${showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="flex justify-between items-center md:hidden mb-6">
            <h3 className="text-lg font-bold dark:text-white">Filters</h3>
            <button onClick={() => setShowMobileFilters(false)} className="dark:text-white"><X size={24} /></button>
          </div>

          <div className="space-y-8">
            {/* Search */}
            <div>
              <label className="text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider mb-2 block">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-shopify-green focus:border-shopify-green"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                
                {/* Visual Search Trigger */}
                <label className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-shopify-green">
                    <ImageIcon size={16} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider mb-3 block">Category</label>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-sm ${selectedCategory === cat ? 'text-shopify-green font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider mb-3 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-shopify-green"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shop All</h1>
                <p className="text-gray-500 dark:text-gray-400">Showing {filteredProducts.length} results</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={onAddToCart} 
                        currency="USD" // Default currency for simple view, passed down via context in real app
                        isWishlisted={false}
                        onToggleWishlist={() => {}}
                    />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};