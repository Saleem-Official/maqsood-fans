# TODO

## Responsive frontend storefront
- Build a frontend-only ceiling fan storefront inspired by the supplied reference image.
- Match the warm beige, white, dark charcoal, and brass-gold palette and premium home-appliance aesthetic.
- Include responsive Home, Products, Product Detail, Cart, and Checkout UI screens/routes.
- Include compact responsive header, brand identity, navigation, cart access, and accessible mobile menu.

## Product browsing and detail UI
- Show reusable product cards with fan imagery, product name, price, concise details, discount badges, ratings, and presentational links.
- Provide product listing browsing controls such as category, sorting, and filter UI.
- Provide product detail gallery, specifications, price, quantity selector, and presentational Add to Cart interaction.

## Cart and checkout presentation
- Provide cart line items, quantity controls, remove actions, order summary, and empty-cart presentation.
- Provide checkout UI with customer, delivery, notes, and order-summary fields.
- Keep all controls presentational only: no sign-up, sign-in, user accounts, payment gateway, real checkout, or order submission.
- Include WhatsApp-style order CTAs across relevant shopping screens.

## Quality and delivery
- Use semantic controls, accessible focus states, keyboard-friendly interactions, reusable components, and responsive desktop/mobile layouts.
- Serve `/manus-routes.json` with the complete route set.

## Demo catalogue administration
- Keep the storefront free of customer signup, sign-in, and payment; provide a separate `/admin` testing route without authentication so every workflow can be checked before the owner's auth layer is added.
- Persist product records in the managed MySQL database so admin changes survive restarts and are reflected on the storefront.
- Allow product add, edit, and delete for slug, SKU, name, prices, discount, rating, review count, image URL, category, finish detail, blade detail, size, and description.
- Allow review add, edit, and delete with product, reviewer name, date label, rating, and review text.
- Allow admin to select ceiling-fan category, discount, rating, availability, finish, blade count, and size from dropdowns; availability must support In stock and Out of stock / Sold out.
- Show sold-out status on product cards and product detail pages, and prevent sold-out products from being added to cart.
- Allow each product to store one primary image plus three optional additional image URLs, with all available images shown in the detail gallery.
- Support desktop hover zoom plus mobile tap-to-open fullscreen image zoom with close and Escape controls.
- Keep the production server and `/api/health` endpoint ready for container deployment and future subdomain mapping.
