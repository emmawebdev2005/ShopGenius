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
import { Product, CartItem, Page, User } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize App Data (Simulating Backend Connection)
  useEffect(() => {
    const initApp = async () => {
      try {
        await api.init();
        
        // Parallel fetching
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

  const handleLogin = (newUser: User) => {
      setUser(newUser);
      setCurrentPage('home');
  };

  const handleLogout = async () => {
      await api.logout();
      setUser(null);
      setCurrentPage('home');
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
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Collection</h2>
                    <button onClick={() => setCurrentPage('shop')} className="text-shopify-green font-medium hover:underline">View All &rarr;</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6">
                    {products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                </div>
            </main>
          </>
        );
      case 'shop':
        return <ShopPage products={products} onAddToCart={addToCart} />;
      case 'about':
        return <AboutPage />;
      case 'sell':
        if (!user) return <AuthPage onLogin={(u) => { handleLogin(u); setCurrentPage('sell'); }} />;
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
                    <p className="text-gray-500">Create new products using AI assistance</p>
                </div>
                <MerchantDashboard onAddProduct={handleAddProduct} isPage={true} />
            </div>
        );
      case 'account':
        if (!user) return <AuthPage onLogin={handleLogin} />;
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-6 text-3xl font-bold text-purple-600">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                    <p className="text-gray-500 mb-8 bg-gray-50 py-2 rounded-lg">{user.email}</p>
                    
                    <div className="space-y-3">
                        <button 
                            className="w-full py-2.5 bg-shopify-green text-white rounded-lg hover:bg-shopify-dark transition-colors font-medium shadow-sm"
                            onClick={() => setCurrentPage('sell')}
                        >
                            Go to Merchant Dashboard
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        cartCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {renderPage()}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
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
      />

      <AIChat products={products} />
    </div>
  );
};

export default App;