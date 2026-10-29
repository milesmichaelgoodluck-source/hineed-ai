# Deploying Hineed.AI

This is a **full-stack Next.js app**. It has a real backend (accounts, sessions,
providers, bookings with escrow) and the Hineed UI you designed. It deploys to
**Vercel** — the same service you already use — with no database to set up.

You have two ways to deploy. **Route A needs no terminal** and is recommended.

---

## Route A — GitHub + Vercel (no terminal, ~10 minutes)

### Step 1 — Put this folder on GitHub
1. Unzip `hineed-fullstack.zip` somewhere easy (e.g. your Desktop).
2. Go to **https://github.com/new** and create a new empty repository named
   `hineed-ai` (leave "Add a README" unchecked). Click **Create repository**.
3. On the next page click **“uploading an existing file”**.
4. Open the unzipped `hineed-fullstack` folder, select **everything inside it**
   (not the folder itself) and drag it into the browser.
   - It’s fine that there’s no `node_modules` folder — Vercel installs that itself.
5. Click **Commit changes**.

### Step 2 — Deploy on Vercel
1. Go to **https://vercel.com/new**.
2. Find your new `hineed-ai` repo in the list and click **Import**.
3. Leave every setting on its default (Framework = **Next.js** is detected
   automatically). 
4. (Recommended) Open **Environment Variables** and add one:
   - Name: `SESSION_SECRET`
   - Value: any long random string (e.g. mash your keyboard for 40+ characters).
5. Click **Deploy**.

In ~1 minute you’ll get a live link like `hineed-ai.vercel.app`. That’s your
full-stack app, live. 🎉

### Step 3 (optional) — Use your own address
In the Vercel project: **Settings → Domains** — you can point
`hineed-app.vercel.app`, or a custom domain like `hineed.ai`, at this project.

---

## Route B — Vercel CLI (if you’re comfortable with a terminal)

```bash
cd hineed-fullstack
npm install
npx vercel          # first run links/creates the project
npx vercel --prod   # deploys to production
```

---

## Run it on your own computer first (optional)

```bash
cd hineed-fullstack
npm install
npm run dev
```

Then open **http://localhost:3000**. Sign up, open a provider, tap **Book** — the
account and booking are saved in `data/db.json`.

---

## What is real vs. demo right now

**Real and working (saved on the server):**
- Sign-up / login with real accounts and secure sessions (passwords are hashed).
- 16 service providers, 8 categories and their price lists — served from the backend.
- Booking a service → creates a real booking held in **escrow**, which you can
  **release** to the provider. All of it persists.

**Still front-end demo (beautiful, not yet wired to the backend):**
- Social feed, the AI “I Need” chat, Flights, the marketplace checkout, and the
  real-estate / jobs listings. These are ready to wire up next, the same way
  bookings were.

---

## When you’re ready for permanent, large-scale data

The app currently stores accounts and bookings in a JSON file. That is perfect
for launch and testing. On Vercel the file lives in temporary storage, so for
**permanent** data that never resets, move to a free hosted Postgres database:

1. In your Vercel project: **Storage → Create Database → Postgres** (free tier).
   Vercel adds a `DATABASE_URL` for you automatically.
2. Ask me to swap the data layer (`lib/store.js`) to Postgres — every API route
   already talks only to that one file, so nothing else has to change.

No rush: deploy first, see it live, add this later.

---

## Email verification codes (OTP)

Sign-up now includes an email verification step. Out of the box it runs in
**test mode**: the 6-digit code is shown on screen so the flow works immediately.

To send **real codes to people's Gmail**, set two Environment Variables on Vercel:

1. Create a free account at **resend.com** and copy your API key.
2. In Vercel → your project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` = your Resend key
   - `EMAIL_FROM` = e.g. `Hineed.AI <noreply@yourdomain.com>`
3. Verify your sending domain in Resend (required to email anyone other than
   your own address). Then redeploy.

SMS OTP (e.g. via Termii) can be added the same way later — just ask.

## Updating the live app

Because Vercel is connected to your `hineed-ai` GitHub repo, **every push
auto-deploys**. To ship changes: double-click **`2-UPDATE-HINEED.bat`** on your
Desktop — it commits and pushes, and Vercel rebuilds in ~1–2 minutes.

## Admin console (owner-only)

Open the app → your **Profile** (tap your name, bottom-left) → **Admin console**.
Sign in with:

- **Username:** `hineed.admin`
- **Password:** `Hineed@Admin#2026`

From there you see platform stats and every user, and can block or delete accounts.
**Change these before real launch** by setting `ADMIN_USERNAME` and `ADMIN_PASSWORD`
in Vercel → Settings → Environment Variables, then redeploy.

## Social login (Google / Facebook)

The "Continue with Google / Facebook" buttons work once you add developer keys:

**Google:** create an OAuth client at console.cloud.google.com → set the redirect
URI to `https://YOUR-DOMAIN/api/auth/oauth/callback?provider=google` → add
`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel.

**Facebook:** create an app at developers.facebook.com → redirect URI
`https://YOUR-DOMAIN/api/auth/oauth/callback?provider=facebook` → add
`FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET`.

Until then, email + password (with the verification code) works fully. Apple
sign-in is a later stage (it needs a paid Apple Developer account).

## Security notes
- `.env` is never uploaded (it’s git-ignored). Set real secrets in Vercel’s
  Environment Variables instead.
- Always set a strong `SESSION_SECRET` in production.
