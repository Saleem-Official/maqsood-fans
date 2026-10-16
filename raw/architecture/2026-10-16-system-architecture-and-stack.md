# System Architecture and Technology Stack

> Source: Project codebase (package.json, vercel.json, Dockerfile, app.config.ts, DEVELOPER_HANDOFF.md)
> Collected: 2026-10-16
> Published: 2026-10-16

## System Overview

Maqsood Fans is a full-stack, responsive ceiling fan e-commerce showcase application and catalogue administration system. It features a high-performance modern web architecture built with pure ESM (ECMAScript Modules), Vite for frontend compilation, Express for backend API delivery, and a resilient storage layer designed to deploy seamlessly on both serverless cloud environments (Vercel) and traditional containerized infrastructure (Docker / Node.js).

## Technology Stack

- Runtime: Node.js 20 or newer (Node.js 22+ recommended; active Node v24.20.0).
- Frontend Framework & Bundler: Vite 6 (vite v6.4.4 / ^6.0.0) configured with ES modules.
- Backend Framework: Express 5 (^5.1.0) with express.json and express.urlencoded body parsing set to 20MB payload limit.
- Database Driver: mysql2 (^3.14.3) with connection pooling via mysql2/promise, featuring dynamic on-demand loading.
- Production Fallbacks: Zero-dependency Node.js HTTP preview server (server/preview-server.js) and in-memory catalogue store.
- Styling System: Plain CSS3 (src/styles.css) with CSS custom properties, responsive grid, flexbox, and keyframe animations.
- Containerization: Dockerfile multi-stage / production Node alpine container.
- Deployment Platform: Vercel serverless platform with custom URL rewrites and subdomain routing.

## Runtime Dependencies and Scripts

From package.json:
```json
{
  "name": "maqsood-fans",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node server/dev.js",
    "build": "vite build",
    "preview": "node server/server.js",
    "start": "node server/server.js"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  },
  "dependencies": {
    "express": "^5.1.0",
    "mysql2": "^3.14.3"
  }
}
```

## Environment Configuration

- PORT: Server listen port, defaulting to 3000.
- DATABASE_URL: MySQL connection string (e.g., mysql://user:password@host:3306/maqsood_fans). When absent, the system seamlessly uses its in-memory database store.

## Repository File Structure

```text
index.html                    Vite HTML entry shell
src/main.js                   Storefront rendering, client routing, cart engine, WhatsApp flow
src/admin.js                  Admin catalogue manager, password gate, image upload handler
src/data.js                   Built-in seed catalogue, categories, and reviews dataset
src/styles.css                Complete responsive design system and mobile styling
server/dev.js                 Development server entrypoint with Vite middleware
server/server.js              Production Express server entrypoint
server/app.js                 Express API routes and error handling
server/db.js                  Database connection pool, schema init, in-memory store, CRUD
server/preview-server.js      Zero-dependency native Node.js HTTP preview server
api/index.js                  Vercel serverless function entrypoint
public/assets/                Logos, product imagery, and SVG icons
public/manus-routes.json      Application route manifest
vercel.json                   Vercel serverless rewrites and build configuration
Dockerfile                    Production container build specification
app.config.ts                 Application metadata and logo configuration
DEVELOPER_HANDOFF.md          Developer technical handover documentation
TODO.md                       Project roadmap and functional specifications
```
