import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products as initialProducts, reviewsByProduct as initialReviewsByProduct } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// In-memory data store seeded from data.js
let products = JSON.parse(JSON.stringify(initialProducts));
let reviews = [];
let nextReviewId = 100;

for (const [productId, revList] of Object.entries(initialReviewsByProduct)) {
  for (const r of revList) {
    reviews.push({ id: nextReviewId++, productId, name: r.name, date: r.date, rating: r.rating, text: r.text });
  }
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  // API endpoints
  if (pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, mode: 'preview-server' });
  }

  if (pathname === '/api/products' || pathname === '/api/admin/products') {
    if (req.method === 'GET') {
      return sendJson(res, 200, products);
    }
    if (req.method === 'POST') {
      const data = await readBody(req);
      const newProduct = {
        id: data.id || `product-${Date.now()}`,
        sku: data.sku || 'MF-NEW',
        name: data.name || 'New Fan',
        price: Number(data.price || 0),
        oldPrice: Number(data.oldPrice || data.price || 0),
        discount: data.discount || '',
        rating: Number(data.rating || 5),
        reviews: Number(data.reviews || 0),
        image: data.image || '/assets/hero-clean.jpg',
        image2: data.image2 || '',
        image3: data.image3 || '',
        image4: data.image4 || '',
        category: data.category || 'Everyday',
        color: data.color || '',
        blades: data.blades || '3 blade',
        size: data.size || '48 inch',
        stockStatus: data.stockStatus || 'in_stock',
        description: data.description || ''
      };
      products.push(newProduct);
      return sendJson(res, 201, newProduct);
    }
  }

  const prodMatch = pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
  if (prodMatch) {
    const id = prodMatch[1];
    if (req.method === 'PUT') {
      const data = await readBody(req);
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...data, price: Number(data.price), oldPrice: Number(data.oldPrice || data.price) };
        return sendJson(res, 200, products[index]);
      }
      return sendJson(res, 404, { error: 'Not found' });
    }
    if (req.method === 'DELETE') {
      products = products.filter(p => p.id !== id);
      res.writeHead(204);
      return res.end();
    }
  }

  if (pathname === '/api/reviews' || pathname === '/api/admin/reviews') {
    if (req.method === 'GET') {
      const pId = urlObj.searchParams.get('productId');
      const list = pId ? reviews.filter(r => r.productId === pId) : reviews;
      return sendJson(res, 200, list);
    }
    if (req.method === 'POST') {
      const data = await readBody(req);
      const newRev = {
        id: nextReviewId++,
        productId: data.productId,
        name: data.name || 'Anonymous',
        date: data.date || 'Just now',
        rating: Number(data.rating || 5),
        text: data.text || ''
      };
      reviews.unshift(newRev);
      return sendJson(res, 201, newRev);
    }
  }

  const revMatch = pathname.match(/^\/api\/admin\/reviews\/(\d+)$/);
  if (revMatch) {
    const rId = Number(revMatch[1]);
    if (req.method === 'PUT') {
      const data = await readBody(req);
      const idx = reviews.findIndex(r => r.id === rId);
      if (idx !== -1) {
        reviews[idx] = { ...reviews[idx], ...data, rating: Number(data.rating) };
        return sendJson(res, 200, reviews[idx]);
      }
      return sendJson(res, 404, { error: 'Not found' });
    }
    if (req.method === 'DELETE') {
      reviews = reviews.filter(r => r.id !== rId);
      res.writeHead(204);
      return res.end();
    }
  }

  // Handle CSS module import request
  if (pathname === '/src/styles.css' && (req.headers['sec-fetch-dest'] === 'script' || (req.headers.accept && req.headers.accept.includes('*/*') && !req.headers.accept.includes('text/css')))) {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    return res.end('// CSS imported as JS module stub');
  }

  // Static file resolution
  let filePath = '';
  if (pathname.startsWith('/assets/')) {
    filePath = path.join(rootDir, 'public', pathname);
  } else if (pathname.startsWith('/src/') || pathname.startsWith('/public/')) {
    filePath = path.join(rootDir, pathname);
  } else if (pathname === '/favicon.ico') {
    filePath = path.join(rootDir, 'public', 'assets', 'maqsood-logo.jpeg');
  }

  if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(filePath).pipe(res);
  }

  // SPA fallback for all HTML routes (/, /products, /cart, /checkout, /admin, etc.)
  const indexPath = path.join(rootDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Maqsood Fans server running live at http://localhost:${PORT}`);
});
