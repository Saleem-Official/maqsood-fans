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

// In-memory fallback state so the application functions seamlessly without DATABASE_URL
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

// ─── Vercel Blob Persistent Storage ──────────────────────────────────────────
const BLOB_PRODUCTS = 'maqsood-data/products.json';
const BLOB_REVIEWS  = 'maqsood-data/reviews.json';
const BLOB_SETTINGS = 'maqsood-data/settings.json';

function usesBlob() {
  return (Boolean(process.env.BLOB_STORE_ID) || Boolean(process.env.BLOB_READ_WRITE_TOKEN)) && !process.env.DATABASE_URL;
}

function blobOpts() {
  const opts = {};
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    opts.token = process.env.BLOB_READ_WRITE_TOKEN;
  }
  if (process.env.BLOB_STORE_ID) {
    opts.storeId = process.env.BLOB_STORE_ID;
  }
  return opts;
}

async function streamToText(stream) {
  if (!stream) return '';
  if (typeof stream.text === 'function') {
    return await stream.text();
  }
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Reads a JSON blob from Vercel Blob store.
 * Returns null if the blob does not exist (404).
 * Throws on real network or authentication errors.
 */
async function blobRead(pathname) {
  const { get } = await import('@vercel/blob');
  let res = null;
  try {
    res = await get(pathname, {
      access: 'private',
      useCache: false,
      ...blobOpts()
    });
  } catch (err) {
    if (err.message && (err.message.includes('Cannot use "private"') || err.message.includes('access'))) {
      res = await get(pathname, {
        access: 'public',
        useCache: false,
        ...blobOpts()
      });
    } else {
      throw err;
    }
  }

  if (!res || !res.stream) return null; // 404 Not Found returns null
  const text = await streamToText(res.stream);
  if (!text || !text.trim()) return null;
  return JSON.parse(text);
}

/**
 * Writes data as a JSON blob to Vercel Blob store.
 * Always overwrites with exact state and throws on failure.
 */
async function blobWrite(pathname, data) {
  const { put } = await import('@vercel/blob');
  const body = JSON.stringify(data, null, 2);
  try {
    await put(pathname, body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobOpts(),
      contentType: 'application/json'
    });
  } catch (err) {
    if (err.message && (err.message.includes('Cannot use "private"') || err.message.includes('access'))) {
      await put(pathname, body, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        ...blobOpts(),
        contentType: 'application/json'
      });
    } else {
      console.error(`blobWrite(${pathname}) failed:`, err.message);
      throw err;
    }
  }
}

let blobInitPromise = null;
async function ensureBlobInit() {
  if (!usesBlob()) return;
  if (!blobInitPromise) {
    blobInitPromise = (async () => {
      // Products
      try {
        const savedProducts = await blobRead(BLOB_PRODUCTS);
        if (Array.isArray(savedProducts)) {
          memoryProducts = savedProducts;
        } else if (savedProducts === null) {
          await blobWrite(BLOB_PRODUCTS, memoryProducts);
        }
      } catch (err) {
        console.warn('ensureBlobInit products error:', err.message);
      }

      // Reviews
      try {
        const savedReviews = await blobRead(BLOB_REVIEWS);
        if (Array.isArray(savedReviews)) {
          memoryReviews = savedReviews;
          if (savedReviews.length > 0) {
            nextReviewId = Math.max(...savedReviews.map((r) => Number(r.id) || 0)) + 1;
          }
        } else if (savedReviews === null) {
          await blobWrite(BLOB_REVIEWS, memoryReviews);
        }
      } catch (err) {
        console.warn('ensureBlobInit reviews error:', err.message);
      }

      // Settings
      try {
        const savedSettings = await blobRead(BLOB_SETTINGS);
        if (savedSettings?.adminPassword) {
          memoryPassword = savedSettings.adminPassword;
        } else if (savedSettings === null) {
          await blobWrite(BLOB_SETTINGS, { adminPassword: memoryPassword });
        }
      } catch (err) {
        console.warn('ensureBlobInit settings error:', err.message);
      }
    })().catch((err) => {
      console.error('ensureBlobInit promise failed:', err);
      blobInitPromise = null;
    });
  }
  await blobInitPromise;
}

