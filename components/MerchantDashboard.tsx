import React, { useState } from 'react';
import { Sparkles, Loader2, Save, X } from 'lucide-react';
import { generateProductMetadata } from '../services/commerce';
import { Product } from '../types';

interface MerchantDashboardProps {
  onAddProduct: (product: Product) => void;
  onClose?: () => void;
  isPage?: boolean;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onAddProduct, onClose, isPage = false }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState<Partial<Product> | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await generateProductMetadata(input);
      setGeneratedProduct({
        ...result,
        imageUrl: `https://picsum.photos/seed/${input.replace(/\s/g, '')}/500/500` // Deterministic image based on input
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
            id: '', // ID will be assigned by backend
            title: generatedProduct.title!,
            description: generatedProduct.description || '',
            price: generatedProduct.price || 0,
            imageUrl: generatedProduct.imageUrl || 'https://picsum.photos/500',
            category: generatedProduct.category || 'General',
            tags: generatedProduct.tags || [],
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
    ? "bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto overflow-hidden flex flex-col min-h-[600px] border border-gray-200"
    : "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";

  const contentClass = isPage
    ? "flex flex-col h-full"
    : "bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-shopify-light">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">AI Merchant Assistant</h2>
          </div>
          {!isPage && onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to sell?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., A vintage leather camera bag"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-shopify-green focus:ring-shopify-green sm:text-sm border p-3"
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
            <p className="mt-2 text-xs text-gray-500">
              The assistant will generate a title, description, price, and tags automatically.
            </p>
          </div>

          {generatedProduct && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img src={generatedProduct.imageUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-sm bg-gray-200" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">Title</label>
                    <input 
                        className="w-full bg-transparent border-b border-gray-300 focus:border-shopify-green outline-none py-1 text-lg font-semibold text-gray-900"
                        value={generatedProduct.title}
                        onChange={(e) => setGeneratedProduct({...generatedProduct, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">Price</label>
                     <input 
                        type="number"
                        className="w-full bg-transparent border-b border-gray-300 focus:border-shopify-green outline-none py-1 text-base text-gray-900"
                        value={generatedProduct.price}
                        onChange={(e) => setGeneratedProduct({...generatedProduct, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">Description</label>
                    <textarea 
                        className="w-full bg-transparent border border-gray-300 rounded p-2 focus:border-shopify-green outline-none text-sm text-gray-600 mt-1"
                        rows={3}
                        value={generatedProduct.description}
                        onChange={(e) => setGeneratedProduct({...generatedProduct, description: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {generatedProduct.tags?.map((t, i) => (
                            <span key={i} className="bg-white border border-gray-300 px-2 py-1 rounded text-xs text-gray-600">{t}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          {!isPage && onClose && (
            <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!generatedProduct || saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-shopify-green hover:bg-shopify-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save className="h-4 w-4 mr-2" />}
            {saving ? 'Saving...' : 'Add to Store'}
          </button>
        </div>
      </div>
    </div>
  );
};