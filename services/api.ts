import { Product, User, Order, Review } from '../types';
import { INITIAL_PRODUCTS, SYSTEM_CONFIG } from '../constants';

const { STORAGE_KEYS, TIMEOUTS } = SYSTEM_CONFIG;

// Mock Transport Layer
const transport = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * Initialize Data Persistence Layer
   */
  init: async () => {
    // Seed initial dataset if storage is clean
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    }
  },

  /**
   * Retrieve Product Catalog
   */
  getProducts: async (): Promise<Product[]> => {
    await transport(TIMEOUTS.API_LATENCY);
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Create New Inventory Item
   */
  addProduct: async (product: Product): Promise<Product> => {
    await transport(TIMEOUTS.API_LATENCY);
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const products: Product[] = stored ? JSON.parse(stored) : [];
    
    const newProduct = { ...product, id: Date.now().toString() };
    products.unshift(newProduct);
    
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  /**
   * User Authentication
   */
  login: async (email: string, password: string): Promise<User> => {
    await transport(TIMEOUTS.API_LATENCY);
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Refresh user object from storage to get latest wishlist
    const sessionUser: User = { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        wishlist: user.wishlist || [] 
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    return sessionUser;
  },

  /**
   * User Registration
   */
  register: async (name: string, email: string, password: string): Promise<User> => {
    await transport(TIMEOUTS.API_LATENCY);
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.find(u => u.email === email)) {
      throw new Error('Account already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      wishlist: []
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email, wishlist: [] };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    return sessionUser;
  },

  getSession: async (): Promise<User | null> => {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    return stored ? JSON.parse(stored) : null;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  /**
   * Order Management
   */
  createOrder: async (userId: string, items: any[], total: number): Promise<Order> => {
    await transport(TIMEOUTS.API_LATENCY);
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
    
    const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items,
        total,
        status: 'processing'
    };
    
    orders.unshift(newOrder); // Newest first
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Update Stock
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let products: Product[] = storedProducts ? JSON.parse(storedProducts) : [];
    products = products.map(p => {
        const item = items.find((i: any) => i.id === p.id);
        if (item) {
            return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return newOrder;
  },

  getOrders: async (userId: string): Promise<Order[]> => {
    await transport(TIMEOUTS.API_LATENCY);
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    // In a real app we filter by userId, but for demo we just show all if no ID check
    return storedOrders ? JSON.parse(storedOrders) : [];
  },

  /**
   * Wishlist & Reviews
   */
  toggleWishlist: async (userId: string, productId: string): Promise<string[]> => {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return [];

    let wishlist = users[userIndex].wishlist || [];
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter((id: string) => id !== productId);
    } else {
        wishlist.push(productId);
    }

    users[userIndex].wishlist = wishlist;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Update session
    const session = await api.getSession();
    if (session) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ ...session, wishlist }));
    }

    return wishlist;
  }
};