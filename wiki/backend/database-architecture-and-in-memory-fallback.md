# Database Architecture and In-Memory Fallback

> Sources: Maqsood Fans Core Engineering, 2026-10-16
> Raw: [Database Schema, Migrations, and Seed Architecture](../../raw/backend/2026-10-16-database-schema-and-seed-migration.md); [Backend Express API and Database Pipeline](../../raw/backend/2026-10-16-express-api-and-database-pipeline.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans data layer features a hybrid storage architecture: an automated MySQL 8 relational schema for production database deployments and an internal in-memory store for serverless environments (such as Vercel) where `DATABASE_URL` is absent. This design ensures that the entire application and admin catalogue workspace remain 100% operational with zero 500 runtime crashes.

## Relational MySQL Schema

When `DATABASE_URL` is configured, `server/db.js` initializes connection pooling via `mysql2/promise` and verifies three tables:

### 1. `products` Table
- `id VARCHAR(80) PRIMARY KEY`: Unique product slug.
- `sku VARCHAR(80) NOT NULL`: Model identifier.
- `name VARCHAR(160) NOT NULL`: Display title.
- `price INT NOT NULL`, `old_price INT NOT NULL`: Pricing in Pakistani Rupees.
- `discount VARCHAR(40) NOT NULL DEFAULT ''`: Promotional badge text.
- `rating DECIMAL(3,1) NOT NULL DEFAULT 0`: Rating score.
- `reviews_count INT NOT NULL DEFAULT 0`: Verified review count.
- `image LONGTEXT NOT NULL`: Primary image (URL or Base64 data URI).
- `image_2`, `image_3`, `image_4 LONGTEXT NULL`: Additional image angles.
- `category VARCHAR(100) NOT NULL`: Collection classification.
- `color VARCHAR(100) NOT NULL DEFAULT ''`: Finish details.
- `blades VARCHAR(80) NOT NULL DEFAULT ''`: Blade configuration.
- `size VARCHAR(80) NOT NULL DEFAULT ''`: Sweep diameter.
- `description TEXT NOT NULL`: Marketing and technical description.
- `stock_status VARCHAR(30) NOT NULL DEFAULT 'in_stock'`: Inventory status.
- `created_at`, `updated_at TIMESTAMP`: Temporal timestamps.

### 2. `product_reviews` Table
- `id INT AUTO_INCREMENT PRIMARY KEY`: Numeric review ID.
- `product_id VARCHAR(80) NOT NULL`: Foreign key referencing product ID.
- `name VARCHAR(160) NOT NULL`: Reviewer name.
- `review_date VARCHAR(80) NOT NULL`: Date label.
- `rating INT NOT NULL`: Rating (1 to 5).
- `review_text TEXT NOT NULL`: Review text.
- `seed_key VARCHAR(180) UNIQUE NULL`: Deduplication key.

### 3. `site_settings` Table
- `setting_key VARCHAR(80) PRIMARY KEY`: Configuration key (e.g., `admin_password`).
- `setting_value TEXT NOT NULL`: Value string.
- Initial seed: `admin_password = 'maqsood123'`.

## Dynamic Driver Loading

Rather than importing `mysql2/promise` statically at module evaluation time, `server/db.js` dynamically loads the driver on demand:
```javascript
async function getMysql() {
  if (!mysql) {
    try {
      const mod = await import('mysql2/promise');
      mysql = mod.default || mod;
    } catch (err) {
      console.warn('mysql2 module is not available:', err.message);
      return null;
    }
  }
  return mysql;
}
```
If `DATABASE_URL` is omitted, the driver is never evaluated, avoiding missing dependency errors on environments without local database binaries.

## In-Memory Database Store

When `DATABASE_URL` is absent or connection attempts fail:
- Products: `memoryProducts` array initialized with all 9 seed models.
- Reviews: `memoryReviews` array initialized with all 24 verified reviews.
- Password: `memoryPassword` variable initialized to `'maqsood123'`.
- All CRUD operations (Listing, Adding, Editing, Deleting, and Password changes) execute against memory, returning standard HTTP 200/201/204 responses.

## See Also

- [REST API Specification](rest-api-specification.md)
- [Admin Portal and Password Security](../admin/admin-portal-and-password-security.md)
- [Vercel Cloud and Subdomains](../deployment/vercel-cloud-and-subdomains.md)
