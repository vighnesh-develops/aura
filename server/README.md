# AURASOUND backend

Express REST API, SQLite persistence (`better-sqlite3`), session-based admin authentication, and static admin UI under `/admin`.

## Setup

From the repository root:

```bash
cd server
npm install
```

Copy `../.env.example` to `../.env` and set secrets:

- `SESSION_SECRET` — long random string (required in production).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — seed **one** administrator on first run if no user exists for that email.
- `PORT` — listen port (default `3000`).
- `FRONTEND_ORIGIN` — optional exact origin when the storefront is not on `localhost` (CORS + credentials).

## Run

```bash
npm run dev
```

or without file watching:

```bash
npm start
```

- Storefront (when served by this app): `http://localhost:3000/index.html`
- Admin login: `http://localhost:3000/admin/login.html`
- If `3000` is already in use, set `PORT` in `../.env` (example: `3101`) and use that port in URLs.

## Minimal smoke test (PowerShell)

After starting the server:

```powershell
# Public catalog
Invoke-RestMethod http://localhost:3000/api/products

# Contact form endpoint
Invoke-RestMethod -Method Post http://localhost:3000/api/contact `
  -ContentType 'application/json' `
  -Body '{"name":"Test","email":"test@example.com","subject":"Hi","message":"Ping"}'
```

Admin login check with env credentials:

```powershell
$body = @{ email = $env:ADMIN_EMAIL; password = $env:ADMIN_PASSWORD } | ConvertTo-Json
Invoke-RestMethod -Method Post http://localhost:3000/admin/api/login -ContentType 'application/json' -Body $body -SessionVariable s
Invoke-RestMethod http://localhost:3000/admin/api/me -WebSession $s
```

## API overview

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/products` | Public catalog |
| GET | `/api/products/:slug` | Single product |
| POST | `/api/contact` | JSON `{ name, email, subject, message }` |
| POST | `/api/orders` | Optional checkout sync (JSON order payload) |
| POST | `/admin/api/login` | `{ email, password }` |
| POST | `/admin/api/logout` | |
| GET | `/admin/api/me` | Session probe |
| GET | `/admin/api/dashboard` | Admin only |
| … | `/admin/api/*` | Users, products CRUD, orders, messages |

SQLite file: `server/data/aurasound.db` (override with `SQLITE_PATH`).

Products are seeded from `server/seed-products.json` when the `products` table is empty.
