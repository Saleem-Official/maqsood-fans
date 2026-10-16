export const products = [
  {
    id: 'royal-plus', name: 'Royal Plus', sku: 'MF-1001', price: 8400, oldPrice: 12000, discount: '30% OFF', rating: 4.9, reviews: 24,
    image: '/assets/royal-plus.jpg', category: 'Premium', color: 'Ivory', blades: '3 blade', size: '48 inch', stockStatus: 'in_stock', description: 'A graceful ivory finish with a quiet, high-performance motor made for relaxed living rooms.'
  },
  {
    id: 'classic-pro', name: 'Classic Pro', sku: 'MF-1002', price: 8800, oldPrice: 11000, discount: '20% OFF', rating: 4.8, reviews: 18,
    image: '/assets/classic-detail.jpg', category: 'Premium', color: 'Black / Gold', blades: '3 blade', size: '48 inch', stockStatus: 'in_stock', description: 'A bold black-and-gold statement piece with powerful airflow and an elegant modern profile.'
  },
  {
    id: 'elite-series', name: 'Elite Series', sku: 'MF-1003', price: 10500, oldPrice: 14000, discount: '25% OFF', rating: 4.9, reviews: 32,
    image: '/assets/elite-series.jpg', category: 'Designer', color: 'Pearl White', blades: '3 blade', size: '52 inch', stockStatus: 'in_stock', description: 'Clean, contemporary and energy efficient — the everyday luxury pick for bright spaces.'
  },
  {
    id: 'wooden-touch', name: 'Wooden Touch', sku: 'MF-1004', price: 10400, oldPrice: 13000, discount: '20% OFF', rating: 4.7, reviews: 17,
    image: '/assets/wooden-touch.jpg', category: 'Natural', color: 'Walnut', blades: '3 blade', size: '48 inch', stockStatus: 'in_stock', description: 'Warm wood tones and smooth air movement bring a softer, more natural rhythm home.'
  },
  {
    id: 'modern-gold', name: 'Modern Gold', sku: 'MF-1005', price: 11900, oldPrice: 14900, discount: '20% OFF', rating: 4.8, reviews: 12,
    image: '/assets/modern-gold.jpg', category: 'Designer', color: 'Champagne Gold', blades: '3 blade', size: '52 inch', stockStatus: 'in_stock', description: 'A sculptural gold accent for interiors that love a little more personality overhead.'
  },
  {
    id: 'sleek-white', name: 'Sleek White', sku: 'MF-1006', price: 9900, oldPrice: 11900, discount: '15% OFF', rating: 4.6, reviews: 9,
    image: '/assets/sleek-white.jpg', category: 'Everyday', color: 'Snow White', blades: '3 blade', size: '48 inch', stockStatus: 'in_stock', description: 'Minimal from every angle, with whisper-quiet performance for bedrooms and studies.'
  },
  {
    id: 'aura-living-52', name: 'Aura Living 52', sku: 'MF-DEMO-201', price: 12800, oldPrice: 15900, discount: '20% OFF', rating: 4.8, reviews: 27,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80', image2: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', image3: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80', image4: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80', category: 'Premium', color: 'Champagne Gold', blades: '3 blade', size: '52 inch', stockStatus: 'in_stock', description: 'A refined statement fan for open-plan living rooms, pairing a quiet copper motor with a warm champagne finish and wide, comfortable airflow.'
  },
  {
    id: 'nordic-breeze-48', name: 'Nordic Breeze 48', sku: 'MF-DEMO-202', price: 9600, oldPrice: 11800, discount: '15% OFF', rating: 4.6, reviews: 14,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', image2: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80', image3: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', image4: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80', category: 'Designer', color: 'Snow White', blades: '4 blade', size: '48 inch', stockStatus: 'in_stock', description: 'A bright, minimal ceiling fan designed for bedrooms and studies, with a soft white profile and smooth low-noise circulation.'
  },
  {
    id: 'heritage-air-56', name: 'Heritage Air 56', sku: 'MF-DEMO-203', price: 14500, oldPrice: 17900, discount: '30% OFF', rating: 4.9, reviews: 39,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80', image2: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80', image3: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80', image4: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', category: 'Natural', color: 'Walnut', blades: '5 blade', size: '56 inch', stockStatus: 'out_of_stock', description: 'A broad, architectural fan for larger rooms, built around a warm wood-inspired look and powerful air movement.'
  }
];

