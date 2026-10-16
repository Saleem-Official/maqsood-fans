# Admin Portal and Password Security

> Sources: Maqsood Fans Security Architecture, 2026-10-16
> Raw: [Admin Workspace and Authentication Architecture](../../raw/admin/2026-10-16-admin-workspace-and-security.md)
> Updated: 2026-10-16

## Overview

The Maqsood Fans admin portal is a single-field password-authenticated catalogue management system. It bypasses complex multi-step user registrations and external authentication providers, allowing the business owner to unlock the workspace with a single password, make real-time product adjustments, and update the password on demand.

## Security Architecture

### Single-Field Password Gate
- Default Initial Password: `'maqsood123'`
- Entrypoint: When unauthenticated, `#admin-root` renders a dedicated lock screen card prompting for the administrator password.
- Verification API: Submits password payload to `POST /api/admin/verify-password`.
- Session Persistence: On successful verification, writes `sessionStorage.setItem('maqsood_admin_auth', 'true')`.
- Offline / Serverless Resilience: If network connectivity is interrupted, verifies against `localStorage.getItem('maqsood_admin_password') || 'maqsood123'`.

### Session Management & Lock Action
- The navigation topbar renders action pills: "🔑 Change Password" and "🔒 Lock".
- Clicking "🔒 Lock" clears `sessionStorage` (`sessionStorage.removeItem('maqsood_admin_auth')`) and returns the view to the locked password gate immediately.

### Password Modification Workflow
- Action: "🔑 Change Password" button triggers an accessible modal dialog.
- Inputs: Current Password, New Password, Confirm New Password.
- Validation Rules:
  - Verifies that New Password matches Confirm New Password.
  - Enforces a minimum length of 3 characters.
  - Verifies Current Password authenticity against server state or client storage.
- Storage: Submits update to `POST /api/admin/change-password` and saves to `localStorage` (`maqsood_admin_password`).

## Workspace Access Rules

- Direct Route: Accessible via `/admin` on any domain.
- Subdomain Routing: Automatically surfaces at the root `/` when browsing from an admin subdomain (e.g., `maqsood-fans-admin.vercel.app`).

## See Also

- [Catalogue Management and Image Upload](catalogue-management-and-image-upload.md)
- [REST API Specification](../backend/rest-api-specification.md)
- [Vercel Cloud and Subdomains](../deployment/vercel-cloud-and-subdomains.md)
