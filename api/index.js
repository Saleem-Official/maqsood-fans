import { createApp } from '../server/app.js';
import { initDb } from '../server/db.js';

let app;

export default async function handler(req, res) {
  if (!app) {
    try {
      await initDb();
    } catch (err) {
      console.warn('Database initialization deferred:', err.message);
    }
    app = createApp();
  }
  return app(req, res);
}
