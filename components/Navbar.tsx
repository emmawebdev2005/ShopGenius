import React, { useState } from 'react';
import { ShoppingBag, Home, Store, BookOpen, DollarSign, User as UserIcon, Mic, Search, Moon, Sun, Globe } from 'lucide-react';
import { Page, User, Currency, Theme } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  cartCount: number;
  onOpenCart: () => void;
  user: User | null;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  theme: Theme;
  toggleTheme: () => void;
  onSearch: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  cartCount, 
  onOpenCart,
  user,
  currency,
  setCurrency,
  theme,
  toggleTheme,
  onSearch
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'about', label: 'Stories', icon: BookOpen },
    { id: 'sell', label: 'Sell', icon: DollarSign },
    { id: 'account', label: user ? 'Profile' : 'Login', icon: UserIcon },
  ];

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search not supported in this browser.");
      return;
    }
    setVoiceListening(true);
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
      setVoiceListening(false);
      onNavigate('shop');
    };
    recognition.onerror = () => setVoiceListening(false);
    recognition.start();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-shopify-green rounded p-1">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-shopify-dark dark:text-white hidden sm:block">ShopGenius</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'text-shopify-green' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-shopify-dark dark:hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5">
               <button onClick={handleVoiceSearch} className={`p-1 rounded-full ${voiceListening ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-300'}`}>
                 <Mic size={16} />
               </button>
               <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none focus:ring-0 text-sm w-24 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                  onKeyDown={(e) => {
                      if(e.key === 'Enter') {
                          onSearch(e.currentTarget.value);
                          onNavigate('shop');
                      }
                  }}
               />
            </div>

            {/* Currency */}
            <button 
                onClick={() => {
                    const curs: Currency[] = ['USD', 'EUR', 'GBP', 'JPY'];
                    const idx = curs.indexOf(currency);
                    setCurrency(curs[(idx + 1) % curs.length]);
                }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-shopify-green font-bold text-xs w-8"
            >
                {currency}
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-shopify-green">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Cart Icon */}
            <button 
                onClick={onOpenCart}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-shopify-green relative"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 px-4 py-2 flex justify-between">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full py-1 ${
                currentPage === item.id 
                  ? 'text-shopify-green' 
                  : 'text-gray-400 dark:text-gray-500'
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