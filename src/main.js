import './styles.css';
import { categories, findProduct, formatPrice, products, reviewsByProduct } from './data.js';
import { adminPage, loadAdminPanel } from './admin.js';

const app = document.querySelector('#app');
const productOrder = products.map((product) => product.id);

const CART_STORAGE_KEY = 'maqsood_cart';

function loadSavedCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        const prod = findProduct(item.id || item.product?.id) || item.product;
        return prod ? { product: prod, qty: Math.max(1, Number(item.qty || 1)) } : null;
      }).filter(Boolean);
    }
  } catch (err) {
    console.warn('Could not read cart from localStorage:', err);
  }
  return [];
}

function saveCartToStorage() {
  try {
    const data = state.cart.map((item) => ({
      id: item.product.id,
      qty: item.qty,
      product: item.product
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save cart to localStorage:', err);
  }
}

const state = { cart: loadSavedCart(), menuOpen: false, toast: '', selectedCategory: 'All fans', sort: 'Featured', query: '' };
let catalogHydrated = false;
const DEMO_WHATSAPP_NUMBER = '923234464246';
const whatsappUrl = (message) => `https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
const genericWhatsAppMessage = 'Assalam-o-Alaikum Maqsood Fans, I would like to know more about your ceiling fans.';

function cartWhatsAppMessage() {
  const items = state.cart.length ? state.cart : [{ product: products[1], qty: 1 }];
  const lines = items.map(({ product, qty }) => `- ${product.name} (${product.sku}) x ${qty} — ${formatPrice(product.price * qty)}`).join('\n');
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  return `Assalam-o-Alaikum Maqsood Fans,\n\nI would like to order:\n${lines}\n\nEstimated total: ${formatPrice(total)}\n\nPlease confirm availability and delivery details.`;
}

function whatsappMessage(type) {
  if (type === 'cart') return cartWhatsAppMessage();
  if (type?.startsWith('product:')) {
    const product = findProduct(type.split(':')[1]);
    return `Assalam-o-Alaikum Maqsood Fans, I am interested in the ${product.name} (${product.sku}) ceiling fan priced at ${formatPrice(product.price)}. Please share availability and delivery details.`;
  }
  return genericWhatsAppMessage;
}

const icon = (name, size = 20) => {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    cart: '<path d="M3 4h2l2.5 11h9.8l2-8H6"/><circle cx="9" cy="19" r="1"/><circle cx="17" cy="19" r="1"/>',
    heart: '<path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    whatsapp: '<path d="M19.1 4.9A9.8 9.8 0 0 0 12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 0 0 22 12a9.8 9.8 0 0 0-2.9-7.1ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-6.1c-.2-.1-1.4-.7-1.6-.7s-.4-.1-.6.2-.6.7-.7.8-.3.1-.5 0a6.8 6.8 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.3.1-.5l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1 2.8c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.2-.2-.2-.4-.3Z"/>',
    spark: '<path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
    shield: '<path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z"/><path d="m8 12 2.5 2.5L16 9"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    phone: '<path d="M6.6 3.5 9 3l2 4-1.7 1.5a14 14 0 0 0 5.2 5.2L16 12l4 2-.5 2.4c-.3 1.5-1.7 2.6-3.2 2.4C9.6 18 4 12.4 3.2 5.7 3 4.2 5.1 3.8 6.6 3.5Z"/>',
  };
  if (name === 'whatsapp') return `<img class="icon whatsapp-icon" width="${size}" height="${size}" src="/assets/whatsapp.svg" alt="" aria-hidden="true" />`;
  return `<svg class="icon icon-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
};

const logo = () => `<a class="logo" href="/" data-link aria-label="Maqsood Fans home"><img class="brand-logo-image" src="/assets/maqsood-logo.jpeg" alt="Maqsood Fans" /></a>`;
const nav = () => `<nav class="desktop-nav" aria-label="Primary navigation"><a href="/" data-link>Home</a><a href="/products" data-link>All Fans</a><a href="/#guide" data-link>Size Guide</a><a href="/#faq" data-link>FAQs</a><a href="/#about" data-link>Why Us</a><a href="/#contact" data-link>Contact</a></nav>`;

function header() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  return `<div class="topline"><span>Free same-day delivery across Lahore</span><span class="topline-right">Need help? <b>We are available on WhatsApp</b></span></div>
  <header class="site-header"><div class="header-inner">${logo()}${nav()}<div class="header-actions"><button class="icon-button search-toggle" aria-label="Search">${icon('search')}</button><a href="/cart" data-link class="cart-button" aria-label="Open cart">${icon('cart')}<span class="cart-count">${count}</span></a><button class="whatsapp-mini" data-whatsapp="general">${icon('whatsapp', 15)}<span>Contact on WhatsApp</span></button><button class="menu-button" aria-label="Open menu">${icon('menu')}</button></div></div><div class="search-panel"><input type="search" id="site-search" placeholder="Search fans, finishes or models" value="${state.query}" /><button class="search-go" aria-label="Search">${icon('search')}</button></div>${state.menuOpen ? `<div class="mobile-nav">${nav().replace('desktop-nav','mobile-nav-links')}<button class="mobile-whatsapp" data-whatsapp="general">${icon('whatsapp', 16)} Contact on WhatsApp</button></div>` : ''}</header>`;
}

function sectionHeading(eyebrow, title, text = '', action = '') {
  return `<div class="section-heading"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</div>${action ? `<a class="text-link" href="${action.href}" data-link>${action.label} ${icon('arrow', 15)}</a>` : ''}</div>`;
}

function productCard(product, compact = false) {
  const soldOut = product.stockStatus === 'out_of_stock';
  return `<article class="product-card ${compact ? 'compact' : ''} ${soldOut ? 'is-sold-out' : ''}"><div class="product-visual"><img src="${product.image}" alt="${product.name} Ceiling Fan — Maqsood Fans Pakistan" loading="lazy" /><span class="discount-badge">${product.discount}</span>${soldOut ? '<span class="stock-badge sold-out">SOLD OUT</span>' : ''}<button class="heart-button" aria-label="Save ${product.name}" data-toast="Saved for later — sign-in is not needed for this demo">${icon('heart', 17)}</button><a class="quick-view" href="/products/${product.id}" data-link>Quick view ${icon('arrow', 14)}</a></div><div class="product-info"><div class="product-meta"><span>${product.category}</span><span>${product.sku}</span></div><h3><a href="/products/${product.id}" data-link>${product.name}</a></h3><div class="rating"><span>${'★'.repeat(5)}</span> <small>${product.rating} (${product.reviews})</small></div><div class="price-row"><strong>${formatPrice(product.price)}</strong><del>${formatPrice(product.oldPrice)}</del></div><button class="add-button ${soldOut ? 'is-disabled' : ''}" ${soldOut ? 'disabled' : `data-add="${product.id}"`}>${icon('cart', 16)} ${soldOut ? 'Sold Out' : 'Add to Cart'}</button></div></article>`;
}

function featureStrip() {
  return `<section class="feature-strip"><div class="feature"><span class="feature-icon">${icon('spark', 22)}</span><div><b>Pure Copper Motors</b><small>Long life & low heat</small></div></div><div class="feature"><span class="feature-icon">${icon('spark', 22)}</span><div><b>50-60% Energy Saving</b><small>Low electricity bills</small></div></div><div class="feature"><span class="feature-icon">${icon('shield', 22)}</span><div><b>1-Year Warranty</b><small>Official motor guarantee</small></div></div><div class="feature"><span class="feature-icon">${icon('truck', 22)}</span><div><b>Free Lahore Delivery</b><small>Same day at your doorstep</small></div></div></section>`;
}

function guideSection() {
  return `<section class="content-section guide-section" id="guide"><div class="content-wrap"><div class="section-heading"><div><span class="eyebrow">CEILING FAN BUYING GUIDE</span><h2>Choosing the Right Fan Size for Your Room</h2><p>Ensure optimal air circulation and maximum energy savings by choosing the correct blade sweep for your room size.</p></div></div><div class="guide-grid"><div class="guide-card"><div class="guide-chip">48 INCH (1200 MM)</div><h3>Bedrooms & Studies</h3><p>Ideal for rooms up to 140 sq. ft. Delivers focused, whisper-quiet airflow that keeps personal spaces cool throughout the night.</p><span class="guide-metric">Room: 10×10 to 10×14 ft</span></div><div class="guide-card featured"><div class="guide-chip gold">52 INCH (1320 MM) — POPULAR</div><h3>Living Rooms & Dining</h3><p>The standard luxury size for Pakistani homes (140 to 220 sq. ft). Aerodynamic copper motor moves massive air volume with minimal sound.</p><span class="guide-metric">Room: 14×14 to 16×16 ft</span></div><div class="guide-card"><div class="guide-chip">56 INCH (1400 MM)</div><h3>Drawing Rooms & Halls</h3><p>Engineered for high ceilings and open halls over 220 sq. ft. Broad architectural blade sweep provides refreshing air across the entire room.</p><span class="guide-metric">Room: 16×18 ft and above</span></div></div></div></section>`;
}

function faqSection() {
  return `<section class="content-section faq-section" id="faq"><div class="content-wrap"><div class="section-heading"><div><span class="eyebrow">FREQUENTLY ASKED QUESTIONS</span><h2>Common Questions About Maqsood Fans</h2><p>Everything you need to know about our copper motors, energy efficiency, Lahore same-day delivery, and warranty.</p></div></div><div class="faq-list"><details class="faq-item" open><summary class="faq-question"><span>Do you offer free same-day ceiling fan delivery in Lahore?</span><span class="faq-arrow">${icon('chevron', 16)}</span></summary><div class="faq-answer"><p>Yes, Maqsood Fans provides free same-day delivery across Lahore for all online and WhatsApp orders placed before 4:00 PM. We deliver to DHA (Phases 1–9), Gulberg, Bahria Town, Johar Town, Model Town, Cantt, and all surrounding areas.</p></div></details><details class="faq-item"><summary class="faq-question"><span>What is the price of Maqsood ceiling fans in Pakistan?</span><span class="faq-arrow">${icon('chevron', 16)}</span></summary><div class="faq-answer"><p>Maqsood Fans are priced between Rs. 8,400 and Rs. 14,500 depending on the blade sweep, finish, and motor type. We offer seasonal discounts up to 30% OFF on selected designer models like Royal Plus and Classic Pro.</p></div></details><details class="faq-item"><summary class="faq-question"><span>Are Maqsood Fans energy-efficient with pure copper winding?</span><span class="faq-arrow">${icon('chevron', 16)}</span></summary><div class="faq-answer"><p>Yes, all Maqsood Fans are manufactured using 99.9% pure electrical copper windings and high-permeability electrical silicon steel sheets. This reduces heat generation and saves up to 50% to 60% on monthly electricity bills compared to standard fans.</p></div></details><details class="faq-item"><summary class="faq-question"><span>Are these fans compatible with home UPS and solar systems?</span><span class="faq-arrow">${icon('chevron', 16)}</span></summary><div class="faq-answer"><p>Absolutely. Our motor engineering ensures smooth low-wattage operation without harmonic humming, making them ideal for solar inverters, UPS backup units, and low-voltage conditions during summer.</p></div></details><details class="faq-item"><summary class="faq-question"><span>What warranty and after-sales support do you provide?</span><span class="faq-arrow">${icon('chevron', 16)}</span></summary><div class="faq-answer"><p>We back every fan with an official 1-year replacement warranty covering the motor and electrical components. Our customer support is available directly via WhatsApp (+92 323 4464246) for fast service.</p></div></details></div></div></section>`;
}

function homePage() {
  return `${header()}<main><section class="hero"><div class="hero-image"></div><div class="hero-overlay"></div><div class="hero-content"><span class="eyebrow light">PREMIUM CEILING FANS IN LAHORE</span><h1>Best Ceiling Fans in Pakistan<br /><em>Cooler Homes, Happier Lives</em></h1><p>Discover Lahore's premier collection of inverter and designer ceiling fans. Whisper-quiet copper motors, 3 to 5 blade profiles, and free same-day delivery across Lahore.</p><a href="/products" data-link class="button button-gold">Shop All Fans ${icon('arrow', 17)}</a></div><div class="hero-note"><span>Since 1998</span><b>Air that feels like home.</b></div></section>${featureStrip()}<section class="content-section collection-section"><div class="content-wrap">${sectionHeading('OUR COLLECTION', 'Popular Ceiling Fan Models in Lahore', 'Explore our best selling ceiling fans with modern designs, pure copper motors, and reliable performance.', { href: '/products', label: 'View All' })}<div class="product-grid home-products">${products.slice(0, 4).map((p) => productCard(p)).join('')}</div></div></section>${guideSection()}<section class="offer-banner"><div class="offer-art"></div><div class="offer-copy"><span class="eyebrow light">SPECIAL OFFER</span><h2>Up to <em>30% OFF</em></h2><p>On Selected Designer & Inverter Ceiling Fans</p><a href="/products" data-link class="button button-gold">Shop Sale ${icon('arrow', 16)}</a></div></section><section class="content-section why-section" id="about"><div class="content-wrap">${sectionHeading('THE MAQSOOD PROMISE', 'Engineered for Performance & Efficiency', 'Thoughtful design, 100% pure copper motors, and comfort you can feel in every room.')}<div class="promise-grid"><div><span>${icon('spark', 25)}</span><b>99.9% Pure Copper</b><small>High grade copper winding for long life</small></div><div><span>${icon('spark', 25)}</span><b>Save 50-60% Energy</b><small>Optimized silicon steel saves electricity</small></div><div><span>${icon('shield', 25)}</span><b>1-Year Motor Warranty</b><small>Official doorstep warranty support</small></div><div><span>${icon('truck', 25)}</span><b>Free Same-Day Delivery</b><small>Fast delivery across all Lahore areas</small></div></div><div class="brand-story-card"><div class="brand-story-copy"><span class="eyebrow">ABOUT MAQSOOD FANS PAKISTAN</span><h3>Pakistan's Trusted Electric & Ceiling Fan Manufacturer Since 1998</h3><p>Founded in Lahore over 25 years ago, <strong>Maqsood Fans</strong> has grown into an established brand recognized for rugged engineering, whisper-quiet performance, and modern interior aesthetics. Every fan is manufactured with heavy-gauge electrical silicon steel sheets and 99.9% pure electrical copper wire windings — engineered specifically to withstand intense Pakistani summers, voltage variations, and seamless transition with home UPS and solar inverters.</p><div class="brand-story-stats"><div><b>1998</b><small>Founded in Lahore</small></div><div><b>100%</b><small>Pure Copper Motors</small></div><div><b>1 Year</b><small>Replacement Guarantee</small></div><div><b>Same Day</b><small>Free Delivery in Lahore</small></div></div></div></div><div class="service-support-card"><div><span class="eyebrow">LOCAL SERVICE & SUPPORT</span><h3>Ceiling Fan Installation & Repair Services in Lahore</h3><p>Need fan installation or electric fan repair services near you in Lahore? We provide genuine spare parts, copper motor rewinding, warranty replacements, and technical support. Our customer care team is available directly on WhatsApp.</p></div><button class="button button-gold" data-whatsapp="general">${icon('whatsapp', 16)} WhatsApp Service Desk</button></div></div></section>${faqSection()}</main>${footer()}`;
}

function productsPage() {
  const visible = products.filter((p) => (state.selectedCategory === 'All fans' || p.category === state.selectedCategory) && p.name.toLowerCase().includes(state.query.toLowerCase()));
  return `${header()}<main><div class="page-hero"><div class="content-wrap"><div class="breadcrumbs"><a href="/" data-link>Home</a><span>/</span><span>Products</span></div><span class="eyebrow">OUR COLLECTION</span><h1>Ceiling Fans in Pakistan</h1><p>Discover our complete range of premium ceiling fans with modern designer aesthetics and 100% copper motors.</p></div></div><section class="content-section catalog-section"><div class="content-wrap catalog-layout"><aside class="filter-panel"><div class="filter-head"><b>Filter by</b><button class="clear-filter" data-filter-clear>Reset all</button></div><div class="filter-group"><span>Categories</span>${['All fans', 'Premium', 'Designer', 'Natural', 'Everyday'].map((cat) => `<label class="check-row"><input type="radio" name="category" value="${cat}" ${state.selectedCategory === cat ? 'checked' : ''} /><span>${cat}</span></label>`).join('')}</div><div class="filter-group"><span>Availability</span><label class="check-row"><input type="checkbox" checked /><span>In Stock</span></label><label class="check-row"><input type="checkbox" /><span>On Sale</span></label></div><div class="filter-note"><b>Need help choosing?</b><p>Talk to our fan experts for a room-by-room recommendation.</p><button data-whatsapp="general">${icon('whatsapp', 15)} Chat with us</button></div></aside><div class="catalog-main"><div class="catalog-toolbar"><span><b>${visible.length}</b> fans shown</span><label>Sort by <select id="sort-select"><option ${state.sort === 'Featured' ? 'selected' : ''}>Featured</option><option ${state.sort === 'Price: low to high' ? 'selected' : ''}>Price: low to high</option><option ${state.sort === 'Price: high to low' ? 'selected' : ''}>Price: high to low</option></select></label></div><div class="product-grid catalog-grid">${visible.length ? visible.map((p) => productCard(p)).join('') : `<div class="empty-results"><span>${icon('search', 30)}</span><h3>No fans found</h3><p>Try another search or reset your filters.</p><button class="button button-dark" data-filter-clear>Reset filters</button></div>`}</div></div></div></section></main>${footer()}`;
}

function reviewMarkup(product) {
  const reviews = reviewsByProduct[product.id] || [];
  return reviews.map((review) => `<article class="review-card"><div class="review-card-top"><div><b>${review.name}</b><small>${review.date}</small></div><span class="verified-review">${icon('check', 12)} Verified buyer</span></div><div class="review-stars">${'★'.repeat(review.rating)}<span>${'★'.repeat(5 - review.rating)}</span></div><p>${review.text}</p></article>`).join('');
}

function productPage(id) {
  const product = findProduct(id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const galleryImages = [product.image, product.image2, product.image3, product.image4].filter(Boolean);
  if (galleryImages.length < 3) ['/assets/hero-clean.jpg', '/assets/product-grid.jpg'].forEach((fallback) => { if (galleryImages.length < 3 && !galleryImages.includes(fallback)) galleryImages.push(fallback); });
  const galleryThumbs = galleryImages.map((image, index) => `<button class="${index === 0 ? 'active' : ''}" data-gallery-image="${image}"><img src="${image}" alt="${product.name} Ceiling Fan by Maqsood Fans - View ${index + 1}" /></button>`).join('');
  return `${header()}<main><div class="content-wrap detail-breadcrumb"><div class="breadcrumbs"><a href="/" data-link>Home</a><span>/</span><a href="/products" data-link>Products</a><span>/</span><span>${product.name}</span></div></div><section class="content-section product-detail-section"><div class="content-wrap product-detail"><div class="gallery"><div class="gallery-main zoomable" role="button" tabindex="0" aria-label="Open ${product.name} image zoom" data-zoom-image="${product.image}"><img src="${product.image}" alt="${product.name} (${product.size}) Ceiling Fan by Maqsood Fans Pakistan" /><span class="zoom-hint">Hover or tap to zoom</span></div><div class="gallery-thumbs">${galleryThumbs}</div></div><div class="detail-copy"><div class="product-meta"><span>${product.category} collection</span><span>${product.sku}</span></div><h1>${product.name}</h1><div class="detail-rating"><span>${'★'.repeat(5)}</span> <b>${product.rating}</b> <a href="#reviews" data-review-jump>(${product.reviews} customer reviews)</a></div><p class="detail-description">${product.description}</p><div class="detail-price"><strong>${formatPrice(product.price)}</strong><del>${formatPrice(product.oldPrice)}</del><span>${product.discount}</span></div><div class="detail-divider"></div><div class="stock-status ${product.stockStatus === 'out_of_stock' ? 'out' : 'in'}">${product.stockStatus === 'out_of_stock' ? 'Currently sold out' : 'In stock · Ready to dispatch'}</div><div class="option-row"><b>Quantity:</b><div class="quantity-control"><button data-detail-qty="minus" aria-label="Decrease quantity">${icon('minus', 15)}</button><span id="detail-qty">1</span><button data-detail-qty="plus" aria-label="Increase quantity">${icon('plus', 15)}</button></div></div><button class="button button-dark detail-add ${product.stockStatus === 'out_of_stock' ? 'is-disabled' : ''}" ${product.stockStatus === 'out_of_stock' ? 'disabled' : `data-detail-add="${product.id}"`}>${icon('cart', 18)} ${product.stockStatus === 'out_of_stock' ? 'Sold Out' : 'Add to Cart'}</button><button class="whatsapp-button" data-whatsapp="product:${product.id}">${icon('whatsapp', 18)} Order on WhatsApp</button><div class="detail-benefits"><span>${icon('truck', 22)}<b>Free delivery</b><small>Across Lahore · same day</small></span><span>${icon('shield', 22)}<b>1 year warranty</b><small>On motor & body</small></span><span>${icon('phone', 22)}<b>Expert support</b><small>Here when you need us</small></span></div></div></div></section><section class="content-section specs-section"><div class="content-wrap"><div class="detail-tabs" role="tablist"><button class="active" data-tab="description" role="tab" aria-selected="true">Description</button><button data-tab="specifications" role="tab" aria-selected="false">Specifications</button><button data-tab="reviews" role="tab" aria-selected="false">Customer Reviews (${product.reviews})</button></div><div class="tab-panels"><div class="spec-content tab-panel active" data-tab-panel="description"><p>${product.description} Designed for comfortable airflow, quiet evenings and reliable everyday performance. It is a simple upgrade that makes the whole room feel more considered.</p><div class="spec-grid"><span><b>Best for</b>Living rooms & bedrooms</span><span><b>Finish</b>${product.color}</span><span><b>Airflow</b>High performance</span><span><b>Warranty</b>1 year</span></div></div><div class="spec-content tab-panel" data-tab-panel="specifications"><p>Everything you need to know about the ${product.name} before it reaches your home.</p><div class="spec-grid"><span><b>Size</b>${product.size}</span><span><b>Blades</b>${product.blades}</span><span><b>Motor</b>High performance copper</span><span><b>Speed</b>6 speed settings</span><span><b>Remote</b>Included</span><span><b>Colour</b>${product.color}</span><span><b>Installation</b>Ceiling mount</span><span><b>Delivery</b>Free across Lahore · same day</span></div></div><div class="spec-content tab-panel review-panel" data-tab-panel="reviews" id="reviews"><div class="review-summary"><div><strong>${product.rating}</strong><span class="review-stars">${'★'.repeat(5)}</span><small>Based on ${product.reviews} customer reviews</small></div><div class="review-summary-note">Real homes. Real comfort.<br />Verified customer experiences.</div></div><div class="review-list">${reviewMarkup(product)}</div></div></div></div></section><section class="content-section related-section"><div class="content-wrap">${sectionHeading('YOU MAY ALSO LIKE', 'More fans for your home', '', { href: '/products', label: 'View all' })}<div class="product-grid">${related.map((p) => productCard(p, true)).join('')}</div></div></section></main>${footer()}`;
}

function cartPage() {
  const total = state.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  return `${header()}<main><div class="page-hero small"><div class="content-wrap"><div class="breadcrumbs"><a href="/" data-link>Home</a><span>/</span><span>Your Cart</span></div><span class="eyebrow">YOUR SELECTION</span><h1>Your Cart <small>(${state.cart.reduce((sum, i) => sum + i.qty, 0)} items)</small></h1></div></div><section class="content-section cart-section"><div class="content-wrap">${state.cart.length ? `<div class="cart-layout"><div class="cart-items"><div class="cart-table-head"><span>Product</span><span>Price</span><span>Quantity</span><span>Total</span><span></span></div>${state.cart.map((item) => `<div class="cart-item"><div class="cart-product"><img src="${item.product.image}" alt="${item.product.name}" /><div><b>${item.product.name}</b><small>${item.product.sku} · ${item.product.color}</small></div></div><span>${formatPrice(item.product.price)}</span><div class="quantity-control"><button data-cart-qty="minus" data-id="${item.product.id}" aria-label="Decrease quantity">${icon('minus', 14)}</button><span>${item.qty}</span><button data-cart-qty="plus" data-id="${item.product.id}" aria-label="Increase quantity">${icon('plus', 14)}</button></div><b>${formatPrice(item.product.price * item.qty)}</b><button class="remove-button" data-remove="${item.product.id}" aria-label="Remove ${item.product.name}">${icon('trash', 17)}</button></div>`).join('')}<a class="continue-link" href="/products" data-link>${icon('arrow', 15)} Continue shopping</a></div><aside class="summary-card"><span class="eyebrow">ORDER SUMMARY</span><h2>Bring comfort home.</h2><div class="summary-line"><span>Subtotal</span><b>${formatPrice(total)}</b></div><div class="summary-line"><span>Delivery</span><b class="green">Free</b></div><div class="summary-line"><span>Cart status</span><b class="green">Saved in browser</b></div><div class="summary-total"><span>Total</span><b>${formatPrice(total)}</b></div><a class="button button-gold full" href="/checkout" data-link>Proceed to Checkout ${icon('arrow', 16)}</a><small class="summary-note">No payment is collected in this demo. Checkout is for presentation only.</small></aside></div>` : `<div class="empty-cart"><div class="empty-icon">${icon('cart', 35)}</div><span class="eyebrow">NOTHING HERE YET</span><h2>Your cart is waiting for a little comfort.</h2><p>Browse our collection and add a fan that feels right for your home.</p><a href="/products" data-link class="button button-dark">Explore fans ${icon('arrow', 16)}</a></div>`}</div></section></main>${footer()}`;
}

function checkoutPage() {
  const total = state.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const items = state.cart.length ? state.cart : [{ product: products[1], qty: 1 }];
  return `${header()}<main><div class="page-hero small"><div class="content-wrap"><div class="breadcrumbs"><a href="/" data-link>Home</a><span>/</span><a href="/cart" data-link>Cart</a><span>/</span><span>Checkout</span></div><span class="eyebrow">DIRECT ORDERING</span><h1>Almost home.</h1><p>Fill in your details and our team will confirm everything on WhatsApp.</p></div></div><section class="content-section checkout-section"><div class="content-wrap checkout-layout"><form class="checkout-form" id="checkout-form"><div class="form-card"><span class="eyebrow">CUSTOMER INFORMATION</span><h2>Where should we reach you?</h2><div class="form-grid"><label>Full Name *<input name="fullName" required placeholder="Enter your full name" /></label><label>WhatsApp Number *<input name="phone" required placeholder="03XX XXXXXXX" /></label><label>City *<select name="city" required><option value="">Select city</option><option>Lahore</option></select></label><label class="full-field">Complete Delivery Address *<textarea name="address" required placeholder="House no, street, area"></textarea></label><label class="full-field">Order Notes <textarea name="notes" placeholder="Any special instructions (optional)"></textarea></label></div></div><button class="button button-dark full submit-demo" type="submit">${icon('whatsapp', 17)} Place Order on WhatsApp</button><p class="form-note">This is a frontend demo. No account, payment method, or real order will be created.</p></form><aside class="summary-card checkout-summary"><span class="eyebrow">ORDER SUMMARY</span><h2>Your selected fans</h2>${items.map((item) => `<div class="mini-product"><img src="${item.product.image}" alt="${item.product.name}" /><div><b>${item.product.name}</b><small>${item.product.sku} × ${item.qty}</small></div><strong>${formatPrice(item.product.price * item.qty)}</strong></div>`).join('')}<div class="summary-total"><span>Total amount</span><b>${formatPrice(total || items[0].product.price)}</b></div><div class="secure-note">${icon('shield', 17)} <span>Secure by design. Payment is not enabled on this showcase.</span></div></aside></div></section></main>${footer()}`;
}

function mobileBottomNav() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  return `<nav class="mobile-bottom-nav" aria-label="Mobile navigation"><a href="/" data-link>${icon('spark', 17)}<span>Home</span></a><a href="/products" data-link>${icon('search', 17)}<span>Shop</span></a><a href="/cart" data-link>${icon('cart', 17)}<span>Cart${count ? ` (${count})` : ''}</span></a><button data-whatsapp="general">${icon('whatsapp', 17)}<span>WhatsApp</span></button></nav>`;
}

function footer() {
  return `<footer class="site-footer" id="contact"><div class="footer-main content-wrap"><div class="footer-brand">${logo()}<p>Manufacturer of premium, energy-efficient designer ceiling fans in Lahore, Pakistan. Pure copper winding and free same-day delivery across Lahore.</p><button class="footer-wa" data-whatsapp="general">${icon('whatsapp', 16)} Contact on WhatsApp</button></div><div><b>Explore Fans</b><a href="/" data-link>Home</a><a href="/products" data-link>All Fans</a><a href="/#guide" data-link>Fan Size Guide</a><a href="/#faq" data-link>FAQs</a></div><div><b>Customer Care</b><a href="/#contact" data-link>Contact Us</a><a href="/#contact" data-link>Delivery Details</a><a href="/#contact" data-link>1-Year Warranty</a></div><div><b>Visit Our Showroom</b><p>Mon–Sat, 10am–7pm<br />Lahore, Punjab, Pakistan<br />WhatsApp / Phone: +92 323 4464246</p></div></div><div class="footer-bottom content-wrap"><span>© 2026 Maqsood Fans Pakistan. All Rights Reserved.</span><span>100% Pure Copper Motors · Free Same-Day Delivery in Lahore</span></div></footer>${mobileBottomNav()}`;
}

function isAdminRoute() {
  const host = window.location.hostname.toLowerCase();
  const isSubdomainAdmin = host.startsWith('admin.') || host.startsWith('admin-') || host.includes('-admin.') || host.includes('.admin.');
  const path = window.location.pathname;
  return isSubdomainAdmin || path === '/admin' || path.startsWith('/admin/');
}

function route() {
  if (isAdminRoute()) return adminPage();
  const path = window.location.pathname;
  if (path === '/products') return productsPage();
  if (path.startsWith('/products/')) return productPage(path.split('/')[2]);
  if (path === '/cart') return cartPage();
  if (path === '/checkout') return checkoutPage();
  return homePage();
}

function updateMetaTags() {
  const path = window.location.pathname;
  let title = 'Maqsood Fans Pakistan — Best Ceiling Fans in Lahore | Buy Online';
  let desc = 'Official Maqsood Fans website. Buy premium energy-efficient ceiling fans in Pakistan. 99.9% pure copper motor, whisper-quiet operation, modern designs, 1-year replacement warranty & free same-day delivery in Lahore.';
  let canonicalUrl = 'https://maqsoodfans.com' + (path === '/' ? '' : path);

  if (isAdminRoute()) {
    title = 'Catalogue Admin Workspace | Maqsood Fans';
    desc = 'Admin management workspace for Maqsood Fans product catalog and inventory.';
  } else if (path === '/products') {
    title = 'Buy Ceiling Fans in Pakistan — Prices & Modern Models | Maqsood Fans';
    desc = 'Browse our complete catalog of energy-efficient ceiling fans in Pakistan. Pure copper winding, 48 to 56 inch blade sweeps, and competitive factory prices with warranty.';
  } else if (path.startsWith('/products/')) {
    const pId = path.split('/')[2];
    const product = findProduct(pId);
    if (product) {
      title = `${product.name} (${product.size}) Ceiling Fan Price in Pakistan | Maqsood Fans`;
      desc = `Buy ${product.name} (${product.size}, ${product.color}) by Maqsood Fans for ${formatPrice(product.price)}. Pure copper motor, ${product.discount}, 1-year warranty & free same-day delivery in Lahore.`;
    }
  } else if (path === '/cart') {
    title = 'Your Shopping Cart | Maqsood Fans Pakistan';
    desc = 'Review your selected Maqsood ceiling fans and proceed to free same-day delivery checkout in Lahore.';
  } else if (path === '/checkout') {
    title = 'Confirm Your Order on WhatsApp | Maqsood Fans Lahore';
    desc = 'Direct WhatsApp order confirmation for Maqsood Fans with free doorstep delivery across Lahore.';
  }

  document.title = title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', desc);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', desc);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', canonicalUrl);
}

