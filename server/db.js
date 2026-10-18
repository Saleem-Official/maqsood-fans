import { products as seedProducts, reviewsByProduct } from '../src/data.js';

let pool = null;
let mysql = null;

async function getMysql() {
  if (!mysql) {
    try {
      const mod = await import('mysql2/promise');
      mysql = mod.default || mod;
    } catch (err) {
      console.warn('mysql2 module is not available:', err.message);
      return null;
    }
  }
  return mysql;
}

export async function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  const driver = await getMysql();
  if (!driver) throw new Error('mysql2 driver not available');
  if (!pool) pool = driver.createPool(process.env.DATABASE_URL);
  return pool;
}

// ─── In-memory fallback state ────────────────────────────────────────────────
let memoryPassword = 'maqsood123';

let memoryProducts = seedProducts.map((p) => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  price: Number(p.price),
  oldPrice: Number(p.oldPrice || p.price),
  discount: p.discount || '',
  rating: Number(p.rating || 0),
  reviews: Number(p.reviews || 0),
  image: p.image,
  image2: p.image2 || '',
  image3: p.image3 || '',
  image4: p.image4 || '',
  category: p.category,
  color: p.color || '',
  blades: p.blades || '',
  size: p.size || '',
  description: p.description || '',
  stockStatus: p.stockStatus || 'in_stock'
}));

let memoryReviews = [];
let nextReviewId = 1;
for (const [productId, reviews] of Object.entries(reviewsByProduct)) {
  for (const review of reviews) {
    memoryReviews.push({
      id: nextReviewId++,
      productId,
      name: review.name,
      date: review.date,
      rating: Number(review.rating),
      text: review.text
    });
  }
}

// ─── Vercel Blob persistent storage ─────────────────────────────────────────
// Activated when BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID is set and DATABASE_URL is not set.
// Stores three JSON blobs:
//   maqsood-data/products.json   – full products array
//   maqsood-data/reviews.json    – full reviews array
//   maqsood-data/settings.json   – admin password and site settings
//
// Memory arrays above are used as a write-through cache within each
// serverless container lifetime. On cold start, they are rehydrated from blob.

const BLOB_PRODUCTS = 'maqsood-data/products.json';
const BLOB_REVIEWS  = 'maqsood-data/reviews.json';
const BLOB_SETTINGS = 'maqsood-data/settings.json';

let blobReady = false;        // true after ensureBlobInit() has run
let blobUrlMap = {};          // { [pathname]: cachedPublicUrl }

/** Returns true when Blob storage should be used instead of memory. */
function usesBlob() {
  return (Boolean(process.env.BLOB_READ_WRITE_TOKEN) || Boolean(process.env.BLOB_STORE_ID)) && !process.env.DATABASE_URL;
}

/** Returns blob options — passes token explicitly only when available. */
function blobOpts() {
  const opts = {};
  if (process.env.BLOB_READ_WRITE_TOKEN) opts.token = process.env.BLOB_READ_WRITE_TOKEN;
  return opts;
}

/**
 * Fetches a JSON blob by its pathname.
 * On cold start, uses list() to locate the blob URL, then caches it.
 * On warm container, uses the cached URL directly.
 */
async function blobRead(pathname) {
  try {
    // Try cached URL from this container's lifetime first
    if (blobUrlMap[pathname]) {
      const r = await fetch(`${blobUrlMap[pathname]}?_=${Date.now()}`);
      if (r.ok) return r.json();
    }
    // Locate via list() (needed after each cold start)
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({
      prefix: pathname,
      ...blobOpts(),
      limit: 10
    });
    const match = blobs.find((b) => b.pathname === pathname);
    if (!match) return null;
    blobUrlMap[pathname] = match.url;
    const r = await fetch(`${match.url}?_=${Date.now()}`);
    return r.ok ? r.json() : null;
  } catch (err) {
    console.warn(`blobRead(${pathname}):`, err.message);
    return null;
  }
}

/**
 * Writes data as a JSON blob. The blob is public-readable so the
 * serverless function can fetch it without auth. The write requires the
 * server-side BLOB_READ_WRITE_TOKEN and is never exposed to the browser.
 */
async function blobWrite(pathname, data) {
  try {
    const { put } = await import('@vercel/blob');
    const result = await put(pathname, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      ...blobOpts(),
      contentType: 'application/json'
    });
    blobUrlMap[pathname] = result.url;
  } catch (err) {
    console.warn(`blobWrite(${pathname}):`, err.message);
  }
}

