import { Product } from './types';

export const SYSTEM_CONFIG = {
  MODELS: {
    GENERATION: 'gemini-3-flash-preview',
    CHAT: 'gemini-3-flash-preview'
  },
  TIMEOUTS: {
    API_LATENCY: 400
  },
  STORAGE_KEYS: {
    PRODUCTS: 'shopgenius_products',
    USERS: 'shopgenius_users',
    SESSION: 'shopgenius_session',
    ORDERS: 'shopgenius_orders',
    REVIEWS: 'shopgenius_reviews'
  }
};

export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.5
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Minimalist Ceramics Vase',
    description: 'Handcrafted ceramic vase with a matte finish. Perfect for dried flowers or standing alone as a piece of art.',
    price: 45.00,
    imageUrl: 'https://picsum.photos/seed/vase/500/500',
    category: 'Home Decor',
    tags: ['Ceramics', 'Minimalist', 'Home'],
    stock: 12,
    rating: 4.5,
    reviews: 12
  },
  {
    id: '2',
    title: 'Leather Weekender Bag',
    description: 'Durable, full-grain leather travel bag with brass hardware. Spacious enough for a 3-day trip.',
    price: 185.00,
    imageUrl: 'https://picsum.photos/seed/leatherbag/500/500',
    category: 'Accessories',
    tags: ['Travel', 'Leather', 'Bag'],
    stock: 5,
    rating: 5.0,
    reviews: 8
  },
  {
    id: '3',
    title: 'Organic Cotton Tee',
    description: 'Soft, breathable organic cotton t-shirt in earthy tones. Sustainable fashion staple.',
    price: 28.00,
    imageUrl: 'https://picsum.photos/seed/tshirt/500/500',
    category: 'Apparel',
    tags: ['Sustainable', 'Cotton', 'Clothing'],
    stock: 150,
    rating: 4.2,
    reviews: 45
  },
  {
    id: '4',
    title: 'Artisan Coffee Blend',
    description: 'Rich, dark roast coffee beans sourced from small farms in Colombia. Notes of chocolate and cherry.',
    price: 18.50,
    imageUrl: 'https://picsum.photos/seed/coffee/500/500',
    category: 'Food & Drink',
    tags: ['Coffee', 'Artisan', 'Breakfast'],
    stock: 40,
    rating: 4.8,
    reviews: 120
  },
   {
    id: '5',
    title: 'Noise-Cancelling Headphones',
    description: 'Immerse yourself in music with these high-fidelity wireless headphones. 20-hour battery life.',
    price: 249.99,
    imageUrl: 'https://picsum.photos/seed/headphones/500/500',
    category: 'Electronics',
    tags: ['Tech', 'Music', 'Wireless'],
    stock: 0,
    rating: 4.7,
    reviews: 32
  },
  {
    id: '6',
    title: 'Succulent Trio',
    description: 'A set of three low-maintenance succulents in geometric concrete pots.',
    price: 32.00,
    imageUrl: 'https://picsum.photos/seed/succulents/500/500',
    category: 'Plants',
    tags: ['Plants', 'Decor', 'Green'],
    stock: 18,
    rating: 4.9,
    reviews: 6
  }
];