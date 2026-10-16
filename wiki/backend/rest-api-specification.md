# REST API Specification

> Sources: Maqsood Fans Backend Team, 2026-10-16
> Raw: [Backend Express API and Database Pipeline](../../raw/backend/2026-10-16-express-api-and-database-pipeline.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans REST API provides endpoints for catalogue querying, customer reviews, admin authentication, and product mutation. Implemented in Express 5, the API is exposed on `/api/*` and operates with a 20MB payload limit to support base64 image uploads.

## API Endpoint Reference

### Public Endpoints

#### 1. Service Health Probe
- Route: `GET /api/health`
- Description: Verifies backend service status.
- Response Status: `200 OK`
- Payload:
  ```json
  { "ok": true }
  ```

#### 2. Products List
- Route: `GET /api/products`
- Description: Returns active ceiling fan models for storefront browsing.
- Response Status: `200 OK`
- Payload: Array of product objects.

#### 3. Reviews List
- Route: `GET /api/reviews`
- Optional Parameter: `productId` (e.g., `/api/reviews?productId=classic-pro`)
- Description: Returns customer reviews. If `productId` is supplied, filters results to that specific fan model.
- Response Status: `200 OK`
- Payload: Array of review objects.

### Admin Endpoints

#### 4. Password Verification
- Route: `POST /api/admin/verify-password`
- Description: Validates admin password.
- Request Body:
  ```json
  { "password": "..." }
  ```
- Response Status: `200 OK`
- Payload:
  ```json
  { "valid": true }
  ```

#### 5. Change Password
- Route: `POST /api/admin/change-password`
- Description: Updates the admin password.
- Request Body:
  ```json
  { "currentPassword": "...", "newPassword": "..." }
  ```
- Validation: Requires current password match and minimum 3-character new password.
- Responses:
  - `200 OK` → `{ "success": true }`
  - `401 Unauthorized` → `{ "error": "Current password is incorrect" }`
  - `400 Bad Request` → `{ "error": "New password must be at least 3 characters" }`

#### 6. Admin Products Management
- List All: `GET /api/admin/products` → `200 OK` (includes in-stock and out-of-stock models).
- Create Product: `POST /api/admin/products` → `201 Created`
- Update Product: `PUT /api/admin/products/:id` → `200 OK`
- Delete Product: `DELETE /api/admin/products/:id` → `204 No Content`

#### 7. Admin Reviews Management
- List All: `GET /api/admin/reviews` → `200 OK`
- Create Review: `POST /api/admin/reviews` → `201 Created`
- Update Review: `PUT /api/admin/reviews/:id` → `200 OK`
- Delete Review: `DELETE /api/admin/reviews/:id` → `204 No Content`

## Error Handling

All uncaught exceptions in route handlers pass to Express error middleware returning structured JSON with HTTP status 500:
```json
{ "error": "Something went wrong. Please try again." }
```

## See Also

- [Database Architecture and In-Memory Fallback](database-architecture-and-in-memory-fallback.md)
- [Admin Portal and Password Security](../admin/admin-portal-and-password-security.md)
- [Vercel Cloud and Subdomains](../deployment/vercel-cloud-and-subdomains.md)
