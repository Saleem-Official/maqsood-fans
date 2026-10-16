# Storefront Pages, Routing, and Interactive Features

> Source: src/main.js, public/manus-routes.json, index.html
> Collected: 2026-10-16
> Published: 2026-10-16

## Storefront Route Map

The application employs a custom client-side router powered by the HTML5 History API (pushState and popstate) rendering dynamic views without page reloads:

- `/` — Home Page: Hero branding banner ("Cooler Homes, Happier Lives"), feature value strip (Modern Designs, High Performance, Durable Quality, Trusted by Families), popular ceiling fan collection grid (Royal Plus, Classic Pro, Elite Series, Wooden Touch), promotional discount banner ("Up to 30% OFF"), brand story / promise section ("Made for the way you live"), and comprehensive footer.
- `/products` — Products Catalogue Page: Hero title, category radio filter list (All fans, Premium, Designer, Natural, Everyday), in-stock and on-sale availability checkboxes, expert WhatsApp consultation card, catalog toolbar with count and sort select (Featured, Price: low to high, Price: high to low), and responsive product card grid.
- `/products/:id` — Product Detail Page: Dynamic breadcrumb, multi-image interactive thumbnail gallery, desktop cursor-following zoom, mobile tap fullscreen lightbox with backdrop click and Escape key dismissal, product title, SKU, star rating, verified review link jumping to reviews tab, price comparison (sale price vs old price), availability badge (In stock · Ready to dispatch vs Currently sold out), interactive quantity selector (+ / -), Add to Cart button (disabled when sold out), Order on WhatsApp direct button, 3-point reassurance strip (Free delivery, 1 year warranty, Expert support), tabbed info panels (Description, Specifications, Customer Reviews), and related fans recommendations grid.
- `/cart` — Cart Overview Page: Dynamic line items listing, product thumbnail, SKU, colorway, unit price, quantity increment / decrement controls, trash icon removal, continue shopping link, Order Summary card (Subtotal, Delivery: Free, Cart status: Saved in browser, Total), and "Proceed to Checkout" CTA. If empty, renders an empty state illustration with an "Explore fans" button.
- `/checkout` — Checkout Presentation Page: Direct order heading, customer details form (Full Name, WhatsApp Number, City dropdown with Lahore, Complete Delivery Address, Order Notes), "Place Order on WhatsApp" button, and order summary card displaying selected fans, quantities, and totals.
- `/admin` — Catalogue administration panel route (also accessible directly when browsing from an admin subdomain).

## Interactive Components & Behaviors

1. Desktop Image Zoom:
   - Elements with .zoomable track mouse movement (mouseenter, mousemove, mouseleave).
   - Dynamically calculates relative position percentages (--zoom-x and --zoom-y) for smooth image magnification.

2. Mobile Fullscreen Lightbox:
   - Tap/click opens a full-screen high-resolution modal (.image-lightbox).
   - Dismissible via close button, backdrop click, or keyboard Escape key.

3. Tabbed Specifications & Reviews:
   - Three tabs: Description, Specifications, and Customer Reviews.
   - Verified buyer badge with checkmark icon on review cards.
   - Direct anchor jump from header rating score to reviews tab.

4. Search Panel & Filter System:
   - Header search toggle opens an expandable search input panel.
   - Real-time text filtering against fan titles, finishes, and models.
   - Category radio selectors filter the visible product set instantly.
   - Sorter rearranges items by price low-to-high, high-to-low, or original featured order.

5. Toast Notifications:
   - Transient feedback alert on item save, addition, or removal.
   - Styled with green checkmark icon, entering with CSS transition and auto-dismissing after 2600ms.
