import express from 'express';
import { getAdminPassword, listProducts, listReviews, removeProduct, removeReview, resetProductsToSeeds, saveProduct, saveReview, setAdminPassword } from './db.js';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    next();
  });
  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.post('/api/admin/verify-password', async (req, res, next) => {
    try {
      const current = await getAdminPassword();
      const valid = Boolean(req.body && req.body.password && req.body.password === current);
      res.json({ valid });
    } catch (error) { next(error); }
  });
  app.post('/api/admin/change-password', async (req, res, next) => {
    try {
      const current = await getAdminPassword();
      if (!req.body || req.body.currentPassword !== current) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      const newPass = String(req.body.newPassword || '').trim();
      if (newPass.length < 3) {
        return res.status(400).json({ error: 'New password must be at least 3 characters' });
      }
      await setAdminPassword(newPass);
      res.json({ success: true });
    } catch (error) { next(error); }
  });
  app.get('/api/products', async (req, res, next) => { try { res.json(await listProducts()); } catch (error) { next(error); } });
  app.get('/api/reviews', async (req, res, next) => { try { res.json(await listReviews(req.query.productId)); } catch (error) { next(error); } });
  app.get('/api/admin/products', async (req, res, next) => { try { res.json(await listProducts()); } catch (error) { next(error); } });
  app.post('/api/admin/products/reset', async (req, res, next) => { try { res.json(await resetProductsToSeeds()); } catch (error) { next(error); } });
  app.post('/api/admin/products', async (req, res, next) => { try { res.status(201).json(await saveProduct(req.body, req.body.id)); } catch (error) { next(error); } });
  app.put('/api/admin/products/:id', async (req, res, next) => { try { res.json(await saveProduct(req.body, req.params.id)); } catch (error) { next(error); } });
  app.delete('/api/admin/products/:id', async (req, res, next) => { try { await removeProduct(req.params.id); res.json({ success: true, id: req.params.id }); } catch (error) { next(error); } });
  app.get('/api/admin/reviews', async (req, res, next) => { try { res.json(await listReviews()); } catch (error) { next(error); } });
  app.post('/api/admin/reviews', async (req, res, next) => { try { res.status(201).json(await saveReview(req.body)); } catch (error) { next(error); } });
  app.put('/api/admin/reviews/:id', async (req, res, next) => { try { res.json(await saveReview(req.body, req.params.id)); } catch (error) { next(error); } });
  app.delete('/api/admin/reviews/:id', async (req, res, next) => { try { await removeReview(req.params.id); res.json({ success: true, id: req.params.id }); } catch (error) { next(error); } });
  app.use((error, req, res, next) => { console.error('API Error:', error); res.status(500).json({ error: error?.message || 'Something went wrong. Please try again.' }); });
  return app;
}
