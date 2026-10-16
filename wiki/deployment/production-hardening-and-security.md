# Production Hardening and Security

> Sources: Project Team, 2026-10-16
> Raw: [System Architecture and Technology Stack](../../raw/architecture/2026-10-16-system-architecture-and-stack.md); [Vercel Hosting and Subdomain Routing](../../raw/deployment/2026-10-16-vercel-hosting-and-subdomain-configuration.md)
> Updated: 2026-10-16

## Overview

This guide details recommended production hardening procedures, container verification, and security controls for Maqsood Fans prior to scaled commercial operations.

## Security Hardening Checklist

1. Authentication & Role Controls:
   - Introduce JWT or server-side session cookies with HTTP-only and SameSite flags for administrative sessions.
   - Enforce role-based access control (RBAC) on all `/api/admin/*` mutation endpoints.

2. Request Validation & Sanitization:
   - Implement schema validation (e.g., Zod or Joi) for incoming product and review payloads.
   - Sanitize HTML inputs and enforce allowed image URL protocols (https://) and image dimensions.

3. Database Credentials & Secrets Management:
   - Store `DATABASE_URL` strictly within platform environment secret managers (Vercel Project Settings or Docker secret mounts).
   - Never commit `.env` or database credentials to version control.

4. Rate Limiting & Denial of Service Protection:
   - Implement `express-rate-limit` on public review creation and admin password verification endpoints.
   - Deploy Cloudflare or Vercel Edge firewall rules to throttle brute-force attempts.

5. Data Backups & Migration Strategy:
   - Establish automated daily snapshots of the MySQL database.
   - Maintain versioned migration scripts for schema alterations.

## Container Deployment Procedure

The repository provides a production `Dockerfile` for self-hosted container environments:
```bash
docker build -t maqsood-fans:latest .
docker run -p 3000:3000 -e DATABASE_URL="mysql://..." maqsood-fans:latest
```

## Production Health & Verification Commands

```bash
# Verify production Vite compilation
npm run build

# Verify backend health probe
curl https://maqsood-fans-source.vercel.app/api/health

# Verify catalogue public feed
curl https://maqsood-fans-source.vercel.app/api/products

# Verify customer reviews feed
curl https://maqsood-fans-source.vercel.app/api/reviews
```

## See Also

- [Vercel Cloud and Subdomains](vercel-cloud-and-subdomains.md)
- [Admin Portal and Password Security](../admin/admin-portal-and-password-security.md)
- [System Overview and Technology Stack](../architecture/system-overview-and-stack.md)
