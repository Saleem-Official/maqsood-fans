# Design System and Visual Tokens

> Sources: Maqsood Fans UI/UX Design, 2026-10-16
> Raw: [Visual Design System and Responsive Styling](../../raw/storefront/2026-10-16-visual-design-and-styling.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans visual language combines warm, grounded architectural tones with refined typography and responsive components. The styling is implemented in pure CSS3 (`src/styles.css`) using custom properties, responsive grids, and clean layout patterns without bulky external UI libraries.

## Design Tokens

### Color Palette
- Charcoal Primary: `--ink` = #252525
- Muted Gray: `--muted` = #6c6a65
- Antique Gold Accent: `--gold` = #b78626
- Dark Gold (Hover): `--gold-dark` = #946b18
- Cream Sand: `--sand` = #f6f3ee
- Deep Sand: `--sand-deep` = #ede8df
- Line / Border: `--line` = #e4dfd6
- Crisp White: `--white` = #ffffff
- Forest Green: `--green` = #23884c (in-stock indicators and verified checkmarks)
- Sold Out & Error Red: #bd1d2a and #b52d2d
- Card Shadow: `--shadow` = 0 16px 45px rgba(40,31,18,.08)

### Typography
- Primary Body & UI: 'DM Sans', Arial, sans-serif
- Editorial Display Serif: 'Playfair Display', Georgia, serif
- Scale:
  - Hero Display: 58px (46px on mobile), -0.05em letter-spacing
  - Section Headings: 30px (26px on mobile), -0.04em letter-spacing
  - Product Detail Title: 48px (38px on mobile), -0.07em letter-spacing
  - Product Card Title: 15px (13px on mobile), -0.02em letter-spacing

## Responsive Breakpoint System

1. Desktop (>900px):
   - Grid: 4 columns for product cards.
   - Catalog: 210px sidebar + 3-column product grid.
   - Detail: 1.03fr gallery + 0.97fr content.
   - Desktop Navigation: Full horizontal header links with active indicator.

2. Tablet (641px - 900px):
   - Grid: 2 columns for product cards.
   - Catalog: 170px sidebar + flexible grid.
   - Detail: Stacked layout with 32px gap.

3. Mobile (<=640px):
   - Compact Header: 64px height with expandable slide-down drawer.
   - Bottom Dock: Fixed floating dock (.mobile-bottom-nav) with Home, Shop, Cart, and WhatsApp shortcuts.
   - Product Cards: 150px visual container height, optimized touch targets.
   - Cart View: Stacked item cards with quantity controls and total aligned.
   - Interactive Lightbox: Fullscreen tap modal for detailed image inspection.

## See Also

- [Storefront Pages and User Journey](pages-and-user-journey.md)
- [Persistent Cart Engine](persistent-cart-engine.md)
- [Catalogue Management and Image Upload](../admin/catalogue-management-and-image-upload.md)
