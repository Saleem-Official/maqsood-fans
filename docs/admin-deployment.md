# Maqsood Fans demo admin

## Testing endpoint

- Open `/admin` on the preview or deployed site.
- No authentication is intentionally applied in this testing version.
- Use **Add product** to create a complete catalogue record, edit existing products, or delete a product.
- Use the dropdowns for the current ceiling-fan categories (Premium, Designer, Natural, Everyday), discounts, ratings, finish, blade count, size, and availability.
- Set availability to **Out of stock / Sold out** to show a sold-out badge and disable Add to Cart on the storefront; switch back to **In stock** to restore ordering.
- Add one primary image URL plus up to three additional image URLs; all saved images appear as selectable thumbnails on the product detail page.
- Use **Add review** to attach a customer review to any product; reviews can also be edited and deleted.
- Product and review records persist in the managed MySQL database and storefront pages load them from the API.

## Important before going live

This admin endpoint is deliberately open so the owner can test every workflow. Add the owner's authentication and authorization middleware before mapping a public subdomain. The server is already separated into API routes so that protection can be added without changing the admin UI.

`Dockerfile` runs the production server on `PORT` (default `3000`) and `/api/health` is configured as the container health path.