function render() {
  app.innerHTML = route();
  updateMetaTags();
  bindEvents();
  if (isAdminRoute()) loadAdminPanel().catch(() => { document.querySelector('#admin-root').innerHTML = '<div class="admin-auth-card"><h2>Admin service unavailable</h2><p>Please try again after the server is ready.</p></div>'; });
  if (window.location.hash) {
    requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth' }));
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showToast(message) {
  state.toast = message;
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `${icon('check', 16)}<span>${message}</span>`;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 250); }, 2600);
}

function addToCart(id, quantity = 1) {
  const product = findProduct(id);
  if (!product) return;
  if (product.stockStatus === 'out_of_stock') { showToast(`${product.name} is currently sold out`); return; }
  const item = state.cart.find((entry) => entry.product.id === id);
  if (item) item.qty += quantity;
  else state.cart.push({ product, qty: quantity });
  saveCartToStorage();
  render();
  showToast(`${product.name} saved to your cart`);
}

function bindEvents() {
  document.querySelectorAll('[data-link]').forEach((link) => link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    event.preventDefault();
    history.pushState({}, '', href);
    state.menuOpen = false;
    render();
  }));
  document.querySelector('.menu-button')?.addEventListener('click', () => { state.menuOpen = !state.menuOpen; render(); });
  document.querySelector('.search-toggle')?.addEventListener('click', () => {
    const panel = document.querySelector('.search-panel'); panel.classList.toggle('open'); if (panel.classList.contains('open')) document.querySelector('#site-search')?.focus();
  });
  document.querySelector('.search-panel')?.addEventListener('submit', (event) => event.preventDefault());
  document.querySelector('#site-search')?.addEventListener('input', (event) => { state.query = event.target.value; });
  document.querySelector('#site-search')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { history.pushState({}, '', '/products'); render(); } });
  document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));
  document.querySelectorAll('[data-whatsapp]').forEach((button) => button.addEventListener('click', () => { window.location.href = whatsappUrl(whatsappMessage(button.dataset.whatsapp)); }));
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.add)));
  document.querySelectorAll('[data-detail-add]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.detailAdd, Number(document.querySelector('#detail-qty')?.textContent || 1))));
  document.querySelectorAll('[data-gallery-image]').forEach((button) => button.addEventListener('click', () => {
    const gallery = document.querySelector('.gallery-main');
    gallery.querySelector('img').src = button.dataset.galleryImage;
    gallery.dataset.zoomImage = button.dataset.galleryImage;
    document.querySelectorAll('[data-gallery-image]').forEach((thumb) => thumb.classList.toggle('active', thumb === button));
  }));
  document.querySelectorAll('.gallery-main.zoomable').forEach((gallery) => {
    gallery.addEventListener('mouseenter', () => gallery.classList.add('is-zooming'));
    gallery.addEventListener('mouseleave', () => gallery.classList.remove('is-zooming'));
    gallery.addEventListener('mousemove', (event) => {
      const rect = gallery.getBoundingClientRect();
      gallery.style.setProperty('--zoom-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      gallery.style.setProperty('--zoom-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
    const openLightbox = () => {
      const image = gallery.querySelector('img');
      if (!image) return;
      const overlay = document.createElement('div');
      overlay.className = 'image-lightbox';
      overlay.innerHTML = `<button class="lightbox-close" aria-label="Close image zoom">${icon('close', 22)}</button><img src="${image.src}" alt="${image.alt}" />`;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('open'));
      const closeLightbox = () => { overlay.classList.remove('open'); setTimeout(() => overlay.remove(), 180); document.removeEventListener('keydown', onKey); };
      const onKey = (event) => { if (event.key === 'Escape') closeLightbox(); };
      overlay.addEventListener('click', (event) => { if (event.target === overlay || event.target.closest('.lightbox-close')) closeLightbox(); });
      document.addEventListener('keydown', onKey);
    };
    gallery.addEventListener('click', openLightbox);
    gallery.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(); } });
  });
  document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => {
    const tab = button.dataset.tab;
    document.querySelectorAll('[data-tab]').forEach((tabButton) => { tabButton.classList.toggle('active', tabButton === button); tabButton.setAttribute('aria-selected', tabButton === button ? 'true' : 'false'); });
    document.querySelectorAll('[data-tab-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.tabPanel === tab));
  }));
  document.querySelectorAll('[data-review-jump]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('[data-tab="reviews"]')?.click();
    document.querySelector('#reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  document.querySelectorAll('[data-filter-clear]').forEach((button) => button.addEventListener('click', () => { state.selectedCategory = 'All fans'; state.query = ''; render(); }));
  document.querySelectorAll('input[name="category"]').forEach((input) => input.addEventListener('change', (event) => { state.selectedCategory = event.target.value; render(); }));
  document.querySelector('#sort-select')?.addEventListener('change', (event) => { state.sort = event.target.value; if (event.target.value.includes('low')) products.sort((a, b) => a.price - b.price); else if (event.target.value.includes('high')) products.sort((a, b) => b.price - a.price); else products.sort((a, b) => productOrder.indexOf(a.id) - productOrder.indexOf(b.id)); render(); });
  document.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
    state.cart = state.cart.filter((item) => item.product.id !== button.dataset.remove);
    saveCartToStorage();
    render();
    showToast('Item removed from cart');
  }));
  document.querySelectorAll('[data-cart-qty]').forEach((button) => button.addEventListener('click', () => {
    const item = state.cart.find((entry) => entry.product.id === button.dataset.id);
    if (!item) return;
    item.qty += button.dataset.cartQty === 'plus' ? 1 : -1;
    if (item.qty < 1) state.cart = state.cart.filter((entry) => entry.product.id !== button.dataset.id);
    saveCartToStorage();
    render();
  }));
  document.querySelectorAll('[data-detail-qty]').forEach((button) => button.addEventListener('click', () => { const qty = document.querySelector('#detail-qty'); let value = Number(qty.textContent); value += button.dataset.detailQty === 'plus' ? 1 : -1; qty.textContent = Math.max(1, value); }));
  document.querySelector('#checkout-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const details = Object.fromEntries(new FormData(event.currentTarget).entries());
    const items = state.cart.length ? state.cart : [{ product: products[1], qty: 1 }];
    const lines = items.map(({ product, qty }) => `- ${product.name} (${product.sku}) x ${qty} — ${formatPrice(product.price * qty)}`).join('\n');
    const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const message = `Assalam-o-Alaikum Maqsood Fans,\n\nI would like to place an order.\n\nProducts:\n${lines}\n\nCustomer details:\nName: ${details.fullName}\nWhatsApp: ${details.phone}\nCity: ${details.city}\nAddress: ${details.address}${details.notes ? `\nNotes: ${details.notes}` : ''}\n\nEstimated total: ${formatPrice(total)}\n\nPlease confirm availability and delivery timing.`;
    window.location.href = whatsappUrl(message);
  });
}

window.addEventListener('popstate', render);
render();

async function hydrateCatalog() {
  if (catalogHydrated) return;
  try {
    const response = await fetch('/api/products');
    if (!response.ok) return;
    const remoteProducts = await response.json();
    if (remoteProducts.length) {
      products.splice(0, products.length, ...remoteProducts);
      state.cart = state.cart.map((item) => {
        const fresh = findProduct(item.product.id) || item.product;
        return { product: fresh, qty: item.qty };
      });
      saveCartToStorage();
      const reviewsResponse = await fetch('/api/reviews');
      if (reviewsResponse.ok) {
        const remoteReviews = await reviewsResponse.json();
        Object.keys(reviewsByProduct).forEach((key) => delete reviewsByProduct[key]);
        remoteReviews.forEach((review) => { (reviewsByProduct[review.productId] ||= []).push(review); });
      }
      catalogHydrated = true;
      render();
    }
  } catch { /* Static seed data remains available if the API is temporarily unavailable. */ }
}

hydrateCatalog();
