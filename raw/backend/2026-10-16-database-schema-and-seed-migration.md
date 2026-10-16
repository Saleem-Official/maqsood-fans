# Database Schema, Migrations, and Seed Architecture

> Source: server/db.js
> Collected: 2026-10-16
> Published: 2026-10-16

## Relational Schema (MySQL 8 Compatible)

When `DATABASE_URL` is configured, `initDb()` executes DDL statements to ensure all tables, columns, and seed records exist.

### 1. `products` Table

```sql
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(80) PRIMARY KEY,
  sku VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  price INT NOT NULL,
  old_price INT NOT NULL,
  discount VARCHAR(40) NOT NULL DEFAULT '',
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  reviews_count INT NOT NULL DEFAULT 0,
  image LONGTEXT NOT NULL,
  image_2 LONGTEXT NULL,
  image_3 LONGTEXT NULL,
  image_4 LONGTEXT NULL,
  category VARCHAR(100) NOT NULL,
  color VARCHAR(100) NOT NULL DEFAULT '',
  blades VARCHAR(80) NOT NULL DEFAULT '',
  size VARCHAR(80) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  stock_status VARCHAR(30) NOT NULL DEFAULT 'in_stock',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Automated Column Migrations:
- `ALTER TABLE products ADD COLUMN stock_status VARCHAR(30) NOT NULL DEFAULT 'in_stock'`
- `ALTER TABLE products MODIFY COLUMN image LONGTEXT NOT NULL`
- `ALTER TABLE products ADD COLUMN image_2 LONGTEXT NULL` (and image_3, image_4)
- `ALTER TABLE products MODIFY COLUMN image_2 LONGTEXT NULL` (and image_3, image_4)

### 2. `product_reviews` Table

```sql
CREATE TABLE IF NOT EXISTS product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  review_date VARCHAR(80) NOT NULL,
  rating INT NOT NULL,
  review_text TEXT NOT NULL,
  seed_key VARCHAR(180) UNIQUE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(product_id)
);
```

### 3. `site_settings` Table

```sql
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Seeding & Default State

- Default Admin Password: `'maqsood123'` stored under `setting_key = 'admin_password'` using `INSERT IGNORE`.
- Initial Products: 9 seed products from `src/data.js` inserted with `INSERT IGNORE` to prevent overwriting existing catalog records.
- Initial Reviews: 24 customer reviews inserted with deterministic `seed_key` (`${productId}-seed-${index}`) via `INSERT IGNORE`.
- In-Memory Fallback: When offline or unconfigured, mirrors all columns, types, and mappings seamlessly in JavaScript arrays.
