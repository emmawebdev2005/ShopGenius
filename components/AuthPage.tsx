import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Mail, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user: User;
      
      if (isLogin) {
        user = await api.login(email, password);
      } else {
        if (!name) throw new Error("Name is required");
        user = await api.register(name, email, password);
      }
      
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
      setIsLogin(!isLogin);
      setError(null);
      // Keep email/pass for convenience, but clear name if switching to login
      if (!isLogin) setName(''); 
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl transition-all duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'New to ShopGenius? ' : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="font-medium text-shopify-green hover:text-shopify-dark transition-colors focus:outline-none underline"
            >
              {isLogin ? 'Sign up for free' : 'Sign in'}
            </button>
          </p>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                <AlertCircle size={16} />
                {error}
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div className="relative animate-slide-up">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required={!isLogin}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-shopify-green focus:border-shopify-green focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-shopify-green focus:border-shopify-green focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-shopify-green focus:border-shopify-green focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-shopify-green hover:bg-shopify-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shopify-green transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-green-100" />
              ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <ArrowRight className="h-5 w-5 text-green-300 group-hover:text-green-100" />
                    </span>
                    {isLogin ? 'Sign in' : 'Create Account'}
                  </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};