export const categories = [
  { name: 'Premium Collection', count: '04 models', image: '/assets/classic-detail.jpg', tone: 'dark' },
  { name: 'Natural Wood', count: '03 models', image: '/assets/wooden-touch.jpg', tone: 'warm' },
  { name: 'Everyday Comfort', count: '06 models', image: '/assets/royal-plus.jpg', tone: 'light' }
];

export const formatPrice = (number) => `Rs. ${number.toLocaleString('en-IN')}`;
export const findProduct = (id) => products.find((product) => product.id === id) || products[0];


export const reviewsByProduct = {
  'royal-plus': [
    { name: 'Sana Malik', date: '2 weeks ago', rating: 5, text: 'The airflow is strong but quiet, and the ivory finish looks beautiful in our lounge.' },
    { name: 'Hamza R.', date: '1 month ago', rating: 5, text: 'Delivery was smooth and the fan feels much more premium than I expected at this price.' },
    { name: 'Nimra A.', date: '2 months ago', rating: 4, text: 'Lovely design and easy to use remote. It cools our bedroom quickly.' }
  ],
  'classic-pro': [
    { name: 'Ayesha Khan', date: '2 weeks ago', rating: 5, text: 'The black and gold finish is exactly what our living room needed. Powerful airflow too.' },
    { name: 'Bilal Ahmed', date: '1 month ago', rating: 5, text: 'Looks elegant, runs quietly and was packed very well for delivery.' },
    { name: 'Farah S.', date: '3 months ago', rating: 4, text: 'A stylish fan with great performance. The remote makes the six speeds easy to manage.' }
  ],
  'elite-series': [
    { name: 'Maryam T.', date: '3 weeks ago', rating: 5, text: 'Clean white look and excellent airflow. It brightened up our dining space.' },
    { name: 'Usman K.', date: '2 months ago', rating: 5, text: 'Very quiet motor and noticeably lower power use than our old fan.' },
    { name: 'Hira N.', date: '4 months ago', rating: 4, text: 'Beautiful finish and professional installation support.' }
  ],
  'wooden-touch': [
    { name: 'Zainab R.', date: '1 week ago', rating: 5, text: 'The walnut blades add warmth to the room and the air movement is lovely.' },
    { name: 'Omar F.', date: '2 months ago', rating: 5, text: 'Solid build quality with a smooth, quiet motor.' },
    { name: 'Iqra M.', date: '5 months ago', rating: 4, text: 'Exactly as shown and a great fit for our neutral interior.' }
  ],
  'modern-gold': [
    { name: 'Maha S.', date: '3 weeks ago', rating: 5, text: 'A gorgeous statement fan. Guests keep asking where we bought it.' },
    { name: 'Rashid A.', date: '2 months ago', rating: 5, text: 'Strong performance and the gold details feel very refined.' },
    { name: 'Nadia H.', date: '6 months ago', rating: 4, text: 'Modern, quiet and easy to operate.' }
  ],
  'sleek-white': [
    { name: 'Anum B.', date: '1 month ago', rating: 5, text: 'Minimal and practical. Perfect for our study.' },
    { name: 'Danish M.', date: '3 months ago', rating: 4, text: 'Quiet enough for night use and the white finish stays understated.' },
    { name: 'Saira J.', date: '6 months ago', rating: 4, text: 'Good value and quick delivery.' }
  ],
  'aura-living-52': [
    { name: 'Sana Malik', date: '1 week ago', rating: 5, text: 'The wide airflow feels premium and the gold finish looks beautiful in our lounge.' },
    { name: 'Hamza R.', date: '3 weeks ago', rating: 5, text: 'Quiet motor and a very polished look.' }
  ],
  'nordic-breeze-48': [
    { name: 'Mariam A.', date: '2 weeks ago', rating: 5, text: 'Clean white design and comfortable airflow for our bedroom.' },
    { name: 'Usman K.', date: '1 month ago', rating: 4, text: 'Simple, quiet and easy to live with.' }
  ],
  'heritage-air-56': [
    { name: 'Omar F.', date: '2 months ago', rating: 5, text: 'The larger size works perfectly in our open living room.' },
    { name: 'Nadia H.', date: '4 months ago', rating: 5, text: 'Beautiful wood-inspired styling and strong airflow.' }
  ]
};
