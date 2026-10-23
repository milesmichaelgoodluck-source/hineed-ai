# Hineed.AI — Full-stack web app

Everything you need, in one place. Homes, services, products, food, jobs and
payments — built for Port Harcourt.

This is the Hineed design you approved, now backed by a real server.

## Quick start
```bash
npm install
npm run dev        # http://localhost:3000
```

## How it’s built
- **Next.js (App Router)** — one project serves both the UI and the API.
- **UI**: `public/index.html` — your hand-built Hineed interface. A small
  “backend bridge” at the bottom of that file connects it to the API.
- **Backend**: `app/api/*` — route handlers for the catalog, authentication and
  bookings.
- **Data**: `lib/store.js` — a simple, dependency-free persistent store
  (`data/db.json`). Swappable for Postgres later without touching the routes.
- **Auth**: `lib/auth.js` — hashed passwords (scrypt) and signed session cookies,
  no third-party service required.

## API
| Method | Path | What it does |
|---|---|---|
| GET | `/api/catalog` | All providers, categories, prices, reviews |
| POST | `/api/auth/signup` | Create account (or log in) + session |
| POST | `/api/auth/login` | Log in + session |
| GET | `/api/auth/me` | Who am I (from session) |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/bookings` | My bookings |
| POST | `/api/bookings` | Book a service (held in escrow) |
| PATCH | `/api/bookings/:id` | `complete` / `release` / `cancel` a booking |

## Deploying
See **DEPLOY.md** — a step-by-step, no-terminal guide to going live on Vercel.
