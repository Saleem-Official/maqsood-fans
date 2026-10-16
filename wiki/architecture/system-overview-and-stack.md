# System Overview and Technology Stack

> Sources: Project Team, 2026-10-16
> Raw: [System Architecture and Technology Stack](../../raw/architecture/2026-10-16-system-architecture-and-stack.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans application is a responsive ceiling fan e-commerce showcase and catalogue management system designed for high performance, zero-friction customer orders via WhatsApp, and autonomous catalogue administration. The codebase is organized as a unified monorepo deploying cleanly to both Vercel serverless edge environments and containerized Docker runtimes.

## Core Technology Stack

- Runtime: Node.js 20 or newer (Node.js 22+ recommended; active Node v24.20.0).
- Frontend Bundler: Vite 6 (vite v6.4.4 / ^6.0.0) configured with ES modules.
- Backend Framework: Express 5 (^5.1.0) with express.json and express.urlencoded body parsing set to 20MB payload limit.
- Database Connectivity: mysql2 (^3.14.3) with connection pooling via mysql2/promise, featuring dynamic on-demand loading.
- Resilient Fallbacks: Zero-dependency Node.js HTTP preview server (server/preview-server.js) and in-memory catalogue store.
- Styling Architecture: CSS3 (src/styles.css) with CSS custom properties, responsive grid, flexbox, and keyframe animations.
- Containerization: Multi-stage Dockerfile based on Node.js Alpine.
- Cloud Hosting: Vercel serverless platform with custom URL rewrites and subdomain routing.

## Monorepo Directory Architecture

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

## Runtime Modes & Scripts

- `npm run dev`: Boots local development server with Express and Vite middleware.
- `npm run build`: Generates optimized static assets into `dist/`.
- `npm run start` / `npm run preview`: Launches the production Express server on port 3000.
- `api/index.js`: Serverless entrypoint invoked by Vercel on incoming API requests.

## See Also

- [REST API Specification](../backend/rest-api-specification.md)
- [Database Architecture and In-Memory Fallback](../backend/database-architecture-and-in-memory-fallback.md)
- [Vercel Cloud and Subdomains](../deployment/vercel-cloud-and-subdomains.md)
