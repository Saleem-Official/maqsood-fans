# Customer Reviews System

> Sources: Maqsood Fans Verified Buyers, 2026-10-16
> Raw: [Customer Reviews Dataset](../../raw/catalogue/2026-10-16-customer-reviews-dataset.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans review engine compiles authentic customer feedback, numerical star ratings, and review timestamps across the product catalogue. The system currently features 24 customer reviews distributed across all 9 ceiling fan models, establishing social proof and driving conversion.

## Review Architecture & Schema

Each review record contains:
- `id`: Unique identifier (auto-incremented integer in MySQL, numerical ID in memory).
- `productId`: Foreign reference connecting the review to a specific fan slug (e.g., `royal-plus`).
- `name`: Full name of the verified customer reviewer.
- `date`: Relative or absolute date string (e.g., "2 weeks ago", "1 month ago").
- `rating`: Integer star rating ranging from 1 to 5 stars.
- `text`: Written review testimonial detailing air performance, quietness, finish, or delivery experience.

## Reviews Distribution by Product

- Royal Plus (MF-1001): 3 reviews (Sana Malik, 5 stars; Hamza R., 5 stars; Nimra A., 4 stars). Average rating 4.9 across 24 total reviews.
- Classic Pro (MF-1002): 3 reviews (Ayesha Khan, 5 stars; Bilal Ahmed, 5 stars; Farah S., 4 stars). Average rating 4.8 across 18 total reviews.
- Elite Series (MF-1003): 3 reviews (Maryam T., 5 stars; Usman K., 5 stars; Hira N., 4 stars). Average rating 4.9 across 32 total reviews.
- Wooden Touch (MF-1004): 3 reviews (Zainab R., 5 stars; Omar F., 5 stars; Iqra M., 4 stars). Average rating 4.7 across 17 total reviews.
- Modern Gold (MF-1005): 3 reviews (Maha S., 5 stars; Rashid A., 5 stars; Nadia H., 4 stars). Average rating 4.8 across 12 total reviews.
- Sleek White (MF-1006): 3 reviews (Anum B., 5 stars; Danish M., 4 stars; Saira J., 4 stars). Average rating 4.6 across 9 total reviews.
- Aura Living 52 (MF-DEMO-201): 2 reviews (Sana Malik, 5 stars; Hamza R., 5 stars). Average rating 4.8 across 27 total reviews.
- Nordic Breeze 48 (MF-DEMO-202): 2 reviews (Mariam A., 5 stars; Usman K., 4 stars). Average rating 4.6 across 14 total reviews.
- Heritage Air 56 (MF-DEMO-203): 2 reviews (Omar F., 5 stars; Nadia H., 5 stars). Average rating 4.9 across 39 total reviews.

## Storefront Integration & Display

- Summary Rating Block: Displays large numerical score, 5-star graphical bar, and review count in the product header.
- Verified Buyer Badge: Renders a distinctive green checkmark with "Verified buyer" on each review card.
- Tabbed Panel: Reviews load directly in the dedicated "Customer Reviews" tab, accessible via direct tab navigation or by clicking the header review count link.

## See Also

- [Product Catalogue and Technical Specifications](product-catalogue-and-specifications.md)
- [Catalogue Management and Image Upload](../admin/catalogue-management-and-image-upload.md)
- [REST API Specification](../backend/rest-api-specification.md)
