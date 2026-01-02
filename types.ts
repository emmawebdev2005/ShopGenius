export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
  stock: number;
  rating: number;
  reviews: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  wishlist: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
}

export type ViewMode = 'storefront' | 'merchant';
export type Page = 'home' | 'shop' | 'about' | 'sell' | 'account' | 'orders';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';
export type Theme = 'light' | 'dark';
