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
  return path === '/admin' || (isSubdomainAdmin && (path === '/' || path === ''));
}
```

- Storefront Host: `https://maqsood-fans-source.vercel.app` → Renders the customer shopping storefront.
- Admin Host: `https://maqsood-fans-admin.vercel.app` → Automatically surfaces the password-gated admin portal at root `/`.

## Live URLs

- Storefront Production: https://maqsood-fans-source.vercel.app
- Admin Subdomain: https://maqsood-fans-admin.vercel.app
- GitHub Repository: https://github.com/Saleem-Official/maqsood-fans
- Access Policy: Public access enabled (`ssoProtection: null`), removing team sign-in barriers.

## See Also

- [WhatsApp Checkout Integration](whatsapp-checkout-integration.md)
- [Production Hardening and Security](production-hardening-and-security.md)
- [Admin Portal and Password Security](../admin/admin-portal-and-password-security.md)
