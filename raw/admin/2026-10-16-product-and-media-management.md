# Product and Media Management Architecture

> Source: src/admin.js
> Collected: 2026-10-16
> Published: 2026-10-16

## Product Editor Field Specification

The product editor contains 18 configurable attributes formatted as responsive input fields, select dropdowns, textareas, and file uploaders:

1. `id`: Slug / unique ID (text, required).
2. `sku`: SKU model identifier (text, required).
3. `name`: Product title (text, required).
4. `price`: Sale price in Rs. (number, required).
5. `oldPrice`: Original price in Rs. (number, required).
6. `discount`: Discount label dropdown (select: "", "15% OFF", "20% OFF", "25% OFF", "30% OFF", "New").
7. `rating`: Rating dropdown (select: "4", "4.5", "4.6", "4.7", "4.8", "4.9", "5").
8. `reviews`: Review count (number, required).
9. `image`: Primary image (image uploader / URL, required).
10. `image2`: Additional image 2 (image uploader / URL, optional).
11. `image3`: Additional image 3 (image uploader / URL, optional).
12. `image4`: Additional image 4 (image uploader / URL, optional).
13. `category`: Collection dropdown (select: "Premium", "Designer", "Natural", "Everyday").
14. `stockStatus`: Availability dropdown (select: "in_stock" -> In stock, "out_of_stock" -> Out of stock / Sold out).
15. `color`: Finish / color dropdown (select: "Ivory", "Black / Gold", "Pearl White", "Walnut", "Champagne Gold", "Snow White").
16. `blades`: Blade configuration dropdown (select: "3 blade", "4 blade", "5 blade").
17. `size`: Sweep diameter dropdown (select: "48 inch", "52 inch", "56 inch").
18. `description`: Detailed description (textarea, required).

## Image Upload & Client-Side Canvas Compression Pipeline

To support direct product image uploads without requiring costly external S3 buckets or third-party image hosting services:

1. File Picker:
   - `<input type="file" accept="image/*" class="admin-file-picker" />`
   - Styled with a clean button: "📁 Upload image".

2. Canvas Compression Engine:
   - Utilizes browser `FileReader` to load the file as a Data URL.
   - Instantiates an off-screen `HTMLImageElement`.
   - Dimension Limiting: Evaluates natural width and height against a `maxDim = 1200` threshold. Aspect ratio is preserved.
   - Off-screen Rendering: Draws the resized image onto an `HTMLCanvasElement`.
   - JPEG Compression: Exports via `canvas.toDataURL('image/jpeg', 0.82)`.
   - Result: High-resolution images (commonly 5MB-15MB from cameras or smartphones) are compressed to compact 80KB-160KB data URIs.

3. Instant Preview & URL Support:
   - Injects the compressed data URI directly into the text input (`#input-${key}`).
   - Immediately renders an interactive thumbnail preview (`#thumb-${key}`).
   - Administrators can also paste standard HTTPS URLs directly; the preview verifies URL validity dynamically with error fallbacks.
