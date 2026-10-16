# Vercel Hosting and Subdomain Routing

> Source: vercel.json, src/main.js, Vercel CLI deployment logs
> Collected: 2026-10-16
> Published: 2026-10-16

## Vercel Serverless Hosting Configuration

The repository is configured for zero-configuration, continuous production deployment on Vercel using the official Vite framework preset.

### Configuration (`vercel.json`)

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

- API Rewrites: All incoming requests matching `/api/(.*)` route to `/api/index.js`, where Express handles request routing and execution.
- SPA Rewrites: All remaining web traffic routes to `/index.html` allowing client-side routing across all storefront pages.

## Subdomain Routing Logic

The application automatically serves the catalogue admin interface when accessed via an admin subdomain or direct path.

From `src/main.js`:
```javascript
function isAdminRoute() {
  const host = window.location.hostname.toLowerCase();
  const isSubdomainAdmin = host.startsWith('admin.') || host.startsWith('admin-') || host.includes('-admin.') || host.includes('.admin.');
  const path = window.location.pathname;
  return path === '/admin' || (isSubdomainAdmin && (path === '/' || path === ''));
}
```

- When visiting `https://maqsood-fans-admin.vercel.app` (root `/` or `/admin`), `isAdminRoute()` evaluates to `true`, rendering the admin catalogue manager directly.
- When visiting `https://maqsood-fans-source.vercel.app`, the full customer storefront renders.

## Live Production Endpoints

- Storefront Production URL: https://maqsood-fans-source.vercel.app
- Admin Subdomain Production URL: https://maqsood-fans-admin.vercel.app
- GitHub Repository: https://github.com/Saleem-Official/maqsood-fans
- Deployment Protection: SSO deployment protection disabled (`ssoProtection: null`) allowing unrestricted public access without Vercel team logins.
