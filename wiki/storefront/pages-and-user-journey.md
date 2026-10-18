# Storefront Pages and User Journey

> Sources: Maqsood Fans Frontend Team, 2026-10-16
> Raw: [Storefront Pages, Routing, and Interactive Features](../../raw/storefront/2026-10-16-storefront-pages-and-interactions.md)
> Updated: 2026-10-16

## Overview

The customer-facing storefront is a single-page application (SPA) designed to provide an instant, elegant shopping journey from initial brand discovery to WhatsApp order fulfillment. All views update dynamically via the HTML5 History API without disruptive full-page reloads.

## Pages & User Flow

### 1. Home Page (`/`)
- Hero Section: Editorial imagery with branding copy ("Cooler Homes, Happier Lives"), subtitle, and primary "Shop Now" call to action.
- Value Proposition Strip: 4 key brand assurances (Modern Designs, High Performance, Durable Quality, Trusted by Families).
- Curated Collection: Popular 4-card ceiling fan showcase linking directly to product detail pages.
- Special Offer Banner: Highlighted seasonal promotion ("Up to 30% OFF") with direct catalog shopping link.
- Brand Story: "Made for the way you live" section highlighting energy efficiency, motors, and customer support.
- Footer: Complete navigation, warranty details, store hours (Mon–Sat, 10am–7pm), and direct WhatsApp contact.

### 2. Products Catalogue (`/products`)
- Category Filtering: Radio button selectors (All fans, Premium, Designer, Natural, Everyday).
- Stock Status: Checkbox selectors for in-stock and sale items.
- Dynamic Sorting: Sorter reorganizes models by Featured order, Price: low to high, or Price: high to low.
- Search Integration: Real-time query matching across model titles, finishes, and specs.
- Product Cards: Visual cards displaying fan image, discount badge, heart save button, model title, SKU, rating score, price comparison, and Add to Cart action.

### 3. Product Detail Page (`/products/:id`)
- Image Gallery: Multi-thumbnail selector switching the main photo instantly.
- Desktop Hover Zoom: Responsive image scaling tracking mouse coordinates (--zoom-x and --zoom-y).
- Mobile Tap Lightbox: Fullscreen modal displaying uncompressed product imagery with close and Escape controls.
- Interactive Controls: Quantity stepper (+ / -), Add to Cart button (disabled when product is sold out), and WhatsApp direct enquiry button.
- Reassurance Grid: Same-day delivery across Lahore, 1-year motor and body warranty, and expert support.
- Tabbed Information: Description, Specifications table (size, blades, motor, speed settings, remote, finish), and Customer Reviews with verified buyer badges.

### 4. Cart Overview (`/cart`)
- Line Item Management: Detailed rows showing product thumbnail, name, SKU, finish, unit price, quantity controls, total calculation, and delete button.
- Local Storage Persistence: Preserves all added items across browser sessions, reloads, and tab closures.
- Order Summary: Clear breakdown of subtotal, free delivery notice, "Saved in browser" indicator, and total amount.
- Direct Checkout: Seamless transition to the checkout details form.

### 5. Checkout Presentation (`/checkout`)
- Customer Details: Simple form capturing Full Name, WhatsApp Number, City (editable dropdown with Lahore and custom entry support), Complete Delivery Address, and optional Order Notes.
- Order Preview: Compact summary showing selected fan thumbnails, quantities, and order total.
- Direct Order Redirect: Assembles a formatted order message and launches WhatsApp directly.

## See Also

- [Persistent Cart Engine](persistent-cart-engine.md)
- [Design System and Visual Tokens](design-system-and-visual-tokens.md)
- [WhatsApp Checkout Integration](../deployment/whatsapp-checkout-integration.md)
