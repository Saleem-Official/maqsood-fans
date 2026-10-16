# Visual Design System and Responsive Styling

> Source: src/styles.css
> Collected: 2026-10-16
> Published: 2026-10-16

## Design Principles and Aesthetic

The Maqsood Fans design system reflects a premium appliance aesthetic inspired by architectural craftsmanship. It balances warm editorial typography with modern e-commerce utility.

## Typography Tokens

- Primary Body & UI Font: 'DM Sans', Arial, sans-serif
- Editorial Display Serif: 'Playfair Display', Georgia, serif
- Heading Hierarchy:
  - Hero Display: 58px (46px on mobile), -0.05em letter-spacing
  - Section Titles: 30px (26px on mobile), -0.04em letter-spacing
  - Product Detail Title: 48px (38px on mobile), -0.07em letter-spacing
  - Card Titles: 15px (13px on mobile), -0.02em letter-spacing

## Color Palette Tokens

- Primary Ink: `--ink` = #252525 (deep charcoal)
- Secondary Muted: `--muted` = #6c6a65 (warm neutral gray)
- Brand Accent Gold: `--gold` = #b78626 (antique brass gold)
- Gold Dark (Hover): `--gold-dark` = #946b18
- Neutral Sand: `--sand` = #f6f3ee (creamy background tone)
- Deep Sand: `--sand-deep` = #ede8df
- Line & Border: `--line` = #e4dfd6
- Pure White: `--white` = #ffffff
- Success Green: `--green` = #23884c (in-stock indicators, verified badges)
- Sold Out / Error Red: #bd1d2a and #b52d2d
- Shadow Token: `--shadow` = 0 16px 45px rgba(40,31,18,.08)

## Responsive Breakpoints & Adaptations

1. Desktop (>900px):
   - Content container width: min(1180px, calc(100% - 64px))
   - Product Grid: 4 columns
   - Catalog Layout: 210px sidebar + 1fr grid (3 columns)
   - Product Detail: 1.03fr gallery + 0.97fr copy (70px gap)
   - Cart & Checkout: Multi-column side-by-side layout

2. Tablet (641px - 900px):
   - Product Grid: 2 columns
   - Catalog Layout: 170px sidebar + 1fr grid
   - Detail Gap: 32px
   - Cart & Checkout: Single-column stack

3. Mobile (<=640px):
   - Header: 64px compact height, hamburger menu drawer
   - Bottom Floating Bar: Fixed rounded dock (.mobile-bottom-nav) with Home, Shop, Cart, and WhatsApp triggers
   - Feature Strip: 2x2 grid
   - Product Visual Height: 150px
   - Cart Items: Stacked responsive layout with price and controls aligned
   - Detail Gallery: 310px height, tap lightbox active, hover zoom disabled
