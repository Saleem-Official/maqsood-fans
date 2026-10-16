# WhatsApp Direct Ordering and Delivery Rules

> Source: src/main.js, docs/whatsapp-link.md, DEVELOPER_HANDOFF.md
> Collected: 2026-10-16
> Published: 2026-10-16

## WhatsApp Direct Ordering Workflow

To eliminate friction, cart abandonment, and payment gateway costs, the storefront employs direct WhatsApp ordering for all customer purchase flows.

### WhatsApp Target Number

- Constant: `DEMO_WHATSAPP_NUMBER = '923234464246'` in `src/main.js`.
- Security & UI Privacy: The number is maintained in code and is not rendered as plaintext on public pages, protecting against scraping and spam.
- URL Format: `https://wa.me/<international-number>?text=<url-encoded-message>`

### Message Types & Templates

1. General Enquiry Message:
   ```text
   Assalam-o-Alaikum Maqsood Fans, I would like to know more about your ceiling fans.
   ```

2. Product Detail Order Message:
   ```text
   Assalam-o-Alaikum Maqsood Fans, I am interested in the {product.name} ({product.sku}) ceiling fan priced at {price}. Please share availability and delivery details.
   ```

3. Cart Order Message:
   ```text
   Assalam-o-Alaikum Maqsood Fans,

   I would like to order:
   - {Product 1} ({SKU 1}) x {Qty} — {Total 1}
   - {Product 2} ({SKU 2}) x {Qty} — {Total 2}

   Estimated total: {Total}

   Please confirm availability and delivery details.
   ```

4. Checkout Order Message:
   ```text
   Assalam-o-Alaikum Maqsood Fans,

   I would like to place an order.

   Products:
   - {Product Line 1}
   - {Product Line 2}

   Customer details:
   Name: {Full Name}
   WhatsApp: {Phone}
   City: {City}
   Address: {Complete Address}
   Notes: {Special Instructions}

   Estimated total: {Total}

   Please confirm availability and delivery timing.
   ```

## Delivery Policy and Geographic Scope

- Free Same-Day Delivery: Exclusively offered across Lahore, Pakistan.
- Checkout Form Scope: Selectable city dropdown is intentionally restricted to Lahore.
- Operational Hours: Mon–Sat, 10am–7pm.
