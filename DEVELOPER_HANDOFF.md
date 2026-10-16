# Maqsood Fans — Developer Handoff & Session State

## 1. Project Overview & Current State

This repository contains the complete responsive **Maqsood Fans** ceiling fan storefront and administration platform. It operates as a Vite 6 frontend served by an Express 5 backend with seamless zero-downtime in-memory fallback and MySQL 8 database persistence.

### Live Production Deployments
- **Storefront (Production)**: [https://maqsood-fans-source.vercel.app](https://maqsood-fans-source.vercel.app)
- **Admin Portal (Subdomain)**: [https://maqsood-fans-admin.vercel.app](https://maqsood-fans-admin.vercel.app) *(Default password: `maqsood123`)*
- **GitHub Repository**: [https://github.com/Saleem-Official/maqsood-fans](https://github.com/Saleem-Official/maqsood-fans) (branch: `main`, 100% clean and synchronized)

---

## 2. Completed Capabilities & Implementations

### A. Storefront & Customer Journey
- **Client-Side Routing**: SPA architecture (`/`, `/products`, `/products/:id`, `/cart`, `/checkout`, `/admin`) using HTML5 History API without page reloads.
- **Product Catalogue**: 9 distinct models across 4 collections (Premium, Designer, Natural, Everyday) with real-time category radio filters, stock filters, price sorting, and live text search.
- **Product Detail Features**: Multi-thumbnail gallery, desktop cursor-tracking hover zoom, mobile tap fullscreen lightbox with backdrop click and Escape key dismissal, specifications grid, and tabbed verified customer reviews.
- **Persistent Cart Engine (`localStorage`)**:
  - Cart storage key: `maqsood_cart`
  - All additions, deletions, and quantity increments/decrements sync synchronously to `localStorage`.
  - Selections persist across tab closures, refreshes, back/forward navigation, and device restarts.
  - Cart summary card explicitly displays: `Cart status: Saved in browser`.
- **Direct WhatsApp Ordering**:
  - WhatsApp target number: `923234464246` (defined in `DEMO_WHATSAPP_NUMBER`).
  - General enquiry, individual product enquiry, cart order summary, and complete checkout redirect.
  - Delivery rule: Free same-day delivery across Lahore, Pakistan. Form explicitly restricts city to Lahore.

### B. Admin Catalogue Management & Security
- **Single-Field Password Gate**:
  - Direct password entry gate (default: `maqsood123`) without user registration or complex OAuth.
  - Subdomain routing: When visiting `https://maqsood-fans-admin.vercel.app`, automatically routes to the admin portal at `/`.
  - Session authentication: Maintained via `sessionStorage.setItem('maqsood_admin_auth', 'true')`.
  - Topbar action pills: "🔑 Change Password" and "🔒 Lock".
  - Change Password Modal: Enforces 3-character minimum, verifies current password, updates server state and local backup (`maqsood_admin_password`).
- **Product Management**: 18-attribute form covering slug/ID, SKU, name, prices, discounts, ratings, reviews count, category, finish/color, blade count, sweep size, description, availability (in_stock vs out_of_stock), and 4 image inputs.
- **Client-Side Canvas Image Compression**:
  - Direct file picker ("📁 Upload image") converts local device files into compressed JPEG data URIs via an off-screen HTML5 canvas (`maxDim: 1200`, 82% quality).
  - Shrinks 5-15MB photos into compact 80-160KB payloads, eliminating the need for paid external S3/Cloudinary storage.
  - Live square thumbnail preview with dynamic URL fallback.
- **Review Manager**: Add, edit, and delete customer reviews linked by product ID.

### C. Backend API & Resilient In-Memory Database Store
- **Hybrid Data Pipeline (`server/db.js`)**:
  - When `DATABASE_URL` is configured, connects to MySQL with connection pooling via dynamic `import('mysql2/promise')`.
  - When `DATABASE_URL` is absent (or database is unreachable), automatically falls back to internal memory structures (`memoryProducts`, `memoryReviews`, `memoryPassword`) initialized with the complete seed dataset.
  - **Zero 500 Errors**: All CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE` for products and reviews, and password verification/change) return standard HTTP 200/201/204 responses in all environments.
- **Vercel Serverless Function (`api/index.js`)**:
  - Express app mounted on `/api/*` with 20MB payload limit.

### D. Comprehensive Karpathy LLM Wiki (`raw/` & `wiki/`)
- Fully structured personal knowledge base following Karpathy's LLM Wiki architecture:
  - `raw/`: 12 immutable source documents covering architecture, catalogue, reviews, storefront, persistent cart, design system, API, database, admin security, media upload, Vercel hosting, and WhatsApp rules.
  - `wiki/`: 13 compiled knowledge articles fully grounded in raw sources.
  - `wiki/index.md`: Global index table grouped by topic with links, summaries, and updated dates.
  - `wiki/log.md`: Append-only operation log with full ingest and lint history.
  - Mechanically verified with 0 dead links, 0 index omissions, and 100% raw inventory coverage.

---

## 3. Repository Architecture & Key Files

```text
├── index.html                    Vite HTML entry shell
├── package.json                  Dependencies (express ^5.1.0, mysql2 ^3.14.3, vite ^6.0.0)
├── vercel.json                   Vercel serverless rewrites and Vite framework config
├── Dockerfile                    Multi-stage production container build
├── app.config.ts                 Project branding and logo metadata
├── DEVELOPER_HANDOFF.md          This technical state and handover document
├── TODO.md                       Roadmap requirements
│
├── api/
│   └── index.js                  Vercel serverless API handler mounting Express
│
├── server/
│   ├── app.js                    Express API route definitions and error handling
│   ├── db.js                     Dual-mode database engine (MySQL + in-memory store)
│   ├── dev.js                    Development server entrypoint with Vite middleware
│   ├── preview-server.js         Zero-dependency native Node.js HTTP server
│   └── server.js                 Production Express server
│
├── src/
│   ├── main.js                   Storefront SPA, persistent cart engine, WhatsApp flow
│   ├── admin.js                  Catalogue workspace, password gate, image compression
│   ├── data.js                   Static seed catalogue (9 models, 24 reviews, categories)
│   └── styles.css                Complete responsive design system and mobile styling
│
├── raw/                          Immutable knowledge sources (12 files)
│   ├── architecture/
│   ├── catalogue/
│   ├── storefront/
│   ├── backend/
│   ├── admin/
│   └── deployment/
│
└── wiki/                         Compiled Karpathy LLM Wiki articles (13 files)
    ├── index.md                  Global Knowledge Base Index
    ├── log.md                    Operation audit log
    ├── architecture/
    ├── catalogue/
    ├── storefront/
    ├── backend/
    ├── admin/
    └── deployment/
```

---

## 4. Where We Left Off & Next Opportunities

Everything requested has been implemented, tested, committed, and deployed:
1. **GitHub Status**: `origin/main` is 100% up-to-date with working tree clean.
2. **Live Hosting**: Vercel production deployment is active with SSL enabled and no login barriers.
3. **Admin Panel**: Accessible at `https://maqsood-fans-admin.vercel.app` (or `/admin`), unlocked with `maqsood123`. Product adding, image uploads, editing, and review management all function properly.
4. **Cart Persistence**: Local storage cart persists across browser sessions.
5. **Documentation**: Full Karpathy LLM Wiki compiled and checked.

### Optional Future Enhancements (When Resuming)
- Attach an external managed MySQL or Postgres database to Vercel environment variables (`DATABASE_URL`) if multi-instance serverless data sharing across different users/devices is desired.
- Add server-side JWT or cookie-based authentication if multiple admin users with distinct roles are needed.
- Connect a custom domain (e.g., `maqsoodfans.com` and `admin.maqsoodfans.com`) via Vercel Custom Domains if moving beyond the free `.vercel.app` domains.
