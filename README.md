# tobarok — E-Commerce Frontend

A fully client-side e-commerce storefront for **tobarok**, a Bangladesh t-shirt / streetwear brand (recreated after the AAZ-style homepage). Built with **Next.js 16 (App Router + Turbopack)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and `motion`.

> **Status: frontend only (demo).** Product data lives in `lib/data.ts` and all forms are client-side demos. See [Part 4 — Backend Integration](#4-backend-integration) to make it production-ready.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Getting Started](#2-getting-started)
3. [Project Structure](#3-project-structure)
4. [Website Overview](#4-website-overview)
   - [Routes / Pages](#routes--pages)
   - [Homepage sections](#homepage-sections)
   - [Features that work now](#features-that-work-now)
   - [Features that are demo-only](#features-that-are-demo-only)
5. [Data Layer](#5-data-layer)
6. [Cart & Wishlist Store](#6-cart--wishlist-store)
7. [Conventions & Gotchas](#7-conventions--gotchas)
8. [404 Handling Strategy](#8-404-handling-strategy)
9. [Debugging & Troubleshooting](#9-debugging--troubleshooting)
10. [Backend Integration](#10-backend-integration)
    - [Recommended architecture](#recommended-architecture)
    - [Client API layer](#client-api-layer)
    - [Server setup (Express + Prisma)](#server-setup-express--prisma)
    - [Wiring each form / flow](#wiring-each-form--flow)
    - [Auth strategy](#auth-strategy)
    - [Images & env config](#images--env-config)
    - [Deployment checklist](#deployment-checklist)
11. [Scripts](#11-scripts)

---

## 1. Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js `16.2.12` (App Router, Turbopack) |
| UI | React `19.2.4`, TypeScript `5` |
| Styling | Tailwind CSS `4`, `tw-animate-css`, `clsx` + `tailwind-merge` (via `lib/utils.ts`) |
| Icons | `lucide-react` `^1.28.0` |
| Animation | `motion` `^12` |
| Components | shadcn-style primitives (`components/ui/*`) |
| State (cart/wishlist) | React `useSyncExternalStore` + `localStorage` |
| Fonts | Poppins via `next/font/google` |

> **Important (Next 16):** This is not the Next.js you learned from older tutorials.
> - Dynamic route `params` is a **Promise** — always `await` it (`const { id } = await params`).
> - `viewport` is a separate export from `metadata` in `app/layout.tsx`.
> - Docs for the installed version live in `node_modules/next/dist/docs/` — read them before using unfamiliar APIs.

---

## 2. Getting Started

```bash
npm install        # install deps
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run lint       # ESLint (must pass)
npm run build      # typecheck + production build (must pass)
npm start          # serve the production build on http://localhost:3000
```

**Verification ritual** (run before considering work "done"):

```bash
npm run lint && npm run build
```

---

## 3. Project Structure

```
client/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # root layout: Poppins font, StoreProvider, nav + footer
│   ├── page.tsx                  # homepage (composes all home sections)
│   ├── globals.css
│   ├── not-found.tsx             # branded fallback for genuine errors
│   ├── [...slug]/page.tsx        # catch-all → redirects any unknown URL to /shop
│   ├── shop/                     # /shop (full catalog with search + sort)
│   ├── new/ most-wanted/ big-sale/ gift-voucher/
│   ├── collections/ [slug]/      # category pages (18 slugs)
│   ├── signature-series/ signature/ [slug]/
│   ├── budget/ [slug]/
│   ├── accessories/ [slug]/
│   ├── product/ [id]/            # product detail + generateMetadata + redirect fallback
│   ├── cart/ wishlist/ checkout/
│   ├── account/ track/ custom/ contact/ faq/ store-locator/ size-chart/
│   └── about/ terms/ privacy/ returns/
│
├── components/
│   ├── home/                     # HeroCarousel, CategoryGrid, Highlights, Inspire,
│   │                             # ProductCarousel, ProductCard, Influencers, SeeNewIn, SectionHeading
│   ├── shop/                     # ShopPage (grid + search + sort), SlugPage (404-safe wrapper)
│   ├── product/                  # ProductPage (size/qty/add-to-cart/related)
│   ├── cart/                     # CartPage
│   ├── checkout/                 # CheckoutPage
│   ├── wishlist/                 # WishlistPage
│   ├── pages/                    # SimplePage, AccountPage, TrackOrderPage, CustomPage,
│   │                             # ContactPage, FaqPage, StoreLocatorPage
│   ├── shared/                   # Navigation (mega menu + mobile drawer), Footer
│   ├── store/                    # StoreProvider (cart + wishlist external store)
│   └── ui/                       # button, navigation-menu, Breadcrumb, SmartImage
│
├── lib/
│   ├── data.ts                   # SINGLE SOURCE OF TRUTH for all site data
│   └── utils.ts                  # cn() helper
│
├── next.config.ts                # image remotePatterns (images.unsplash.com)
├── package.json
└── README.md
```

---

## 4. Website Overview

### Routes / Pages

| Group | Routes | Notes |
|---|---|---|
| Home & catalog | `/`, `/shop` | `/shop` = all products, client-side search + sort |
| Promo | `/new`, `/most-wanted`, `/big-sale`, `/gift-voucher` | |
| Category hubs | `/collections`, `/signature-series`, `/budget`, `/accessories` | chip lists linking to dynamic pages |
| Dynamic categories | `/collections/[slug]` (18), `/signature/[slug]` (5), `/budget/[slug]` (5), `/accessories/[slug]` (5) | unknown slug → redirect to `/shop` |
| Product | `/product/[id]` | SEO metadata via `generateMetadata`; unknown id → redirect to `/shop` |
| Commerce | `/cart`, `/wishlist`, `/checkout` | functional, persisted in `localStorage` |
| Account & support | `/account`, `/track`, `/custom`, `/contact`, `/faq`, `/store-locator`, `/size-chart` | forms are **demo** |
| Legal | `/about`, `/terms`, `/privacy`, `/returns` | static content via `SimplePage` |
| Catch-all | `app/[...slug]` | any unmatched URL → `redirect("/shop")` |

### Homepage sections (in order, `app/page.tsx`)

1. **Announcement bar** — "You're in BD's Biggest Drop Shoulder Lineup." + Outlets / Track Order / Custom-Bulk links.
2. **Sticky header** — logo (tobarok), desktop mega menu (Budget Pick dropdown, 4-column Collections dropdown, Signature Series dropdown), search expand, account / wishlist / cart (live badge).
3. **HeroCarousel** — 4 autoplay slides (5.5s), arrows, dots, pause on hover.
4. **Featured Categories** — 12-card grid.
5. **tobarok's Highlights** — bento-style highlight cards.
6. **Inspire** — 4-image lifestyle band.
7. **5 product carousels** — *steal your vibe*, *Most Wanted*, *New In*, *Best Deal*, *Deshi Talk*.
8. **Influencers marquee** — infinite scroll of creator names.
9. **See / New In** — tabbed grid.
10. **Dark footer** — link columns, socials, payment hints.

### Features that work now (real, not demo)

- Product grid with **search filter + sorting** (featured / price asc / price desc / name) on every `ShopPage`-based route.
- **Cart**: add from product page (size + qty), quantity +/- (max 99), remove, clear, order summary with free-delivery threshold (free over ৳1,500, else ৳90).
- **Wishlist**: heart toggle on every product card + product page, persisted; "Add to Cart" from wishlist.
- **Cart badge** in the header updates live; state survives refresh via `localStorage`.
- **404 elimination**: unknown product ids, unknown category slugs, and any unmatched URL all redirect to `/shop` (no error page in normal use).
- Responsive layout: desktop mega menu, mobile drawer, 2→5 column product grids.

### Features that are demo-only (need backend)

| Page | Current behavior |
|---|---|
| `/checkout` | On submit: clears cart + shows "Order placed!" success screen. No order is saved anywhere. |
| `/track` | Shows a hardcoded 4-step tracker for any entered order id. |
| `/contact` | Submit → success message, no message sent. |
| `/custom` | Submit → success message, file input does nothing. |
| `/account` | Login/Register tabs → demo success message, no auth. |
| `/faq`, `/size-chart`, `/store-locator`, `/about`, `/terms`, `/privacy`, `/returns` | Static text, editable in their page files. |
| Search in header | Opens an input but does not navigate to results. |

---

## 5. Data Layer

`lib/data.ts` is the **single source of truth**. It exports:

- `CURRENCY` — `"৳"`.
- `images` / `FALLBACK_IMAGE` — Unsplash URLs (helper `img(id, w, h)`).
- `heroSlides` — 4 carousel slides.
- `categories`, `highlights`, `inspire`, `influencers` — homepage arrays.
- **Products** — five seed sets, each built by `buildProducts` with auto-incrementing ids (`nextId`):
  - `vibeProducts` ("steal your vibe"), `mostWanted`, `newIn`, `bestDeal`, `deshiTalk`.
  - `allProducts` = deduplicated union (by title) of all five.
  - `getProduct(id)` — O(1) lookup.
- **Page maps** (`Record<slug, ShopMeta>`): `collectionPages` (18), `signaturePages` (5), `budgetPages` (5), `accessoryPages` (5), `featuredPages` (`new`, `most-wanted`, `big-sale`) + `*AllProducts` unions.
- `navigationLinks` — mega-menu / mobile-drawer data.
- `sizes = ["S","M","L","XL","XXL"]`, `faqs`, `outlets`.

**To add a product**, add a `[title, imageId, price, originalPrice?]` tuple to the relevant `buildProducts(...)` call — the id is assigned automatically and the item appears on every page that reads that list.

---

## 6. Cart & Wishlist Store

`components/store/StoreProvider.tsx`:

- Implemented with **`useSyncExternalStore`** + module-level external store. Passed a `getServerSnapshot` that returns empty arrays so **server and client first render always match** (this was a hydration-mismatch bug — do not regress it).
- Persistence keys: `tobarok.cart` (array of `{ id, qty }`) and `tobarok.wishlist` (array of ids) in `localStorage`.
- Exposed via `useStore()`: `cart`, `wishlist`, `cartCount`, `cartSubtotal`, `addToCart(id, qty?)`, `removeFromCart(id)`, `updateQty(id, qty)`, `clearCart()`, `toggleWishlist(id)`, `isWishlisted(id)`.
- `StoreProvider` wraps the app in `app/layout.tsx`; any component that uses it must be a **client component** (`"use client"`).

---

## 7. Conventions & Gotchas

- **Currency:** always format with `${CURRENCY}${n.toLocaleString("en-BD")}`.
- **Images:** `components/ui/SmartImage.tsx` wraps `next/image` and falls back to `FALLBACK_IMAGE` on error. Only `images.unsplash.com` is allowlisted in `next.config.ts`. New hosts must be added there or you get a runtime image error.
- **Icons:** `lucide-react` v1.28 has **no brand icons** (Facebook/Instagram/YouTube removed). Use generic icons (`Share2`, `AtSign`, `MessageSquareShare`, `Globe`).
- **`params` is a Promise** in dynamic routes — await it.
- **No comments in code** unless asked.
- **Client boundary:** every interactive component (forms, store consumers, carousels) needs `"use client"`. Server components import data directly from `lib/data.ts`.

---

## 8. 404 Handling Strategy

There are **no 404 errors reachable through normal use**:

1. `app/[...slug]/page.tsx` — root catch-all: `redirect("/shop")` for any unmatched path.
2. `app/product/[id]/page.tsx` + `components/shop/SlugPage.tsx` — unknown id / slug → `redirect("/shop")` instead of `notFound()`.
3. `app/not-found.tsx` — branded fallback for genuine server errors (safety net only).

If you ever add a route or a link, keep this in mind: unknown dynamic values redirect to `/shop`, never 404.

---

## 9. Debugging & Troubleshooting

### Workflow when something breaks

1. `npm run lint` — catches style + React rules.
2. `npm run build` — catches TypeScript errors, missing imports, and route problems.
3. `npm run dev` — open the page in a **private/incognito window** (browser extensions can corrupt hydration).
4. Open DevTools → Console for runtime errors; Application → Local Storage to inspect/clear `tobarok.*` keys.

### Symptom → cause → fix

| Symptom | Likely cause | Fix |
|---|---|---|
| "Hydration failed: server text didn't match" | Client first render reads `localStorage`, `Date.now()`, `Math.random()`, or locale-dependent dates | Use `useSyncExternalStore` with `getServerSnapshot` (see StoreProvider), or defer to a `useEffect`. Never read `window` during the first render. |
| ESLint `react-hooks/set-state-in-effect` | `setState()` called synchronously in an effect | Refactor to `useSyncExternalStore`, event handlers, or derived state. Don't blanket-disable the rule. |
| Build: "Module not found" | Missing import or deleted file | Read the full path in the error; verify `@/` alias in `tsconfig.json`. |
| `next/image` throws hostname error | Image from a new host | Add hostname to `images.remotePatterns` in `next.config.ts`; restart dev/build. |
| Broken product image | Unsplash id wrong/deleted | `SmartImage` falls back automatically; verify the id returns HTTP 200. |
| Cart badge shows 0 after refresh, then corrects | Expected — store hydrates after mount | Not a bug. Check `tobarok.cart` in Local Storage if it stays wrong. |
| Clicking a link 404s | A real route is missing (catch-all would normally catch it) | Create the missing route or fix the `href` in `lib/data.ts` / components. |
| `params` is undefined / not a plain object | Next 16 Promise params not awaited | `const { slug } = await params;` |
| Forms say "demo" | Backend not connected yet | Follow Part 10. |

### Common dev commands

```bash
npm run lint            # lint only
npm run build           # typecheck + build only
npx next start          # serve build on :3000
npx next start -p 3777  # serve on another port (e.g. smoke-testing)
```

---

## 10. Backend Integration

### Recommended architecture

```
e-com/
├── client/     # this app (Next.js frontend)
└── server/     # new — Express (or Fastify/Hono/NestJS) + Prisma + PostgreSQL/SQLite
```

> Why a separate server? Orders, auth and tracking need a real database. You may instead use Next.js API route handlers (`app/api/**/route.ts`) if you prefer a single deployment — everything below still applies, with the `NEXT_PUBLIC_API_URL` optional.

### Client API layer

Create `client/.env.local` and commit a `.env.example`:

```env
# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Create `lib/api.ts` — the single place the frontend talks to the backend:

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Request failed");
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}
```

> Use `cache: "no-store"` for cart/orders/auth. For catalog pages you can add `next: { revalidate: 60 }` per endpoint later.

### Server setup (Express + Prisma)

```bash
mkdir ../server && cd ../server
npm init -y
npm i express cors dotenv @prisma/client
npm i -D prisma typescript tsx @types/express @types/cors
npx prisma init
```

`prisma/schema.prisma` (start here, extend later):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "sqlite" for local dev
  url      = env("DATABASE_URL")
}

model Product {
  id             Int      @id @default(autoincrement())
  title          String
  image          String
  price          Int
  originalPrice  Int?
  badge          String?
  category       String?
  stock          Int      @default(10)
  createdAt      DateTime @default(now())
}

model Order {
  id        Int      @id @default(autoincrement())
  orderId   String   @unique // e.g. "TB-1042"
  name      String
  phone     String
  email     String
  address   String
  district  String
  postCode  String
  payment   String
  items     Json
  subtotal  Int
  delivery  Int
  total     Int
  status    String   @default("Confirmed")
  createdAt DateTime @default(now())
}

model User {
  id           Int      @id @default(autoincrement())
  name         String?
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model Contact {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  subject   String
  message   String
  createdAt DateTime @default(now())
}

model CustomRequest {
  id        Int      @id @default(autoincrement())
  name      String
  phone     String
  productType String
  quantity  Int
  details   String?
  createdAt DateTime @default(now())
}
```

Run: `npx prisma migrate dev --name init` then `npx prisma generate`.

Minimal `server/index.ts`:

```ts
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:3000" }));
app.use(express.json());

// GET /api/products, GET /api/products/:id, POST /api/orders,
// POST /api/contact, POST /api/custom, POST /api/auth/register|login,
// GET /api/orders/:orderId  (tracking)

app.listen(4000, () => console.log("API on :4000"));
```

### Wiring each form / flow

| Page | Endpoint | Changes |
|---|---|---|
| **Checkout** (`CheckoutPage.tsx`) | `POST /api/orders` | Give inputs `name` attributes; on submit `await api("/orders", { method:"POST", body: JSON.stringify({ ...fields, items: cart, subtotal, delivery, total, payment }) })`; on success `clearCart()` + show confirmation with returned `orderId`. |
| **Track** (`TrackOrderPage.tsx`) | `GET /api/orders/:orderId?phone=` | Replace the hardcoded steps with the server response; render real `status` + timestamps. |
| **Contact** (`ContactPage.tsx`) | `POST /api/contact` | Serialize fields; `await api(...)` then show success/error. |
| **Custom** (`CustomPage.tsx`) | `POST /api/custom` (+ file upload endpoint) | Send fields; add `multipart/form-data` for the design file. |
| **Account** (`AccountPage.tsx`) | `POST /api/auth/register`, `POST /api/auth/login` | Submit credentials; store session cookie; add logout + dashboard view. |
| **Catalog** (`lib/data.ts` callers) | `GET /api/products` | Replace static imports with `await api<Product[]>("/products")` in server components; keep `data.ts` only as fallback. |

Also handle: loading + error states in every `await api(...)` call (e.g. disable the submit button, show a red error banner, re-enable on failure).

### Auth strategy

- Issue an **`httpOnly` cookie session** on the server (`Set-Cookie`) — never store tokens in `localStorage`.
- Client: read `/api/auth/me` in a server component or middleware to gate `/account` and `/checkout`.
- Passwords: `bcrypt` (or `argon2`). Never store plaintext.

### Images & env config

- If the backend serves images (e.g. `/uploads/...`), add its hostname to `next.config.ts` → `images.remotePatterns`, e.g.:
  ```ts
  { protocol: "https", hostname: "api.yourdomain.com", pathname: "/uploads/**" }
  ```
- Env vars used by the client must be prefixed `NEXT_PUBLIC_` to be inlined into the browser bundle. Secrets (DB url, payment keys) live only on the server.

### Deployment checklist

1. Deploy the API + database (e.g. Railway / Render / a VPS); set `DATABASE_URL`, `CLIENT_URL` (CORS), and any payment/webhook keys.
2. Add the API domain to client `next.config.ts` `remotePatterns` if it serves images.
3. Set `NEXT_PUBLIC_API_URL` on the client hosting platform (Vercel / Netlify).
4. Update the `<form>` demo texts ("This is a demo…") in checkout/contact/custom/account/track.
5. Add HTTPS everywhere; keep CORS restricted to your real frontend origin.
6. Add real payment gateway (bKash / Nagad / SSLCommerz / Stripe) — the checkout page already collects the `payment` choice.

---

## 11. Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server (`:3000`) |
| `npm run build` | Typecheck + production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
