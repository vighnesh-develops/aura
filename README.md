# AURASOUND

Premium headphone storefront (vanilla HTML/CSS/JS, Three.js) with an optional **Node.js + Express + SQLite** backend and admin panel.

## Quick start (recommended)

Run the storefront and backend together from this repo:

1. Create env file:
   - PowerShell: `Copy-Item .env.example .env`
2. Edit `.env` and set at minimum:
   - `SESSION_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
3. Install backend deps and start:
   - `cd server`
   - `npm install`
   - `npm run dev`
4. Open:
   - Storefront: `http://localhost:3000/index.html`
   - Admin login: `http://localhost:3000/admin/login.html`

You can still open static HTML from disk or another static server; `js/api-config.js` points catalog and forms at `http://localhost:3000` by default when not served from port `3000`.

## Backend & admin

See **[server/README.md](server/README.md)** for `npm` scripts and API tables.

- **Admin UI:** `http://localhost:3000/admin/login.html` (or `/admin` redirects to login).
- **Default admin credentials:** whatever you set as `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (see `.env.example`). **Change these immediately** after first login.
- If port `3000` is busy, set `PORT=3101` in `.env` and use that port in URLs.

### Security notes

- Replace the seeded admin password before exposing the server.
- Use **HTTPS** in production; set `NODE_ENV=production` and a strong `SESSION_SECRET`.
- The dev server intentionally avoids serving `/server` paths and `.env` over HTTP; in production, prefer a reverse proxy and only publish static assets you intend to be public.

## Frontend ↔ API

- Catalog: after load, pages try `GET /api/products` and merge into the existing bundled catalog (`Store.replaceCatalog`). If the API is down, the site keeps working from embedded data.
- Checkout: after a successful local order, the client **best-effort** posts to `POST /api/orders` (duplicate `public_id` returns 409), including line-level `unitPrice` from discounted cart values.
- Contact: the home page form posts to `POST /api/contact` when the API base resolves correctly.

Override API root by defining `window.AURASOUND_API_BASE` **before** `js/api-config.js` if needed.
