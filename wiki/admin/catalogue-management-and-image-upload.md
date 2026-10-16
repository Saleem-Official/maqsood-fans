# Catalogue Management and Image Upload

> Sources: Maqsood Fans Core Development, 2026-10-16
> Raw: [Product and Media Management Architecture](../../raw/admin/2026-10-16-product-and-media-management.md)
> Updated: 2026-10-16

## Overview

The catalogue administration panel provides an end-to-end interface for creating, modifying, and removing fan models and customer reviews. It features an automated client-side canvas compression pipeline enabling direct image uploads without requiring external image hosting services.

## Product Form Configuration

The product form (`#admin-product-form`) contains 18 comprehensive fields:
- `id`: Slug / identifier (e.g., `royal-plus`).
- `sku`: SKU model code (e.g., `MF-1001`).
- `name`: Product name.
- `price` & `oldPrice`: Numerical pricing in Rs.
- `discount`: Dropdown ("", "15% OFF", "20% OFF", "25% OFF", "30% OFF", "New").
- `rating`: Star rating dropdown ("4", "4.5", "4.6", "4.7", "4.8", "4.9", "5").
- `reviews`: Total review count.
- `image`: Primary hero image uploader & URL field.
- `image2`, `image3`, `image4`: Additional gallery angle uploaders & URL fields.
- `category`: Dropdown ("Premium", "Designer", "Natural", "Everyday").
- `stockStatus`: Dropdown ("in_stock" -> In stock, "out_of_stock" -> Out of stock / Sold out).
- `color`: Finish dropdown ("Ivory", "Black / Gold", "Pearl White", "Walnut", "Champagne Gold", "Snow White").
- `blades`: Blade detail dropdown ("3 blade", "4 blade", "5 blade").
- `size`: Sweep size dropdown ("48 inch", "52 inch", "56 inch").
- `description`: Textarea for marketing and technical specs.

## Client-Side Image Upload & Compression Pipeline

To allow direct file selection from local computers or mobile devices while keeping payloads lightweight:

1. HTML5 File Picker:
   - `<input type="file" accept="image/*" class="admin-file-picker" />` triggers file selection.
2. In-Browser Image Resizing:
   - Evaluates natural image dimensions against a `maxDim = 1200` bounding box.
   - Preserves native aspect ratio while scaling large images down.
3. Canvas JPEG Encoding:
   - Renders the resized image onto an off-screen HTML canvas element.
   - Encodes via `canvas.toDataURL('image/jpeg', 0.82)`.
   - Compresses large multi-megabyte photos to clean, high-clarity 80KB-160KB data URIs.
4. Input Population & Live Thumbnail Preview:
   - Injects the compressed data URI directly into the form input.
   - Renders an instant square thumbnail preview with error handling.

## Customer Reviews Management

- Form allows adding and editing reviews with Product selection, Reviewer Name, Date Label, Numerical Rating (1 to 5), and Review Text.
- Table listing displays star representations (`★` and `☆`), reviewer names, and delete confirmations.

## Client-Side Fallback Caching

When running in serverless or offline environments:
- Product and review mutations persist to `localStorage` (`maqsood_admin_products` and `maqsood_admin_reviews`).
- The admin workspace renders immediately upon save without waiting for database roundtrips.

## See Also

- [Admin Portal and Password Security](admin-portal-and-password-security.md)
- [Product Catalogue and Technical Specifications](../catalogue/product-catalogue-and-specifications.md)
- [REST API Specification](../backend/rest-api-specification.md)
