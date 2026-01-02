export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
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
}

export type ViewMode = 'storefront' | 'merchant';

export type Page = 'home' | 'shop' | 'about' | 'sell' | 'account';
