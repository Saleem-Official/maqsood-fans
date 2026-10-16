# WhatsApp Checkout Integration

> Sources: Maqsood Fans Commerce Team, 2026-10-16
> Raw: [WhatsApp Direct Ordering and Delivery Rules](../../raw/deployment/2026-10-16-whatsapp-ordering-and-delivery-rules.md)
> Updated: 2026-10-16

## Overview

Maqsood Fans implements direct WhatsApp ordering to provide a high-conversion, personalized checkout experience tailored to Pakistani home appliance commerce. By leveraging WhatsApp click-to-chat links, the platform bypasses checkout friction and payment gateway overhead.

## WhatsApp Integration Details

- Destination Number: `923234464246` (configured as `DEMO_WHATSAPP_NUMBER` in `src/main.js`).
- Privacy Assurance: Maintained within code constants; never displayed as raw plaintext on website pages to prevent automated scraping.
- Format: `https://wa.me/<number>?text=<encoded_text>`

## Message Templates

### 1. General Enquiry
```text
Assalam-o-Alaikum Maqsood Fans, I would like to know more about your ceiling fans.
```

### 2. Product Detail Order
Triggered from individual fan detail pages, embedding the model name, SKU, and active price:
```text
Assalam-o-Alaikum Maqsood Fans, I am interested in the {product.name} ({product.sku}) ceiling fan priced at {price}. Please share availability and delivery details.
```

### 3. Cart Summary Order
Triggered from the Cart page, enumerating all selected models, quantities, and line item subtotals:
```text
Assalam-o-Alaikum Maqsood Fans,

I would like to order:
- {Product 1} ({SKU 1}) x {Qty} — {Total 1}
- {Product 2} ({SKU 2}) x {Qty} — {Total 2}

Estimated total: {Total}

Please confirm availability and delivery details.
```

### 4. Complete Checkout Order
Triggered from the Checkout page, incorporating the customer's full delivery details:
```text
Assalam-o-Alaikum Maqsood Fans,

I would like to place an order.

Products:
- {Product 1} ({SKU 1}) x {Qty} — {Total 1}

Customer details:
Name: {Full Name}
WhatsApp: {Phone}
City: {City}
Address: {Complete Address}
Notes: {Special Instructions}

Estimated total: {Total}

Please confirm availability and delivery timing.
```

## Delivery Policy

- Geographic Scope: Free same-day delivery across Lahore, Pakistan.
- Checkout Form Validation: City dropdown is explicitly restricted to Lahore.
- Customer Care Hours: Monday through Saturday, 10am to 7pm.

## See Also

- [Storefront Pages and User Journey](../storefront/pages-and-user-journey.md)
- [Persistent Cart Engine](../storefront/persistent-cart-engine.md)
- [Vercel Cloud and Subdomains](vercel-cloud-and-subdomains.md)
