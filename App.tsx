import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { MerchantDashboard } from './components/MerchantDashboard';
import { AIChat } from './components/AIChat';
import { Navbar } from './components/Navbar';
import { ShopPage } from './components/ShopPage';
import { AuthPage } from './components/AuthPage';
import { AboutPage } from './components/AboutPage';
import { Product, CartItem, Page, User, Currency, Theme } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [theme, setTheme] = useState<Theme>('light');
  const [globalSearch, setGlobalSearch] = useState('');

  // Apply theme to body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize App Data
  useEffect(() => {
    const initApp = async () => {
      try {
        await api.init();
        
        const [fetchedProducts, sessionUser] = await Promise.all([
          api.getProducts(),
          api.getSession()
        ]);

        setProducts(fetchedProducts);
        if (sessionUser) setUser(sessionUser);
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map(item => {
        if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
    }));
  };

  const handleAddProduct = async (product: Product) => {
      try {
        const newProduct = await api.addProduct(product);
        setProducts(prev => [newProduct, ...prev]);
        setCurrentPage('shop');
      } catch (error) {
        console.error("Failed to save product:", error);
        alert("Failed to save product to server.");
      }
  };

  const handleToggleWishlist = async (productId: string) => {
      if (!user) {
          alert("Please login to use Wishlist");
          return;
      }
      const newWishlist = await api.toggleWishlist(user.id, productId);
      setUser({ ...user, wishlist: newWishlist });
  };

  const handleLogin = (newUser: User) => {
      setUser(newUser);
      setCurrentPage('home');
  };

  const handleLogout = async () => {
      await api.logout();
      setUser(null);
      setCurrentPage('home');
  }

  const handleCheckout = async () => {
      if (!user) {
          alert("Please login to checkout");
          return;
      }
      const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await api.createOrder(user.id, cart, total);
      setCart([]);
      setIsCartOpen(false);
      alert("Order placed successfully! Check your email for details.");
  }

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Router Logic
  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shopify-green"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Collection</h2>
                    <button onClick={() => setCurrentPage('shop')} className="text-shopify-green font-medium hover:underline">View All &rarr;</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6">
                    {products.slice(0, 4).map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={addToCart}
                        currency={currency}
                        isWishlisted={user?.wishlist.includes(product.id) || false}
                        onToggleWishlist={handleToggleWishlist}
                    />
                    ))}
                </div>
                
                {/* Newsletter Signup (Feature 15) */}
                <div className="mt-20 bg-shopify-dark rounded-2xl p-10 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Join our Inner Circle</h2>
                        <p className="text-green-100 mb-6 max-w-xl mx-auto">Get exclusive access to flash sales, new drops, and expert curation.</p>
                        <div className="flex max-w-md mx-auto gap-2">
                            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-green-400 text-gray-900" />
                            <button className="bg-shopify-green text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors">Subscribe</button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
                </div>
            </main>
          </>
        );
      case 'shop':
        return (
            <ShopPage 
                products={products} 
                onAddToCart={addToCart} 
                initialSearch={globalSearch}
            />
        );
      case 'about':
        return <AboutPage />;
      case 'sell':
        if (!user) return <AuthPage onLogin={(u) => { handleLogin(u); setCurrentPage('sell'); }} />;
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <MerchantDashboard onAddProduct={handleAddProduct} isPage={true} />
            </div>
        );
      case 'account':
        if (!user) return <AuthPage onLogin={handleLogin} />;
        return (
            <div className="max-w-3xl mx-auto py-12 px-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 text-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 pb-8 md:pb-0 md:pr-8">
                        <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-6 text-3xl font-bold text-purple-600">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 bg-gray-50 dark:bg-gray-700 py-2 rounded-lg">{user.email}</p>
                        
                        <div className="space-y-3">
                            <button 
                                className="w-full py-2.5 bg-shopify-green text-white rounded-lg hover:bg-shopify-dark transition-colors font-medium shadow-sm"
                                onClick={() => setCurrentPage('sell')}
                            >
                                Merchant Dashboard
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="w-full py-2.5 border border-red-200 dark:border-red-900 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                    
                    {/* Order History (Feature 10) */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Orders</h3>
                        <div className="space-y-4">
                             {/* Simulated Order List - In real app, fetch from API */}
                             <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-mono text-sm text-gray-500">ORD-7728392</span>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-bold">DELIVERED</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">3 items • $245.00</p>
                                <div className="flex gap-2">
                                    {products.slice(0,3).map(p => (
                                        <div key={p.id} className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        cartCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        currency={currency}
        setCurrency={setCurrency}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onSearch={setGlobalSearch}
      />

      <div className="flex-1">
        {renderPage()}
      </div>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2024 ShopGenius, Inc. All rights reserved.
          </p>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        currency={currency}
        onCheckout={handleCheckout}
      />

      <AIChat products={products} />
    </div>
  );
};

export default App;