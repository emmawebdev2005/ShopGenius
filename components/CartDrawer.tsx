import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md animate-slide-up"> {/* Using slide-up for simplicity, ideally slide-left */}
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" /> Shopping Cart
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button onClick={onClose} className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Your cart is empty.</p>
                    <button onClick={onClose} className="mt-4 text-shopify-green font-medium hover:text-shopify-dark">
                        Continue Shopping &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((product) => (
                        <li key={product.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{product.title}</h3>
                                <p className="ml-4">${(product.price * product.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center border rounded">
                                  <button 
                                    onClick={() => onUpdateQuantity(product.id, -1)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    disabled={product.quantity <= 1}
                                  >-</button>
                                  <span className="px-2 py-1 text-gray-900">{product.quantity}</span>
                                  <button 
                                    onClick={() => onUpdateQuantity(product.id, 1)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  >+</button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(product.id)}
                                className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <a
                  href="#"
                  className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-shopify-green hover:bg-shopify-dark transition-colors"
                >
                  Checkout
                </a>
              </div>
              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{' '}
                  <button
                    type="button"
                    className="text-shopify-green font-medium hover:text-shopify-dark"
                    onClick={onClose}
                  >
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};