import { Product, User } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const STORAGE_KEYS = {
  PRODUCTS: 'shopgenius_products',
  USERS: 'shopgenius_users',
  SESSION: 'shopgenius_session'
};

const DELAY = 600; // Simulated network delay in ms

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * Initialize the "Database" with default data if empty
   */
  init: async () => {
    // Check if products exist, if not seed them
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!storedProducts) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    // Ensure users array exists
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
  },

  /**
   * Get all products from the "database"
   */
  getProducts: async (): Promise<Product[]> => {
    await delay(DELAY);
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Add a new product to the "database"
   */
  addProduct: async (product: Product): Promise<Product> => {
    await delay(DELAY);
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const products: Product[] = stored ? JSON.parse(stored) : [];
    
    const newProduct = { ...product, id: Date.now().toString() };
    products.unshift(newProduct); // Add to beginning
    
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  /**
   * Authenticate a user
   */
  login: async (email: string, password: string): Promise<User> => {
    await delay(DELAY);
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const sessionUser: User = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    return sessionUser;
  },

  /**
   * Register a new user
   */
  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(DELAY);
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password // In a real app, never store passwords as plain text!
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    return sessionUser;
  },

  /**
   * Get the currently logged in user (from session storage)
   */
  getSession: async (): Promise<User | null> => {
    // No delay needed for session check typically, but kept for consistency
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Logout the user
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};