# Client-Side Local Storage Cart System

> Source: src/main.js
> Collected: 2026-10-16
> Published: 2026-10-16

## Persistent Cart Engine Specification

The cart engine maintains client-side persistence through the browser's `localStorage` API, ensuring user selections survive page refreshes, back/forward browser navigation, tab closures, and multi-day browser sessions across all modern desktop and mobile browsers (Chrome, Safari, Edge, Firefox).

### Storage Architecture

- Storage Key: `maqsood_cart`
- Serialized Format: JSON array of cart items:
  ```json
  [
    {
      "id": "classic-pro",
      "qty": 2,
      "product": { ... }
    }
  ]
  ```

### Functional Implementations

1. `loadSavedCart()`:
   - Reads `localStorage.getItem('maqsood_cart')`.
   - Parses the JSON payload safely within a try/catch block.
   - For each item, verifies product existence using `findProduct(item.id || item.product?.id)` or preserves custom product data.
   - Enforces a minimum quantity of 1 (`Math.max(1, Number(item.qty || 1))`).
   - Returns the hydrated cart array or empty array `[]` on missing/corrupt data.

2. `saveCartToStorage()`:
   - Maps `state.cart` to extract product ID, quantity, and complete product payload.
   - Serializes the array to a JSON string and writes to `localStorage.setItem('maqsood_cart', ...)`.
   - Protected with try/catch to gracefully handle environments where storage quotas or private browsing restrictions exist.

3. Cart Mutation Integration Points:
   - `addToCart(id, quantity)`: Checks for existing items in `state.cart`. If found, increments `item.qty`; otherwise pushes new line item. Calls `saveCartToStorage()`, re-renders the UI, and triggers a toast notification stating that the product has been saved to cart.
   - Quantity Adjustment (`data-cart-qty`): Handlers for `plus` and `minus` buttons alter line item counts. When quantity drops below 1, the item is removed. Immediately invokes `saveCartToStorage()`.
   - Item Removal (`data-remove`): Filters the item from `state.cart`, calls `saveCartToStorage()`, re-renders the cart view, and displays a toast message.
   - Catalog Hydration (`hydrateCatalog()`): When fresh product data is fetched from the backend API `/api/products`, existing cart items have their references updated to the latest product specifications and pricing without erasing user quantities, followed by an immediate call to `saveCartToStorage()`.

4. Visual Feedback:
   - Header badge reflects total items: `state.cart.reduce((sum, item) => sum + item.qty, 0)`.
   - Cart summary card explicitly displays: `Cart status: Saved in browser`.
