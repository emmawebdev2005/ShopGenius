import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { CartItem, Currency } from '../types';
import { CURRENCY_RATES } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  currency: Currency;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  currency,
  onCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const total = (subtotal - discountAmount) * CURRENCY_RATES[currency];
  const symbol = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' }[currency];

  const handleApplyPromo = () => {
      if (promoCode.toLowerCase() === 'genius20') {
          setDiscount(0.2);
          alert("20% Discount Applied!");
      } else {
          alert("Invalid code");
          setDiscount(0);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md animate-slide-up">
          <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
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
                    <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                      {cartItems.map((product) => (
                        <li key={product.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <h3>{product.title}</h3>
                                <p className="ml-4">{symbol}{(product.price * product.quantity * CURRENCY_RATES[currency]).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center border dark:border-gray-700 rounded">
                                  <button 
                                    onClick={() => onUpdateQuantity(product.id, -1)}
                                    className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    disabled={product.quantity <= 1}
                                  >-</button>
                                  <span className="px-2 py-1 text-gray-900 dark:text-white">{product.quantity}</span>
                                  <button 
                                    onClick={() => onUpdateQuantity(product.id, 1)}
                                    className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

            <div className="border-t border-gray-200 dark:border-gray-800 py-6 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
               {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                      <input 
                        type="text" 
                        placeholder="Discount code (try: genius20)" 
                        className="w-full pl-10 pr-3 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                  </div>
                  <button onClick={handleApplyPromo} className="px-3 bg-gray-200 dark:bg-gray-700 text-sm rounded font-medium">Apply</button>
              </div>

              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <p>Subtotal</p>
                <p>{symbol}{(subtotal * CURRENCY_RATES[currency]).toFixed(2)}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 mt-2">
                    <p>Discount</p>
                    <p>-{symbol}{(discountAmount * CURRENCY_RATES[currency]).toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                <p>Total</p>
                <p>{symbol}{total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping calculated at next step.</p>
              <div className="mt-6">
                <button
                  onClick={onCheckout}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-shopify-green hover:bg-shopify-dark transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};