import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Minimalist Ceramics Vase',
    description: 'Handcrafted ceramic vase with a matte finish. Perfect for dried flowers or standing alone as a piece of art.',
    price: 45.00,
    imageUrl: 'https://picsum.photos/seed/vase/500/500',
    category: 'Home Decor',
    tags: ['Ceramics', 'Minimalist', 'Home']
  },
  {
    id: '2',
    title: 'Leather Weekender Bag',
    description: 'Durable, full-grain leather travel bag with brass hardware. Spacious enough for a 3-day trip.',
    price: 185.00,
    imageUrl: 'https://picsum.photos/seed/leatherbag/500/500',
    category: 'Accessories',
    tags: ['Travel', 'Leather', 'Bag']
  },
  {
    id: '3',
    title: 'Organic Cotton Tee',
    description: 'Soft, breathable organic cotton t-shirt in earthy tones. Sustainable fashion staple.',
    price: 28.00,
    imageUrl: 'https://picsum.photos/seed/tshirt/500/500',
    category: 'Apparel',
    tags: ['Sustainable', 'Cotton', 'Clothing']
  },
  {
    id: '4',
    title: 'Artisan Coffee Blend',
    description: 'Rich, dark roast coffee beans sourced from small farms in Colombia. Notes of chocolate and cherry.',
    price: 18.50,
    imageUrl: 'https://picsum.photos/seed/coffee/500/500',
    category: 'Food & Drink',
    tags: ['Coffee', 'Artisan', 'Breakfast']
  },
   {
    id: '5',
    title: 'Noise-Cancelling Headphones',
    description: 'Immerse yourself in music with these high-fidelity wireless headphones. 20-hour battery life.',
    price: 249.99,
    imageUrl: 'https://picsum.photos/seed/headphones/500/500',
    category: 'Electronics',
    tags: ['Tech', 'Music', 'Wireless']
  },
  {
    id: '6',
    title: 'Succulent Trio',
    description: 'A set of three low-maintenance succulents in geometric concrete pots.',
    price: 32.00,
    imageUrl: 'https://picsum.photos/seed/succulents/500/500',
    category: 'Plants',
    tags: ['Plants', 'Decor', 'Green']
  }
];
