# Backend Express API and Database Pipeline

> Source: server/app.js, server/db.js, api/index.js, DEVELOPER_HANDOFF.md
> Collected: 2026-10-16
> Published: 2026-10-16

## Backend Architecture

The backend is built with Express 5 using standard ES module syntax. It serves both as a standalone HTTP microservice and as a serverless API handler on Vercel via `api/index.js`. The request parser is configured to accept JSON and urlencoded payloads up to 20MB (`limit: '20mb'`) to accommodate base64 image uploads.

## API Endpoints Specification

### Public Endpoints

1. `GET /api/health`
   - Purpose: Service health and readiness probe.
   - Response: `200 OK` → `{ "ok": true }`

2. `GET /api/products`
   - Purpose: Catalogue feed for storefront listing and filtering.
   - Response: `200 OK` → JSON array of active product records.

3. `GET /api/reviews`
   - Purpose: Customer reviews feed. Supports optional query parameter `productId` (e.g., `/api/reviews?productId=classic-pro`).
   - Response: `200 OK` → JSON array of matching review records.

### Admin Endpoints

4. `POST /api/admin/verify-password`
   - Purpose: Verifies admin password without session tokens or cookies.
   - Body: `{ "password": "..." }`
   - Response: `200 OK` → `{ "valid": true }` or `{ "valid": false }`

5. `POST /api/admin/change-password`
   - Purpose: Updates master admin password.
   - Body: `{ "currentPassword": "...", "newPassword": "..." }`
   - Validation: Verifies current password; enforces minimum length of 3 characters.
   - Response: `200 OK` → `{ "success": true }`, `401 Unauthorized` on bad password, or `400 Bad Request` on short password.

6. `GET /api/admin/products`
   - Purpose: Complete catalogue list including draft and out-of-stock items.
   - Response: `200 OK` → Product records array.

7. `POST /api/admin/products`
   - Purpose: Creates a new product record.
   - Body: Product payload matching schema.
   - Response: `201 Created` → Created product record.

8. `PUT /api/admin/products/:id`
   - Purpose: Updates an existing product record by ID.
   - Body: Partial or full product payload.
   - Response: `200 OK` → Updated product record.

9. `DELETE /api/admin/products/:id`
   - Purpose: Deletes a product from the database or in-memory store.
   - Response: `204 No Content`

10. `GET /api/admin/reviews`
    - Purpose: Retrieves all customer reviews across all products.
    - Response: `200 OK` → Array of all reviews.

11. `POST /api/admin/reviews`
    - Purpose: Creates a new customer review.
    - Body: `{ "productId": "...", "name": "...", "date": "...", "rating": 5, "text": "..." }`
    - Response: `201 Created` → Created review record.

12. `PUT /api/admin/reviews/:id`
    - Purpose: Updates a review by numerical ID.
    - Response: `200 OK` → Updated review record.

13. `DELETE /api/admin/reviews/:id`
    - Purpose: Deletes a review record.
    - Response: `204 No Content`

## Database Connection & Fallback Design

- Driver: `mysql2/promise` loaded dynamically via `import('mysql2/promise')` inside `getPool()` and `initDb()`.
- Connection Pool: Initialized only when `process.env.DATABASE_URL` is set.
- Resilient In-Memory Fallback: When `DATABASE_URL` is not provided or if MySQL connection fails, the system executes all operations against internal memory structures (`memoryProducts`, `memoryReviews`, `memoryPassword`) initialized with the complete seed dataset.
- The server never throws uncaught 500 exceptions due to missing connection strings.
