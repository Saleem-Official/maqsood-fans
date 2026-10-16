# Maqsood Fans — Developer Handoff

## 1. Project overview

This repository contains the responsive Maqsood Fans ceiling-fan storefront and a deliberately open demo admin workspace. It is a Vite frontend served by an Express server. Product and review records are persisted in MySQL when `DATABASE_URL` is configured.

The current build intentionally has **no sign-up, sign-in, payment gateway, or real payment collection**. Checkout is a presentation flow that builds a WhatsApp message and redirects the customer to WhatsApp. Add production authentication and authorization before putting `/admin` on a public subdomain.

## 2. Requirements

- Node.js 20 or newer; Node.js 22 is recommended.
- npm 10 or newer.
- MySQL 8-compatible database for the admin API and persistent catalogue.
- A production process manager or container runtime for deployment.

## 3. Local setup

From the project root:

```bash
npm install
cp .env.example .env
# Edit .env and set DATABASE_URL for persistent admin/API testing.
npm run dev
```

Open `http://localhost:3000/` for the storefront and `http://localhost:3000/admin` for the demo admin.

If `DATABASE_URL` is absent, the frontend can still fall back to its static seed data, but the database-backed API and admin workspace cannot work. Do not commit `.env` or database credentials.

## 4. Environment variables

- `PORT` — server port; defaults to `3000`.
- `DATABASE_URL` — MySQL connection URL, for example `mysql://user:password@host:3306/maqsood_fans`.

The server creates the `products` and `product_reviews` tables automatically on startup when a database URL is present. It also seeds the built-in catalogue and reviews with `INSERT IGNORE`, so existing records are not overwritten.

## 5. Useful commands

```bash
npm run dev      # Development server with API and Vite middleware
npm run build    # Production Vite build; output is dist/
npm run start    # Production Express server
npm run preview  # Same production server command
```

Always run `npm run build` before delivery. The project uses `package-lock.json`; use `npm install` or `npm ci` consistently.

## 6. Project structure

```text
index.html                    Vite HTML shell
src/main.js                   Storefront rendering, routes, cart, checkout, WhatsApp actions
src/admin.js                  Demo admin product/review management UI
src/data.js                   Static seed products, categories, and reviews
src/styles.css                Responsive visual system and mobile styles
server/dev.js                 Development server entrypoint
server/server.js              Production server entrypoint
server/app.js                 Express API routes and health endpoint
server/db.js                  MySQL schema, seed, mapping, and CRUD functions
public/assets/                Logo, product images, and WhatsApp icon
public/manus-routes.json      Page route manifest
Dockerfile                    Production container definition
app.config.ts                 Project logo metadata
TODO.md                       Feature requirements and delivery notes
docs/                         Supporting implementation notes
```

## 7. Page routes

- `/` — Home
- `/products` — Ceiling-fan catalogue with category filters and sorting
- `/products/:id` — Product detail, multi-image gallery, hover zoom, mobile tap lightbox, specs, and reviews
- `/cart` — Cart quantity controls and WhatsApp order CTA
- `/checkout` — Customer details form and WhatsApp order redirect
- `/admin` — Authentication-free demo catalogue workspace; protect this before production

## 8. Admin workflow

Open `/admin` and use the product form to add or edit products. Current dropdowns cover ceiling-fan category, discount, rating, finish/color, blade count, size, and availability. Availability supports `In stock` and `Out of stock / Sold out`.

Each product supports one required primary image URL and up to three optional additional image URLs. The storefront renders all saved images as selectable gallery thumbnails. Desktop users can hover over the main image to zoom. Mobile users can tap the main image to open the fullscreen lightbox and close it with the close button, backdrop, or Escape key.

The review manager supports adding, editing, and deleting reviews. Reviews are linked to products by product ID and are loaded into the storefront from `/api/reviews`.

## 9. API reference

All request bodies are JSON.

### Public

- `GET /api/health` → `{ "ok": true }`
- `GET /api/products` → product array
- `GET /api/reviews` → all review records
- `GET /api/reviews?productId=classic-pro` → reviews for one product

### Demo admin

- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/reviews`
- `POST /api/admin/reviews`
- `PUT /api/admin/reviews/:id`
- `DELETE /api/admin/reviews/:id`

Example product payload:

```json
{
  "id": "classic-pro",
  "sku": "MF-1002",
  "name": "Classic Pro",
  "price": 8800,
  "oldPrice": 11000,
  "discount": "20% OFF",
  "rating": 4.8,
  "reviews": 18,
  "image": "/assets/classic-detail.jpg",
  "image2": "https://images.unsplash.com/example-2?auto=format&fit=crop&w=1200&q=80",
  "image3": "",
  "image4": "",
  "category": "Premium",
  "color": "Black / Gold",
  "blades": "3 blade",
  "size": "48 inch",
  "stockStatus": "in_stock",
  "description": "Product description"
}
```

Example review payload:

```json
{
  "productId": "classic-pro",
  "name": "Customer Name",
  "date": "Just now",
  "rating": 5,
  "text": "Great airflow and a beautiful finish."
}
```

## 10. WhatsApp behavior

The frontend uses the documented click-to-chat pattern:

```text
https://wa.me/<international-number>?text=<url-encoded-message>
```

The official WhatsApp number is stored in the `DEMO_WHATSAPP_NUMBER` constant in `src/main.js`. It is not rendered as visible phone text. General contact buttons send an enquiry message. Product buttons include the product name, SKU, and price. Cart buttons include selected products and quantities. Checkout collects the customer form details locally, creates a readable order message, and redirects to WhatsApp. No order is written to the server and no payment is collected.

When replacing the number, use international digits only: no `+`, spaces, brackets, or dashes. Keep the number out of visible markup unless the business owner explicitly changes that requirement.

## 11. Delivery rules currently implemented

- Free same-day delivery is advertised only across Lahore.
- Checkout currently offers Lahore as the selectable city.
- Islamabad and the earlier multi-city delivery copy were removed.
- If delivery coverage changes later, update the top strip, product detail benefit text, specifications copy, checkout city options, and WhatsApp message copy together.

## 12. Images and branding

The supplied Maqsood Fans logo is stored at `public/assets/maqsood-logo.jpeg` and is used in the storefront header/footer and admin header. `app.config.ts` also contains the durable HTTPS logo URL used for project branding.

The demo catalogue contains several direct `images.unsplash.com` hotlinks. Keep Unsplash CDN URLs embedded rather than downloading/rehosting them if continuing to use the Unsplash API ecosystem, and retain appropriate image attribution/usage compliance. Replace demo imagery with owned product photography before commercial launch.

## 13. Production deployment

`Dockerfile` installs dependencies, builds the Vite frontend, and starts `server/server.js` on `PORT` (default `3000`). The health check endpoint is `/api/health`.

Before deployment:

1. Set a production `DATABASE_URL` using the hosting provider's secret manager.
2. Set `PORT` if the platform requires a specific port.
3. Run `npm ci` and `npm run build` in CI.
4. Start with `npm start` or build the provided Dockerfile.
5. Confirm `/api/health` returns HTTP 200.
6. Point the desired subdomain DNS record to the hosting platform and enable HTTPS.
7. Add production authentication and authorization to all `/api/admin/*` routes and `/admin` before public launch.
8. Add rate limiting, input validation, audit logging, backups, and a database migration process before handling real business data.

The current demo admin is intentionally open for testing and is **not production-safe**. Do not publish it unchanged.

## 14. Recommended security work before launch

- Add owner authentication and an admin role check to every admin API route.
- Protect the admin page and avoid exposing catalogue mutation endpoints anonymously.
- Validate and sanitize all product/review fields server-side.
- Restrict allowed image URL schemes and hosts if required by the business.
- Add CSRF protection if cookie authentication is introduced.
- Add request rate limits and structured server logging.
- Use HTTPS only and store database credentials in platform secrets.
- Back up the MySQL database before migrations or bulk catalogue changes.
- Confirm WhatsApp order handling and delivery policy with the business owner.

## 15. Final verification checklist

```bash
npm run build
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products
curl http://localhost:3000/api/reviews
```

Then manually verify home, products, product detail, every gallery thumbnail, desktop hover zoom, mobile tap lightbox, reviews tab, specifications tab, cart quantity controls, sold-out behavior, checkout validation, WhatsApp contact action, and admin product/review CRUD.
