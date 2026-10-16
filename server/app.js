import express from 'express';
import { listProducts, listReviews, removeProduct, removeReview, saveProduct, saveReview } from './db.js';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.get('/api/products', async (req, res, next) => { try { res.json(await listProducts()); } catch (error) { next(error); } });
  app.get('/api/reviews', async (req, res, next) => { try { res.json(await listReviews(req.query.productId)); } catch (error) { next(error); } });
  app.get('/api/admin/products', async (req, res, next) => { try { res.json(await listProducts()); } catch (error) { next(error); } });
  app.post('/api/admin/products', async (req, res, next) => { try { res.status(201).json(await saveProduct(req.body, req.body.id)); } catch (error) { next(error); } });
  app.put('/api/admin/products/:id', async (req, res, next) => { try { res.json(await saveProduct(req.body, req.params.id)); } catch (error) { next(error); } });
  app.delete('/api/admin/products/:id', async (req, res, next) => { try { await removeProduct(req.params.id); res.status(204).end(); } catch (error) { next(error); } });
  app.get('/api/admin/reviews', async (req, res, next) => { try { res.json(await listReviews()); } catch (error) { next(error); } });
  app.post('/api/admin/reviews', async (req, res, next) => { try { res.status(201).json(await saveReview(req.body)); } catch (error) { next(error); } });
  app.put('/api/admin/reviews/:id', async (req, res, next) => { try { res.json(await saveReview(req.body, req.params.id)); } catch (error) { next(error); } });
  app.delete('/api/admin/reviews/:id', async (req, res, next) => { try { await removeReview(req.params.id); res.status(204).end(); } catch (error) { next(error); } });
  app.use((error, req, res, next) => { console.error(error); res.status(500).json({ error: 'Something went wrong. Please try again.' }); });
  return app;
}
