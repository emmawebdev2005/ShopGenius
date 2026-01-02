import React, { useState } from 'react';
import { Sparkles, Loader2, Save, X, BarChart, Package, Search } from 'lucide-react';
import { generateProductMetadata } from '../services/commerce';
import { Product } from '../types';

interface MerchantDashboardProps {
  onAddProduct: (product: Product) => void;
  onClose?: () => void;
  isPage?: boolean;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onAddProduct, onClose, isPage = false }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'analytics' | 'inventory'>('create');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState<Partial<Product> | null>(null);

  // Mock Analytics Data
  const analyticsData = [65, 40, 75, 50, 90, 120, 140];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await generateProductMetadata(input);
      setGeneratedProduct({
        ...result,
        imageUrl: `https://picsum.photos/seed/${input.replace(/\s/g, '')}/500/500`,
        stock: 50, // Default stock
        seoTitle: `${result.title} | ShopGenius`,
        seoDescription: result.description?.substring(0, 160)
      });
    } catch (e) {
      alert("Failed to generate product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (generatedProduct && generatedProduct.title) {
      setSaving(true);
      try {
        const newProduct: Product = {
            id: '', 
            title: generatedProduct.title!,
            description: generatedProduct.description || '',
            price: generatedProduct.price || 0,
            imageUrl: generatedProduct.imageUrl || 'https://picsum.photos/500',
            category: generatedProduct.category || 'General',
            tags: generatedProduct.tags || [],
            stock: generatedProduct.stock || 50,
            rating: 0,
            reviews: 0
        };
        await onAddProduct(newProduct);
        setGeneratedProduct(null);
        setInput('');
        alert("Product published successfully!");
      } catch (e) {
         console.error(e);
      } finally {
        setSaving(false);
      }
    }
  };

  const containerClass = isPage 
    ? "bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl mx-auto overflow-hidden flex flex-col min-h-[600px] border border-gray-200 dark:border-gray-700"
    : "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";

  const contentClass = isPage
    ? "flex flex-col h-full"
    : "bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Header with Tabs */}
        <div className="border-b border-gray-100 dark:border-gray-700 bg-shopify-light dark:bg-gray-900">
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Merchant Hub</h2>
            </div>
            {!isPage && onClose && (
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            )}
          </div>
          <div className="flex px-6 gap-6">
              <button onClick={() => setActiveTab('create')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'create' ? 'border-shopify-green text-shopify-green' : 'border-transparent text-gray-500'}`}>Create Product</button>
              <button onClick={() => setActiveTab('analytics')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-shopify-green text-shopify-green' : 'border-transparent text-gray-500'}`}>AI Analytics</button>
              <button onClick={() => setActiveTab('inventory')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-shopify-green text-shopify-green' : 'border-transparent text-gray-500'}`}>Smart Inventory</button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 dark:text-gray-200">
          
          {activeTab === 'analytics' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Total Sales</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">$12,450</p>
                          <p className="text-xs text-green-600">+15% this week</p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Visitors</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">8,200</p>
                          <p className="text-xs text-blue-600">Live now: 42</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Conversion Rate</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</p>
                          <p className="text-xs text-purple-600">Top 5% of stores</p>
                      </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold flex items-center gap-2"><BarChart size={16}/> Sales Performance</h3>
                          <select className="bg-white dark:bg-gray-800 border-none text-sm rounded"><option>Last 7 Days</option></select>
                      </div>
                      <div className="h-40 flex items-end gap-2">
                          {analyticsData.map((h, i) => (
                              <div key={i} className="flex-1 bg-shopify-green/80 hover:bg-shopify-green rounded-t transition-all" style={{height: `${h}%`}}></div>
                          ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'inventory' && (
              <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Inventory tracking module active.</p>
                  <p className="text-sm text-gray-400">Showing 6 products across 4 warehouses.</p>
              </div>
          )}

          {activeTab === 'create' && (
            <>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What do you want to sell?
                </label>
                <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., A vintage leather camera bag"
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-shopify-green focus:ring-shopify-green sm:text-sm border p-3 dark:text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || saving || !input}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5 mr-2" />}
                    {loading ? 'Thinking...' : 'Generate'}
                </button>
                </div>
            </div>

            {generatedProduct && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                    <img src={generatedProduct.imageUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-sm bg-gray-200" />
                    </div>
                    <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Title</label>
                        <input 
                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-shopify-green outline-none py-1 text-lg font-semibold text-gray-900 dark:text-white"
                            value={generatedProduct.title}
                            onChange={(e) => setGeneratedProduct({...generatedProduct, title: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 uppercase">Price</label>
                            <input 
                                type="number"
                                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-shopify-green outline-none py-1 text-base text-gray-900 dark:text-white"
                                value={generatedProduct.price}
                                onChange={(e) => setGeneratedProduct({...generatedProduct, price: parseFloat(e.target.value)})}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 uppercase">Stock</label>
                            <input 
                                type="number"
                                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-shopify-green outline-none py-1 text-base text-gray-900 dark:text-white"
                                value={generatedProduct.stock}
                                onChange={(e) => setGeneratedProduct({...generatedProduct, stock: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase">Description</label>
                        <textarea 
                            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2 focus:border-shopify-green outline-none text-sm text-gray-600 dark:text-gray-300 mt-1"
                            rows={3}
                            value={generatedProduct.description}
                            onChange={(e) => setGeneratedProduct({...generatedProduct, description: e.target.value})}
                        />
                    </div>
                    
                    {/* SEO SECTION */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-600">
                        <h4 className="flex items-center gap-1 text-sm font-bold mb-2"><Search size={14}/> SEO Preview</h4>
                        <div className="space-y-2">
                             <div>
                                <label className="block text-[10px] font-medium text-gray-400 uppercase">Meta Title</label>
                                <input 
                                    className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 text-xs text-blue-600"
                                    value={generatedProduct.seoTitle}
                                    onChange={(e) => setGeneratedProduct({...generatedProduct, seoTitle: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-gray-400 uppercase">Meta Description</label>
                                <textarea 
                                    className="w-full bg-transparent border-none text-xs text-gray-500 dark:text-gray-400 resize-none"
                                    rows={2}
                                    value={generatedProduct.seoDescription}
                                    onChange={(e) => setGeneratedProduct({...generatedProduct, seoDescription: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {generatedProduct.tags?.map((t, i) => (
                                <span key={i} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300">{t}</span>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          {activeTab === 'create' && (
             <button
                onClick={handleSave}
                disabled={!generatedProduct || saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-shopify-green hover:bg-shopify-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save className="h-4 w-4 mr-2" />}
                {saving ? 'Publish Product' : 'Add to Store'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};