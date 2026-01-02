import React from 'react';
import { Product, Currency } from '../types';
import { Plus, Heart, Eye, Star, AlertTriangle } from 'lucide-react';
import { CURRENCY_RATES } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  currency,
  isWishlisted,
  onToggleWishlist 
}) => {
  const displayPrice = (product.price * CURRENCY_RATES[currency]).toFixed(2);
  const currencySymbol = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' }[currency];
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col gap-2 animate-fade-in bg-white dark:bg-gray-800 rounded-lg p-2 transition-colors">
      <div className="aspect-[1/1] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 shadow-sm transition-shadow hover:shadow-md relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className={`h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity duration-300 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        
        {/* Flash Sale Badge (Simulated random logic for demo) */}
        {product.price > 100 && product.stock > 0 && (
             <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                 FLASH SALE
             </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                className={`p-2 rounded-full shadow-lg transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
            >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button className="p-2 rounded-full bg-white text-gray-400 hover:text-shopify-green shadow-lg">
                <Eye size={16} />
            </button>
        </div>

        {!isOutOfStock && (
            <button
            onClick={() => onAddToCart(product)}
            className="absolute bottom-3 right-3 p-3 rounded-full bg-white shadow-lg text-shopify-text hover:bg-shopify-green hover:text-white transition-colors transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-200"
            title="Add to Cart"
            >
            <Plus size={20} />
            </button>
        )}

        {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <span className="bg-gray-900 text-white px-3 py-1 text-sm font-bold rounded">SOLD OUT</span>
            </div>
        )}
      </div>

      <div className="flex justify-between items-start mt-2">
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
             <Star size={12} className="text-yellow-400 fill-yellow-400" />
             <span className="text-xs text-gray-500 dark:text-gray-400">{product.rating} ({product.reviews})</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{currencySymbol}{displayPrice}</p>
            {isLowStock && (
                <p className="text-[10px] text-orange-600 flex items-center justify-end gap-1 mt-1 font-medium">
                    <AlertTriangle size={10} /> Low Stock
                </p>
            )}
        </div>
      </div>
      
      <div className="flex gap-1 flex-wrap mt-1">
          {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  {tag}
              </span>
          ))}
      </div>
    </div>
  );
};