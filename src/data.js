export const seedProducts = [
  {
    id: 'lahore-model', name: 'Lahore Model', sku: 'MF-204', price: 10500, oldPrice: 12075, discount: '15% OFF', rating: 5, reviews: 0,
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    image3: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    image4: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    category: 'Premium', color: 'Ivory / Gold', blades: '3 blade', size: '48 inch', stockStatus: 'in_stock',
    description: 'Lahore Model by Maqsood Fans — a premium ceiling fan with elegant ivory and gold finish, pure copper motor, and powerful silent airflow for drawing rooms and lounges across Pakistan.'
  },
  {
    id: 'king-model', name: 'King-Model', sku: 'MF-202', price: 8400, oldPrice: 9660, discount: '15% OFF', rating: 5, reviews: 10,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
    image3: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    image4: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    category: 'Designer', color: 'Brown / White', blades: '3 blade', size: '48 inch', stockStatus: 'in_stock',
    description: 'King-Model by Maqsood Fans — a designer ceiling fan with bold brown and white contrast, copper motor, and wide airflow coverage for modern bedrooms and living rooms.'
  },
  {
    id: 'flat-king', name: 'Flat King', sku: 'MF-204', price: 8400, oldPrice: 9660, discount: '15% OFF', rating: 5, reviews: 8,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    image2: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    image3: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
    image4: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    category: 'Everyday', color: 'White / Gold', blades: '3 blade', size: '48 inch', stockStatus: 'in_stock',
    description: 'Flat King by Maqsood Fans — an everyday ceiling fan with clean white and gold finish, energy-efficient copper motor, and smooth quiet airflow for bedrooms and everyday spaces in Pakistan.'
  }
];

const CACHE_KEY = 'maqsood_catalog_cache';
function loadCachedProducts() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
  }
  return null;
}

const initialCached = loadCachedProducts();
export const products = initialCached !== null ? [...initialCached] : [];

export const categories = [
  { name: 'Premium Collection', count: '04 models', image: '/assets/classic-detail.jpg', tone: 'dark' },
  { name: 'Natural Wood', count: '03 models', image: '/assets/wooden-touch.jpg', tone: 'warm' },
  { name: 'Everyday Comfort', count: '06 models', image: '/assets/royal-plus.jpg', tone: 'light' }
];

export const formatPrice = (number) => `Rs. ${Number(number || 0).toLocaleString('en-IN')}`;
export const findProduct = (id) => products.find((product) => product.id === id) || null;


export const reviewsByProduct = {
  'lahore-model': [
    { name: 'Sana Malik', date: '2 weeks ago', rating: 5, text: 'The airflow is strong but quiet, and the ivory finish looks beautiful in our lounge.' },
    { name: 'Hamza R.', date: '1 month ago', rating: 5, text: 'Delivery was smooth and the fan feels much more premium than I expected at this price.' }
  ],
  'king-model': [
    { name: 'Ayesha Khan', date: '2 weeks ago', rating: 5, text: 'The brown and white finish is exactly what our living room needed. Powerful airflow too.' },
    { name: 'Bilal Ahmed', date: '1 month ago', rating: 5, text: 'Looks elegant, runs quietly and was packed very well for delivery.' },
    { name: 'Farah S.', date: '3 months ago', rating: 5, text: 'A stylish fan with great performance.' }
  ],
  'flat-king': [
    { name: 'Maryam T.', date: '3 weeks ago', rating: 5, text: 'Clean white look and excellent airflow. It brightened up our bedroom.' },
    { name: 'Usman K.', date: '2 months ago', rating: 5, text: 'Very quiet motor and noticeably lower power use than our old fan.' }
  ]
};
