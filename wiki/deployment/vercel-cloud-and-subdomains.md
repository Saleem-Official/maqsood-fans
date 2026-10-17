# Vercel Cloud and Subdomains

> Sources: Maqsood Fans DevOps Engineering, 2026-10-16
> Raw: [Vercel Hosting and Subdomain Routing](../../raw/deployment/2026-10-16-vercel-hosting-and-subdomain-configuration.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans platform is deployed on Vercel's global edge network. It utilizes automated serverless function handling for the Express backend, static distribution for the Vite frontend bundle, and custom domain alias mapping to route storefront and admin workflows onto dedicated subdomains without requiring additional domain purchases.

## Vercel Architecture & Rewrites

From `vercel.json`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- API Routing: Requests matching `/api/*` route to the Express handler in `api/index.js`.
- SPA Fallback: All page routes route to `dist/index.html` allowing client-side navigation.

## Subdomain Routing Logic

The application inspects the window hostname to determine whether to render the customer storefront or the catalogue administration workspace:

```javascript
function isAdminRoute() {
  const host = window.location.hostname.toLowerCase();
  const isSubdomainAdmin = host.startsWith('admin.') || host.startsWith('admin-') || host.includes('-admin.') || host.includes('.admin.');
  const path = window.location.pathname;
  return isSubdomainAdmin || path === '/admin' || path.startsWith('/admin/');
}
```

- Storefront Host: `https://maqsoodfans.com` / `https://www.maqsoodfans.com` → Renders the customer shopping storefront.
- Admin Host: `https://admin.maqsoodfans.com` → Automatically surfaces the password-gated admin portal at root `/`.
- Fallback Vercel Domain: `https://maqsood-fans-source.vercel.app` → Publicly accessible staging/deployment mirror.

## Custom Domain & Nameserver Configuration

- Apex Domain: `maqsoodfans.com`
- Primary Subdomain: `admin.maqsoodfans.com` (Catalogue & Password Admin Workspace)
- Web Subdomain: `www.maqsoodfans.com`
- Authoritative Nameservers:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
- DNS Records in Vercel:
  - `admin` CNAME `cname.vercel-dns.com.`
  - `www` CNAME `cname.vercel-dns.com.`
  - Apex ALIAS / A records pointing to Vercel Anycast Edge IP (`76.76.21.21`, `64.29.17.1`)
- SSL Certificates: Auto-renewed Let's Encrypt / Google Trust Services TLS certificates issued via Vercel Edge.
- Access Policy: Public access enabled (`ssoProtection: null`), zero sign-in walls for visitors.

## Live URLs

- Storefront Production: https://maqsoodfans.com
- Admin Portal: https://admin.maqsoodfans.com
- GitHub Repository: https://github.com/Saleem-Official/maqsood-fans

## See Also

- [WhatsApp Checkout Integration](whatsapp-checkout-integration.md)
- [Production Hardening and Security](production-hardening-and-security.md)
- [Admin Portal and Password Security](../admin/admin-portal-and-password-security.md)