export async function initDb() {
  if (process.env.DATABASE_URL) {
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
    return;
  }

  if (usesBlob()) {
    await ensureBlobInit();
  }
}

export async function getAdminPassword() {
  if (process.env.DATABASE_URL) {
    try {
      const db = await getPool();
      const [rows] = await db.query("SELECT setting_value FROM site_settings WHERE setting_key = 'admin_password'");
      return rows.length ? rows[0].setting_value : memoryPassword;
    } catch {
      return memoryPassword;
    }
  }

  if (usesBlob()) {
    try {
      const settings = await blobRead(BLOB_SETTINGS);
      if (settings?.adminPassword) {
        memoryPassword = settings.adminPassword;
        return settings.adminPassword;
      }
    } catch (err) {
      console.warn('getAdminPassword blob error:', err.message);
    }
  }

  return memoryPassword;
}

export async function setAdminPassword(newPassword) {
  memoryPassword = newPassword;
  if (process.env.DATABASE_URL) {
    try {
      const db = await getPool();
      await db.query("INSERT INTO site_settings (setting_key, setting_value) VALUES ('admin_password', ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)", [newPassword]);
    } catch (err) {
      console.warn('Could not persist admin password to database:', err.message);
    }
    return;
  }

  if (usesBlob()) {
    try {
      await blobWrite(BLOB_SETTINGS, { adminPassword: newPassword });
    } catch (err) {
      console.error('setAdminPassword blob error:', err.message);
      throw err;
    }
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
  if (process.env.DATABASE_URL) {
    try {
      const db = await getPool();
      const [rows] = await db.query('SELECT id, sku, name, price, old_price, discount, rating, reviews_count, image, image_2, image_3, image_4, category, color, blades, size, description, stock_status FROM products ORDER BY created_at ASC, id ASC');
      return rows.map(mapProduct);
    } catch (err) {
      console.warn('Database query failed, returning in-memory products:', err.message);
      return memoryProducts;
    }
  }

  if (usesBlob()) {
    try {
      const blobProducts = await blobRead(BLOB_PRODUCTS);
      if (Array.isArray(blobProducts)) {
        memoryProducts = blobProducts;
        return blobProducts;
      }
      if (blobProducts === null) {
        await blobWrite(BLOB_PRODUCTS, memoryProducts);
        return memoryProducts;
      }
    } catch (err) {
      console.warn('listProducts blobRead error, falling back to cached memory:', err.message);
    }
  }

  return memoryProducts;
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

  if (process.env.DATABASE_URL) {
    try {
      const db = await getPool();
      const values = [
        formatted.id, formatted.sku, formatted.name, formatted.price, formatted.oldPrice,
        formatted.discount, formatted.rating, formatted.reviews, formatted.image,
        formatted.image2 || null, formatted.image3 || null, formatted.image4 || null,
        formatted.category, formatted.color, formatted.blades, formatted.size,
        formatted.description, formatted.stockStatus
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

  if (usesBlob()) {
    let currentList = [];
    try {
      const fromBlob = await blobRead(BLOB_PRODUCTS);
      if (Array.isArray(fromBlob)) currentList = fromBlob;
      else currentList = [...memoryProducts];
    } catch {
      currentList = [...memoryProducts];
    }

    const idx = currentList.findIndex((p) => p.id === formatted.id);
    if (idx >= 0) {
      currentList[idx] = { ...currentList[idx], ...formatted };
    } else {
      currentList.push(formatted);
    }

    await blobWrite(BLOB_PRODUCTS, currentList);
    memoryProducts = currentList;
    return formatted;
  }

  // Memory fallback
  const idx = memoryProducts.findIndex((p) => p.id === formatted.id);
  if (idx >= 0) memoryProducts[idx] = { ...memoryProducts[idx], ...formatted };
  else memoryProducts.push(formatted);
  return formatted;
}

export async function removeProduct(id) {
  if (process.env.DATABASE_URL) {
    try {
      const db = await getPool();
      await db.query('DELETE FROM products WHERE id = ?', [id]);
    } catch (err) {
      console.warn('Database delete failed, removed from memory:', err.message);
    }
    return;
  }

  if (usesBlob()) {
    let currentList = [];
    try {
      const fromBlob = await blobRead(BLOB_PRODUCTS);
      if (Array.isArray(fromBlob)) currentList = fromBlob;
      else currentList = [...memoryProducts];
    } catch {
      currentList = [...memoryProducts];
    }

    currentList = currentList.filter((p) => p.id !== id);

    await blobWrite(BLOB_PRODUCTS, currentList);
    memoryProducts = currentList;
    return;
  }

  memoryProducts = memoryProducts.filter((p) => p.id !== id);
}

export async function listReviews(productId) {
  if (process.env.DATABASE_URL) {
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

  if (usesBlob()) {
    try {
      const fromBlob = await blobRead(BLOB_REVIEWS);
      if (Array.isArray(fromBlob)) {
        memoryReviews = fromBlob;
        return productId ? fromBlob.filter((r) => r.productId === productId) : fromBlob;
      }
      if (fromBlob === null) {
        await blobWrite(BLOB_REVIEWS, memoryReviews);
        return productId ? memoryReviews.filter((r) => r.productId === productId) : memoryReviews;
      }
    } catch (err) {
      console.warn('listReviews blobRead error, falling back to cached memory:', err.message);
    }
  }

  return productId ? memoryReviews.filter((r) => r.productId === productId) : memoryReviews;
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

  if (process.env.DATABASE_URL) {
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

  if (usesBlob()) {
    let currentReviews = [];
    try {
      const fromBlob = await blobRead(BLOB_REVIEWS);
      if (Array.isArray(fromBlob)) currentReviews = fromBlob;
      else currentReviews = [...memoryReviews];
    } catch {
      currentReviews = [...memoryReviews];
    }

    if (!formatted.id || formatted.id >= 1000000000) {
      const maxId = currentReviews.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0);
      formatted.id = maxId + 1;
    }

    const idx = currentReviews.findIndex((r) => r.id === formatted.id);
    if (idx >= 0) currentReviews[idx] = { ...currentReviews[idx], ...formatted };
    else currentReviews.unshift(formatted);

    await blobWrite(BLOB_REVIEWS, currentReviews);
    memoryReviews = currentReviews;
    return formatted;
  }

  const existingIdx = memoryReviews.findIndex((r) => r.id === formatted.id);
  if (existingIdx >= 0) memoryReviews[existingIdx] = { ...memoryReviews[existingIdx], ...formatted };
  else memoryReviews.unshift(formatted);
  return formatted;
}

export async function removeReview(id) {
  const numId = Number(id);
  if (process.env.DATABASE_URL) {
    try {
      const db = await getPool();
      await db.query('DELETE FROM product_reviews WHERE id=?', [id]);
    } catch (err) {
      console.warn('Database removeReview failed, removed from memory:', err.message);
    }
    return;
  }

  if (usesBlob()) {
    let currentReviews = [];
    try {
      const fromBlob = await blobRead(BLOB_REVIEWS);
      if (Array.isArray(fromBlob)) currentReviews = fromBlob;
      else currentReviews = [...memoryReviews];
    } catch {
      currentReviews = [...memoryReviews];
    }

    currentReviews = currentReviews.filter((r) => r.id !== numId);
    await blobWrite(BLOB_REVIEWS, currentReviews);
    memoryReviews = currentReviews;
    return;
  }

  memoryReviews = memoryReviews.filter((r) => r.id !== numId);
}
