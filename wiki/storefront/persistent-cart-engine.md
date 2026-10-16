# Persistent Cart Engine

> Sources: Maqsood Fans Engineering, 2026-10-16
> Raw: [Client-Side Local Storage Cart System](../../raw/storefront/2026-10-16-local-storage-cart-system.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans cart engine utilizes the browser's native `localStorage` API to provide persistent cart state without requiring user login, database sessions, or server-side shopping cart storage. Customer selections are preserved across browser refreshes, tab closures, and multi-day browsing sessions.

## Storage Specifications

- Storage Key: `maqsood_cart`
- Data Structure: Array of JSON objects containing product identifier, item quantity, and complete product payload.

```json
[
  {
    "id": "classic-pro",
    "qty": 2,
    "product": { ... }
  }
]
```

## Core Functions

### 1. `loadSavedCart()`
- Invoked on initial script load to hydrate `state.cart`.
- Reads `localStorage.getItem('maqsood_cart')`.
- Validates the array and matches product IDs against active catalog data via `findProduct()`.
- Enforces a minimum quantity of 1 (`Math.max(1, Number(item.qty || 1))`).
- Safe execution: Wrapped in a try/catch block returning `[]` on missing or invalid data.

### 2. `saveCartToStorage()`
- Serializes `state.cart` into a JSON string and writes to `localStorage.setItem('maqsood_cart', ...)`.
- Invoked synchronously on every state-altering user interaction:
  - Adding a product to cart (`addToCart`)
  - Incrementing or decrementing quantity (+ / - controls)
  - Deleting an item from the cart (`data-remove`)
  - Catalog updates during `/api/products` hydration

### 3. Catalog Hydration Synchronization
- When the application fetches updated products from `/api/products`, `hydrateCatalog()` iterates over `state.cart`.
- It updates product titles, prices, images, and availability to match the latest catalogue without modifying the customer's selected quantities.
- Immediately calls `saveCartToStorage()` to persist the refreshed data.

## Customer UI & Visual Cues

- Header Cart Badge: Dynamically computes total quantity across all cart items.
- Order Summary Card: Includes an explicit `Cart status: Saved in browser` line item confirming that selections are preserved locally.
- Action Feedback: Displays a toast notification upon item addition confirming the product is saved to cart.

## See Also

- [Storefront Pages and User Journey](pages-and-user-journey.md)
- [Design System and Visual Tokens](design-system-and-visual-tokens.md)
- [WhatsApp Checkout Integration](../deployment/whatsapp-checkout-integration.md)
