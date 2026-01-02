import React from 'react';
import { ShoppingBag, Home, Store, BookOpen, DollarSign, User as UserIcon } from 'lucide-react';
import { Page, User } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  cartCount: number;
  onOpenCart: () => void;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  cartCount, 
  onOpenCart,
  user
}) => {
  const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'about', label: 'Stories', icon: BookOpen },
    { id: 'sell', label: 'Sell', icon: DollarSign },
    { id: 'account', label: user ? 'Profile' : 'Login', icon: UserIcon },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-shopify-green rounded p-1">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-shopify-dark hidden sm:block">ShopGenius</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'text-shopify-green' 
                    : 'text-gray-500 hover:text-shopify-dark'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Cart Icon */}
          <div className="flex items-center">
            <button 
                onClick={onOpenCart}
                className="p-2 text-gray-500 hover:text-shopify-green relative"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-2 flex justify-between">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full py-1 ${
                currentPage === item.id 
                  ? 'text-shopify-green' 
                  : 'text-gray-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
      </div>
    </nav>
  );
};