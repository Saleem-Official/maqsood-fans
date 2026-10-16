# Admin Workspace and Authentication Architecture

> Source: src/admin.js, docs/admin-deployment.md
> Collected: 2026-10-16
> Published: 2026-10-16

## Admin Authentication Architecture

The admin portal provides catalogue administrators with complete control over products, images, and reviews without requiring customer accounts, OAuth providers, or external third-party identity services.

### Single-Field Password Gate

- Screen: Minimalist lock screen rendered into `#admin-root`.
- Default Password: `'maqsood123'`
- Session Management: Stores `sessionStorage.setItem('maqsood_admin_auth', 'true')` upon successful entry.
- Offline Fallback: If network is offline, checks `localStorage.getItem('maqsood_admin_password') || 'maqsood123'`.
- Topbar Actions: Once unlocked, dynamically renders "🔑 Change Password" and "🔒 Lock" action pills in `#admin-topbar-right`.
- Lock Action: Clears `maqsood_admin_auth` from `sessionStorage` and returns the interface to the locked password gate.

### Change Password Flow

- Modal dialog allows the administrator to enter their current password, specify a new password (enforcing a 3-character minimum), and confirm the new password.
- Submits to `POST /api/admin/change-password`.
- Updates `localStorage.setItem('maqsood_admin_password', newPassword)` to ensure password continuity even in pure client-side or serverless environments.

## Admin Toolbar and Navigation

- Header displays total count of managed products and customer reviews.
- Action Buttons:
  - `+ Add product`: Opens product creation form and scrolls smoothly to editor.
  - `+ Add review`: Opens review creation form.
  - `🔑 Change password`: Triggers modal prompt.
- Table Views:
  - Products Table: Displays primary thumbnail, model title, ID, SKU, formatted price, category, availability pill, Edit button, and Delete button.
  - Customer Reviews Table: Displays reviewer name, date, comment snippet, product title, star rating, Edit button, and Delete button.
