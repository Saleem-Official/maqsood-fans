import { createServer as createViteServer } from 'vite';
import { createApp } from './app.js';
import { initDb } from './db.js';

const port = Number(process.env.PORT || 3000);
await initDb();
const app = createApp();
const vite = await createViteServer({ server: { middlewareMode: true, hmr: true }, appType: 'spa' });
app.use(vite.middlewares);
app.listen(port, '0.0.0.0', () => console.log(`Maqsood Fans dev server listening on ${port}`));
