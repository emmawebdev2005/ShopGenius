import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative flex flex-col gap-2 animate-fade-in">
      <div className="aspect-[1/1] w-full overflow-hidden rounded-lg bg-gray-200 shadow-sm transition-shadow hover:shadow-md">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
        />
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-3 right-3 p-3 rounded-full bg-white shadow-lg text-shopify-text hover:bg-shopify-green hover:text-white transition-colors transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-200"
          title="Add to Cart"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex justify-between items-start mt-2">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
          {product.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
              </span>
          ))}
      </div>
    </div>
  );
};