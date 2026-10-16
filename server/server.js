import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApp } from './app.js';
import { initDb } from './db.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = createApp();
await initDb();
app.use(express.static(path.join(root, '..', 'dist')));
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(root, '..', 'dist', 'index.html'));
});
const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Maqsood Fans production server listening on ${port}`));