/**
 * Called once per cold start (or on first CRUD operation).
 * Loads persisted data into the in-memory arrays.
 * If no blob exists yet (first deploy), seeds the blob from current memory.
 */
async function ensureBlobInit() {
  if (blobReady || !usesBlob()) return;
  blobReady = true; // set before awaits to prevent concurrent re-entry

  // Products
  const savedProducts = await blobRead(BLOB_PRODUCTS);
  if (Array.isArray(savedProducts) && savedProducts.length > 0) {
    memoryProducts = savedProducts;
  } else {
    // First-time: persist the seed data so future cold starts load correctly
    await blobWrite(BLOB_PRODUCTS, memoryProducts);
  }

  // Reviews
  const savedReviews = await blobRead(BLOB_REVIEWS);
  if (Array.isArray(savedReviews)) {
    memoryReviews = savedReviews;
    if (savedReviews.length > 0) {
      nextReviewId = Math.max(...savedReviews.map((r) => Number(r.id) || 0)) + 1;
    }
  } else {
    await blobWrite(BLOB_REVIEWS, memoryReviews);
  }

  // Settings (admin password)
  const savedSettings = await blobRead(BLOB_SETTINGS);
  if (savedSettings?.adminPassword) {
    memoryPassword = savedSettings.adminPassword;
  } else {
    await blobWrite(BLOB_SETTINGS, { adminPassword: memoryPassword });
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export async function initDb() {
  // No DATABASE_URL → try Vercel Blob, otherwise stay in-memory
  if (!process.env.DATABASE_URL) {
    if (usesBlob()) await ensureBlobInit();
    return;
  }
  try {
    const db = await getPool();
    await db.query(`CREATE TABLE IF NOT EXISTS products (id VARCHAR(80) PRIMARY KEY, sku VARCHAR(80) NOT NULL, name VARCHAR(160) NOT NULL, price INT NOT NULL, old_price INT NOT NULL, discount VARCHAR(40) NOT NULL DEFAULT '', rating DECIMAL(3,1) NOT NULL DEFAULT 0, reviews_count INT NOT NULL DEFAULT 0, image LONGTEXT NOT NULL, image_2 LONGTEXT NULL, image_3 LONGTEXT NULL, image_4 LONGTEXT NULL, category VARCHAR(100) NOT NULL, color VARCHAR(100) NOT NULL DEFAULT '', blades VARCHAR(80) NOT NULL DEFAULT '', size VARCHAR(80) NOT NULL DEFAULT '', description TEXT NOT NULL, stock_status VARCHAR(30) NOT NULL DEFAULT 'in_stock', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    try { await db.query("ALTER TABLE products ADD COLUMN stock_status VARCHAR(30) NOT NULL DEFAULT 'in_stock'"); } catch {}
    try { await db.query("ALTER TABLE products MODIFY COLUMN image LONGTEXT NOT NULL"); } catch {}
    for (const column of ['image_2', 'image_3', 'image_4']) {
      try { await db.query(`ALTER TABLE products ADD COLUMN ${column} LONGTEXT NULL`); } catch {}
      try { await db.query(`ALTER TABLE products MODIFY COLUMN ${column} LONGTEXT NULL`); } catch {}
    }
    await db.query(`CREATE TABLE IF NOT EXISTS product_reviews (id INT AUTO_INCREMENT PRIMARY KEY, product_id VARCHAR(80) NOT NULL, name VARCHAR(160) NOT NULL, review_date VARCHAR(80) NOT NULL, rating INT NOT NULL, review_text TEXT NOT NULL, seed_key VARCHAR(180) UNIQUE NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX(product_id))`);
    await db.query(`CREATE TABLE IF NOT EXISTS site_settings (setting_key VARCHAR(80) PRIMARY KEY, setting_value TEXT NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    await db.query(`INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES ('admin_password', 'maqsood123')`);
    for (const product of seedProducts) await db.query(`INSERT IGNORE INTO products (id, sku, name, price, old_price, discount, rating, reviews_count, image, image_2, image_3, image_4, category, color, blades, size, description, stock_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [product.id, product.sku, product.name, product.price, product.oldPrice, product.discount, product.rating, product.reviews, product.image, product.image2 || null, product.image3 || null, product.image4 || null, product.category, product.color, product.blades, product.size, product.description, product.stockStatus || 'in_stock']);
    for (const [productId, reviews] of Object.entries(reviewsByProduct)) for (const [index, review] of reviews.entries()) await db.query(`INSERT IGNORE INTO product_reviews (product_id, name, review_date, rating, review_text, seed_key) VALUES (?, ?, ?, ?, ?, ?)`, [productId, review.name, review.date, review.rating, review.text, `${productId}-seed-${index}`]);
  } catch (err) {
    console.warn('Database initialization failed; using in-memory store:', err.message);
  }
}

export async function getAdminPassword() {
  if (!process.env.DATABASE_URL) {
    await ensureBlobInit();
    return memoryPassword;
  }
  try {
    const db = await getPool();
    const [rows] = await db.query("SELECT setting_value FROM site_settings WHERE setting_key = 'admin_password'");
    return rows.length ? rows[0].setting_value : memoryPassword;
  } catch {
    return memoryPassword;
  }
}

export async function setAdminPassword(newPassword) {
  memoryPassword = newPassword;
  if (!process.env.DATABASE_URL) {
    if (usesBlob()) await blobWrite(BLOB_SETTINGS, { adminPassword: newPassword });
    return;
  }
  try {
    const db = await getPool();
    await db.query("INSERT INTO site_settings (setting_key, setting_value) VALUES ('admin_password', ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)", [newPassword]);
  } catch (err) {
    console.warn('Could not persist admin password to database:', err.message);
  }
}

export function mapProduct(row) {
  return {
    ...row,
    oldPrice: Number(row.old_price),
    reviews: Number(row.reviews_count),
    price: Number(row.price),
    rating: Number(row.rating),
    stockStatus: row.stock_status || 'in_stock',
    image2: row.image_2 || '',
    image3: row.image_3 || '',
    image4: row.image_4 || '',
    old_price: undefined,
    reviews_count: undefined
  };
}

export function mapReview(row) {
  return {
    id: Number(row.id),
    productId: row.product_id,
    name: row.name,
    date: row.review_date,
    rating: Number(row.rating),
    text: row.review_text
  };
}

export async function listProducts() {
  if (!process.env.DATABASE_URL) {
    await ensureBlobInit();
    return memoryProducts;
  }
  try {
    const db = await getPool();
    const [rows] = await db.query('SELECT id, sku, name, price, old_price, discount, rating, reviews_count, image, image_2, image_3, image_4, category, color, blades, size, description, stock_status FROM products ORDER BY created_at ASC, id ASC');
    return rows.map(mapProduct);
  } catch (err) {
    console.warn('Database query failed, returning in-memory products:', err.message);
    return memoryProducts;
  }
}

export async function saveProduct(input, id = input.id) {
  const formatted = {
    id: id || input.id || `product-${Date.now()}`,
    sku: input.sku || `MF-${Date.now().toString().slice(-4)}`,
    name: input.name || 'Untitled Fan',
    price: Number(input.price || 0),
    oldPrice: Number(input.oldPrice || input.price || 0),
    discount: input.discount || '',
    rating: Number(input.rating || 5),
    reviews: Number(input.reviews || 0),
    image: input.image || '',
    image2: input.image2 || '',
    image3: input.image3 || '',
    image4: input.image4 || '',
    category: input.category || 'Everyday',
    color: input.color || '',
    blades: input.blades || '',
    size: input.size || '',
    description: input.description || '',
    stockStatus: input.stockStatus || 'in_stock'
  };

  const existingIdx = memoryProducts.findIndex((p) => p.id === formatted.id);
  if (existingIdx >= 0) {
    memoryProducts[existingIdx] = { ...memoryProducts[existingIdx], ...formatted };
  } else {
    memoryProducts.push(formatted);
  }

  if (!process.env.DATABASE_URL) {
    if (usesBlob()) await blobWrite(BLOB_PRODUCTS, memoryProducts);
    return formatted;
  }
  try {
    const db = await getPool();
    const values = [
      formatted.id,
      formatted.sku,
      formatted.name,
      formatted.price,
      formatted.oldPrice,
      formatted.discount,
      formatted.rating,
      formatted.reviews,
      formatted.image,
      formatted.image2 || null,
      formatted.image3 || null,
      formatted.image4 || null,
      formatted.category,
      formatted.color,
      formatted.blades,
      formatted.size,
      formatted.description,
      formatted.stockStatus
    ];
    await db.query(
      `INSERT INTO products (id, sku, name, price, old_price, discount, rating, reviews_count, image, image_2, image_3, image_4, category, color, blades, size, description, stock_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE sku=VALUES(sku), name=VALUES(name), price=VALUES(price), old_price=VALUES(old_price), discount=VALUES(discount), rating=VALUES(rating), reviews_count=VALUES(reviews_count), image=VALUES(image), image_2=VALUES(image_2), image_3=VALUES(image_3), image_4=VALUES(image_4), category=VALUES(category), color=VALUES(color), blades=VALUES(blades), size=VALUES(size), description=VALUES(description), stock_status=VALUES(stock_status)`,
      values
    );
    const [rows] = await db.query('SELECT id, sku, name, price, old_price, discount, rating, reviews_count, image, image_2, image_3, image_4, category, color, blades, size, description, stock_status FROM products WHERE id = ?', [formatted.id]);
    return mapProduct(rows[0]);
  } catch (err) {
    console.warn('Database save failed, using memory product:', err.message);
    return formatted;
  }
}

export async function removeProduct(id) {
  memoryProducts = memoryProducts.filter((p) => p.id !== id);
  if (!process.env.DATABASE_URL) {
    if (usesBlob()) await blobWrite(BLOB_PRODUCTS, memoryProducts);
    return;
  }
  try {
    const db = await getPool();
    await db.query('DELETE FROM products WHERE id = ?', [id]);
  } catch (err) {
    console.warn('Database delete failed, removed from memory:', err.message);
  }
}

export async function listReviews(productId) {
  if (!process.env.DATABASE_URL) {
    await ensureBlobInit();
    return productId ? memoryReviews.filter((r) => r.productId === productId) : memoryReviews;
  }
  try {
    const db = await getPool();
    const [rows] = await db.query(
      productId
        ? 'SELECT id, product_id, name, review_date, rating, review_text FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC, id DESC'
        : 'SELECT id, product_id, name, review_date, rating, review_text FROM product_reviews ORDER BY created_at DESC, id DESC',
      productId ? [productId] : []
    );
    return rows.map(mapReview);
  } catch (err) {
    console.warn('Database listReviews failed, returning in-memory reviews:', err.message);
    return productId ? memoryReviews.filter((r) => r.productId === productId) : memoryReviews;
  }
}

export async function saveReview(input, id = input.id) {
  const formatted = {
    id: id ? Number(id) : nextReviewId++,
    productId: input.productId,
    name: input.name,
    date: input.date || 'Just now',
    rating: Number(input.rating || 5),
    text: input.text || ''
  };

  const existingIdx = memoryReviews.findIndex((r) => r.id === formatted.id);
  if (existingIdx >= 0) {
    memoryReviews[existingIdx] = { ...memoryReviews[existingIdx], ...formatted };
  } else {
    memoryReviews.unshift(formatted);
  }

  if (!process.env.DATABASE_URL) {
    if (usesBlob()) await blobWrite(BLOB_REVIEWS, memoryReviews);
    return formatted;
  }
  try {
    const db = await getPool();
    if (id) {
      await db.query('UPDATE product_reviews SET product_id=?, name=?, review_date=?, rating=?, review_text=? WHERE id=?', [input.productId, input.name, input.date || 'Just now', Number(input.rating), input.text, id]);
    } else {
      const [result] = await db.query('INSERT INTO product_reviews (product_id, name, review_date, rating, review_text) VALUES (?, ?, ?, ?, ?)', [input.productId, input.name, input.date || 'Just now', Number(input.rating), input.text]);
      id = result.insertId;
      formatted.id = id;
    }
    const [rows] = await db.query('SELECT id, product_id, name, review_date, rating, review_text FROM product_reviews WHERE id=?', [id]);
    return mapReview(rows[0]);
  } catch (err) {
    console.warn('Database saveReview failed, using memory review:', err.message);
    return formatted;
  }
}

export async function removeReview(id) {
  const numId = Number(id);
  memoryReviews = memoryReviews.filter((r) => r.id !== numId);
  if (!process.env.DATABASE_URL) {
    if (usesBlob()) await blobWrite(BLOB_REVIEWS, memoryReviews);
    return;
  }
  try {
    const db = await getPool();
    await db.query('DELETE FROM product_reviews WHERE id=?', [id]);
  } catch (err) {
    console.warn('Database removeReview failed, removed from memory:', err.message);
  }
}
