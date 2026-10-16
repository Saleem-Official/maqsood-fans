# Product Catalogue and Technical Specifications

> Source: src/data.js, docs/unsplash-demo-products.md
> Collected: 2026-10-16
> Published: 2026-10-16

## Catalogue Data Specification

The Maqsood Fans catalogue contains 9 ceiling fan models spanning four collections: Premium, Designer, Natural, and Everyday. Each product record maintains 18 distinct attributes including pricing, inventory availability, mechanical specifications, and multi-image media assets.

### Product Attributes Schema

- id: Unique string identifier / URL slug (e.g., royal-plus, aura-living-52).
- sku: Product model code (e.g., MF-1001, MF-DEMO-201).
- name: Commercial model display title.
- price: Active discounted sale price in Pakistani Rupees (PKR, Rs.).
- oldPrice: Manufacturer suggested retail / original price in PKR.
- discount: Marketing badge text (e.g., "30% OFF", "20% OFF", "15% OFF", "New").
- rating: Customer satisfaction score on a 1.0 to 5.0 scale.
- reviews: Total count of verified buyer reviews.
- image: Primary product hero image (local asset path or external CDN URL).
- image2: Optional secondary gallery angle image.
- image3: Optional tertiary gallery angle image.
- image4: Optional quaternary gallery angle image.
- category: Collection classification (Premium, Designer, Natural, Everyday).
- color: Finish and colorway detail (Ivory, Black / Gold, Pearl White, Walnut, Champagne Gold, Snow White).
- blades: Blade configuration (3 blade, 4 blade, 5 blade).
- size: Sweep diameter (48 inch, 52 inch, 56 inch).
- stockStatus: Inventory state (in_stock, out_of_stock).
- description: Full editorial marketing copy and technical overview.

## Built-in Products Complete Inventory

1. Model: Royal Plus
   - ID: royal-plus
   - SKU: MF-1001
   - Price: Rs. 8,400 (Old Price: Rs. 12,000, 30% OFF)
   - Rating: 4.9 (24 reviews)
   - Category: Premium
   - Finish: Ivory | 3 blade | 48 inch
   - Availability: in_stock
   - Primary Image: /assets/royal-plus.jpg
   - Description: A graceful ivory finish with a quiet, high-performance motor made for relaxed living rooms.

2. Model: Classic Pro
   - ID: classic-pro
   - SKU: MF-1002
   - Price: Rs. 8,800 (Old Price: Rs. 11,000, 20% OFF)
   - Rating: 4.8 (18 reviews)
   - Category: Premium
   - Finish: Black / Gold | 3 blade | 48 inch
   - Availability: in_stock
   - Primary Image: /assets/classic-detail.jpg
   - Description: A bold black-and-gold statement piece with powerful airflow and an elegant modern profile.

3. Model: Elite Series
   - ID: elite-series
   - SKU: MF-1003
   - Price: Rs. 10,500 (Old Price: Rs. 14,000, 25% OFF)
   - Rating: 4.9 (32 reviews)
   - Category: Designer
   - Finish: Pearl White | 3 blade | 52 inch
   - Availability: in_stock
   - Primary Image: /assets/elite-series.jpg
   - Description: Clean, contemporary and energy efficient — the everyday luxury pick for bright spaces.

4. Model: Wooden Touch
   - ID: wooden-touch
   - SKU: MF-1004
   - Price: Rs. 10,400 (Old Price: Rs. 13,000, 20% OFF)
   - Rating: 4.7 (17 reviews)
   - Category: Natural
   - Finish: Walnut | 3 blade | 48 inch
   - Availability: in_stock
   - Primary Image: /assets/wooden-touch.jpg
   - Description: Warm wood tones and smooth air movement bring a softer, more natural rhythm home.

5. Model: Modern Gold
   - ID: modern-gold
   - SKU: MF-1005
   - Price: Rs. 11,900 (Old Price: Rs. 14,900, 20% OFF)
   - Rating: 4.8 (12 reviews)
   - Category: Designer
   - Finish: Champagne Gold | 3 blade | 52 inch
   - Availability: in_stock
   - Primary Image: /assets/modern-gold.jpg
   - Description: A sculptural gold accent for interiors that love a little more personality overhead.

6. Model: Sleek White
   - ID: sleek-white
   - SKU: MF-1006
   - Price: Rs. 9,900 (Old Price: Rs. 11,900, 15% OFF)
   - Rating: 4.6 (9 reviews)
   - Category: Everyday
   - Finish: Snow White | 3 blade | 48 inch
   - Availability: in_stock
   - Primary Image: /assets/sleek-white.jpg
   - Description: Minimal from every angle, with whisper-quiet performance for bedrooms and studies.

7. Model: Aura Living 52
   - ID: aura-living-52
   - SKU: MF-DEMO-201
   - Price: Rs. 12,800 (Old Price: Rs. 15,900, 20% OFF)
   - Rating: 4.8 (27 reviews)
   - Category: Premium
   - Finish: Champagne Gold | 3 blade | 52 inch
   - Availability: in_stock
   - Gallery Images:
     - Image 1: https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80
     - Image 2: https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80
     - Image 3: https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80
     - Image 4: https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80
   - Description: A refined statement fan for open-plan living rooms, pairing a quiet copper motor with a warm champagne finish and wide, comfortable airflow.

8. Model: Nordic Breeze 48
   - ID: nordic-breeze-48
   - SKU: MF-DEMO-202
   - Price: Rs. 9,600 (Old Price: Rs. 11,800, 15% OFF)
   - Rating: 4.6 (14 reviews)
   - Category: Designer
   - Finish: Snow White | 4 blade | 48 inch
   - Availability: in_stock
   - Gallery Images:
     - Image 1: https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80
     - Image 2: https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80
     - Image 3: https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80
     - Image 4: https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80
   - Description: A bright, minimal ceiling fan designed for bedrooms and studies, with a soft white profile and smooth low-noise circulation.

9. Model: Heritage Air 56
   - ID: heritage-air-56
   - SKU: MF-DEMO-203
   - Price: Rs. 14,500 (Old Price: Rs. 17,900, 30% OFF)
   - Rating: 4.9 (39 reviews)
   - Category: Natural
   - Finish: Walnut | 5 blade | 56 inch
   - Availability: out_of_stock (Sold Out)
   - Gallery Images:
     - Image 1: https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80
     - Image 2: https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80
     - Image 3: https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80
     - Image 4: https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80
   - Description: A broad, architectural fan for larger rooms, built around a warm wood-inspired look and powerful air movement.

## Curated Categories

- Premium Collection: 4 models, featuring classic and statement finishes.
- Natural Wood: 3 models, featuring warm walnut and organic styles.
- Everyday Comfort: 6 models, engineered for quiet bedrooms and studies.
