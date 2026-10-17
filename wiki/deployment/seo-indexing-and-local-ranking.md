# SEO, Indexing, and Local Ranking Guide

> Sources: Maqsood Fans Search Engine Optimization Strategy, 2026-10-17
> Status: Active Production Implementation

## 1. Technical SEO & Architecture Overview

Maqsood Fans (`maqsoodfans.com`) has been configured for search engine crawlability and local discovery:

- **Canonical URL**: `https://maqsoodfans.com/`
- **Sitemap Location**: `https://maqsoodfans.com/sitemap.xml`
- **Robots Policy**: `https://maqsoodfans.com/robots.txt`
- **Target Market**: Lahore, Punjab, Pakistan
- **Target Keywords**: "Ceiling fans Lahore", "Buy designer fans Pakistan", "Inverter ceiling fan price in Pakistan", "Maqsood fans", "Silent ceiling fans".

---

## 2. Robots & Crawlability Policy

File: `public/robots.txt`
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/
Disallow: /checkout

Sitemap: https://maqsoodfans.com/sitemap.xml
```
- **Allowing**: All public catalog and product pages are open to Googlebot, Bingbot, and LLM crawlers.
- **Disallowing**: Internal admin panel, API routes, and checkout screens are shielded from search index dilution.

---

## 3. Structured Data (JSON-LD Schema)

Embedded in `index.html`:
- **`HomeGoodsStore` / `LocalBusiness`**:
  - Name: Maqsood Fans
  - Phone: `+923234464246`
  - Address: Lahore, Punjab, Pakistan (Postal Code 54000)
  - Coordinates: `31.5204, 74.3587`
  - Area Served: Lahore, Pakistan
  - Payment: Cash on Delivery
  - Opening Hours: Mon–Sat, 10:00–19:00
- **`WebSite`**:
  - Name: Maqsood Fans
  - Publisher ID link to store

---

## 4. Google Search Console (GSC) Indexing Steps

### Step 1: Add Property in Google Search Console
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Choose **Domain** or **URL prefix** property:
   - Recommended: **URL prefix**: `https://maqsoodfans.com`

### Step 2: Verification Method
- **Method A (HTML Tag - Instant)**:
  Copy the `google-site-verification` content code (e.g. `google-site-verification=abc...123`) from GSC. Paste it into `index.html` or provide it to the assistant.
- **Method B (DNS TXT Record on Vercel)**:
  Run `vercel dns add maqsoodfans.com '@' TXT "google-site-verification=..."` to verify directly at the DNS level.

### Step 3: Submit Sitemap
1. Go to **Sitemaps** in the left sidebar of GSC.
2. Enter `sitemap.xml` and click **Submit**.
3. Status should show **Success**.

### Step 4: URL Inspection & Request Indexing
1. In the top search bar of GSC, enter `https://maqsoodfans.com/`.
2. Click **Test Live URL**.
3. Click **Request Indexing**.
4. Repeat for primary category: `https://maqsoodfans.com/products`.

---

## 5. Local SEO & Google Business Profile (GBP) Playbook (Lahore)

1. **Google Business Profile (GBP)**:
   - Create profile named **Maqsood Fans**.
   - Primary category: **Ceiling Fan Store** or **Lighting & Electrical Supply Store**.
   - Service Area: Lahore (Gulberg, DHA, Johar Town, Model Town, Cantt, Bahria Town, etc.).
   - Website link: `https://maqsoodfans.com`.
   - Contact Number: `+92 323 4464246` (Matching the site's WhatsApp number for strict NAP consistency).

2. **Customer Reviews Strategy**:
   - Collect first 10+ five-star reviews from real Lahore customers.
   - Maintain active review velocity (at least 1 new review every 14–18 days).
   - Reply to 100% of reviews with keyword-rich responses (e.g. *"Thank you for trusting Maqsood Fans for your lounge ceiling fan in Lahore"*).

3. **High-Authority Local Citations in Pakistan**:
   - **Google Maps / GBP**
   - **Facebook Page**: `facebook.com/maqsoodfans`
   - **PakBiz**: Directory listing for electrical appliances
   - **OLX Pakistan Business Profile**
   - **YellowPages.com.pk**
   - **Bolee.com**
