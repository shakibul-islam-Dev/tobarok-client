# tobarok — E-Commerce Client

Full-stack e-commerce storefront for **tobarok**, a Bangladeshi t-shirt / streetwear brand. This is the **Next.js frontend**; it talks to a separate **Express + MongoDB backend** (in `../backend`) for auth, the product catalog, orders, uploads and payments.

Built with **Next.js 16 (App Router + Turbopack)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Better Auth** (sessions + RBAC) and `motion`.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Getting Started](#2-getting-started)
3. [Environment Variables](#3-environment-variables)
4. [Architecture: how the client talks to the backend](#4-architecture-how-the-client-talks-to-the-backend)
5. [Project Structure](#5-project-structure)
6. [Routes / Pages](#6-routes--pages)
7. [Components — purpose of each](#7-components--purpose-of-each)
8. [Lib — purpose of each module](#8-lib--purpose-of-each-module)
9. [Auth, Roles & Route Guards](#9-auth-roles--route-guards)
10. [File Uploads](#10-file-uploads)
11. [Recent Work (this session)](#11-recent-work-this-session)
12. [Conventions & Gotchas](#12-conventions--gotchas)
13. [Scripts](#13-scripts)

---

## 1. Tech Stack

| Layer        | Tech                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| Framework    | Next.js `16.2.12` (App Router, Turbopack)                                        |
| UI           | React `19.2.4`, TypeScript `5`                                                   |
| Styling      | Tailwind CSS `4`, `tw-animate-css`, `clsx` + `tailwind-merge` (`lib/utils.ts`)   |
| Auth         | `better-auth` + `@better-auth/mongo-adapter`, admin plugin (RBAC)                |
| Database     | MongoDB (via the backend; `mongodb` driver present for the legacy `lib/auth.ts`) |
| Icons        | `lucide-react`                                                                   |
| Animation    | `motion`                                                                         |
| Components   | shadcn-style primitives (`components/ui/*`)                                      |
| Client state | React `useSyncExternalStore` + `localStorage` (cart, wishlist, wallet)           |

> **Important (Next 16):** Dynamic route `params` is a **Promise** — always `await` it. `viewport` is a separate export from `metadata`. Bundled docs for this exact version live in `node_modules/next/dist/docs/`.

---

## 2. Getting Started

```bash
npm install        # install deps
npm run dev        # http://localhost:3000
```

The backend must also be running (see `../backend`, defaults to `:5000`). In dev, all `/api/*` and `/uploads/*` requests are proxied to it via `next.config.ts` rewrites.

**Verification ritual** (run before considering work done):

```bash
npm run lint && npm run build
```

---

## 3. Environment Variables

The project uses a slightly unusual env convention — **`NEXT_PUBLIC_URL` is the backend base URL**.

`.env.local` (dev — leave `NEXT_PUBLIC_URL` blank to use the Next.js proxy):

```env
BETTER_AUTH_URL=http://localhost:3000     # frontend origin (Better Auth)
NEXT_PUBLIC_URL=                          # blank = proxy /api/* to the backend
```

`.env` (committed defaults):

```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:5000     # backend base URL
MONGO_DB_URI=...                          # used by legacy lib/auth.ts
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Set `NEXT_PUBLIC_URL` to a real URL only if you want the browser to call the backend directly (e.g. testing from a phone). Otherwise keep it blank and let the proxy handle it.

---

## 4. Architecture: how the client talks to the backend

```
Browser → Next.js (:3000) --rewrite--> Express backend (:5000)
            /api/*       →  /api/*
            /uploads/*   →  /uploads/*
```

- `next.config.ts` rewrites `/api/:path*` and `/uploads/:path*` to `NEXT_PUBLIC_URL` (default `http://localhost:5000`).
- Auth is **cookie-based** (Better Auth). All client calls send `credentials: "include"` so the session cookie flows through the proxy.
- `lib/api.ts` — thin `fetch` wrapper for JSON endpoints.
- `lib/admin-api.ts` — typed helpers for the admin catalog endpoints.
- `lib/upload.ts` — multipart upload helpers for `/api/uploads`.
- `lib/auth-client.ts` — the Better Auth client (`useSession`, `signIn`, `signUp`, `signOut`, `updateUser`, `admin`).

Because images come back from the backend as absolute URLs but we store the **relative** `/uploads/<file>` path, `next/image` treats them as same-origin — no `remotePatterns` entry needed for uploads.

---

## 5. Project Structure

```
client/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: Poppins font, StoreProvider, Navigation, Footer, AdBanners, HistoryNav
│   ├── page.tsx                  # Homepage (composes home sections)
│   ├── globals.css               # Tailwind v4 theme tokens + utilities
│   ├── not-found.tsx             # Branded fallback for genuine errors
│   ├── [...slug]/                # Catch-all → redirects unknown URLs to /shop
│   │
│   ├── shop/ new/ most-wanted/ big-sale/ gift-voucher/
│   ├── collections/ [slug]/      # 18 dynamic category pages
│   ├── signature-series/ signature/[slug]/
│   ├── budget/[slug]/ accessories/[slug]/
│   ├── product/[id]/             # Product detail
│   ├── cart/ wishlist/ checkout/
│   │
│   ├── account/                  # Login / Register (Better Auth)
│   ├── dashboard/                # Customer + admin dashboard shell
│   ├── orders/ [id]/             # Order history + detail
│   ├── profile/                  # Edit profile + profile picture upload
│   ├── billing-address/ wallet/
│   ├── track/ custom/ contact/ faq/ store-locator/ size-chart/
│   ├── about/ terms/ privacy/ returns/
│   │
│   └── admin/                    # Admin panel (guarded)
│       ├── page.tsx              # Overview / stats
│       ├── products/             # Catalog CRUD (+ image upload)
│       ├── products/approvals/   # Product approval queue
│       ├── categories/ hero-slides/ outlets/ orders/
│       └── users/                # User management (superadmin)
│
├── components/
│   ├── home/                     # Homepage sections
│   ├── shop/                     # ShopPage, SlugPage
│   ├── product/                  # ProductPage
│   ├── cart/ checkout/ wishlist/
│   ├── pages/                    # Feature pages + admin pages + admin/ProductForm
│   ├── shared/                   # Navigation, Footer, UserMenu, AuthRequired, DashboardSidebar, useBackClose
│   ├── store/                    # StoreProvider (cart + wishlist)
│   ├── ads/                      # AdSlot, AdBanners, AdScript
│   └── ui/                       # Reusable primitives (button, SmartImage, ImageUploader, HistoryNav, …)
│
├── lib/                          # Data, API clients, auth, RBAC, domain helpers
├── next.config.ts                # Rewrites (/api, /uploads) + image remotePatterns
└── package.json
```

---

## 6. Routes / Pages

### Storefront (public)

| Route                                                | Purpose                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `/`                                                  | Homepage — hero, categories, highlights, product carousels, see/new tabs. |
| `/shop`                                              | Full catalog with client-side **search + sort** (`ShopPage`).             |
| `/new`, `/most-wanted`, `/big-sale`, `/gift-voucher` | Promo landing pages (curated product sets).                               |
| `/collections`                                       | Category hub — chip links to all 18 collection pages.                     |
| `/collections/[slug]`                                | Dynamic category grid; unknown slug → redirect `/shop`.                   |
| `/signature-series`, `/signature/[slug]`             | Signature-series hub + 5 dynamic pages.                                   |
| `/budget`, `/budget/[slug]`                          | Budget hub + 5 dynamic pages.                                             |
| `/accessories`, `/accessories/[slug]`                | Accessories hub + 5 dynamic pages.                                        |
| `/product/[id]`                                      | Product detail — gallery, size/qty, add-to-cart, related items.           |
| `/cart`                                              | Cart — qty +/-, remove, order summary, free-delivery threshold.           |
| `/wishlist`                                          | Saved items, move to cart.                                                |
| `/checkout`                                          | Checkout form + payment-method choice.                                    |

### Account (requires sign-in — wrapped in `AuthRequired`)

| Route              | Purpose                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/account`         | Login / Register (email+password and Google) via Better Auth.                                                                            |
| `/dashboard`       | Account dashboard — greeting, quick stats, recent orders, admin shortcuts. Fixed sidebar on desktop, right-side drawer on mobile/tablet. |
| `/orders`          | The signed-in customer's order history (demo data from `lib/order-data.ts`).                                                             |
| `/orders/[id]`     | Single order detail view.                                                                                                                |
| `/profile`         | Edit name + **profile picture upload** (Better Auth `updateUser`).                                                                       |
| `/billing-address` | Saved billing addresses.                                                                                                                 |
| `/wallet`          | Wallet balance + transaction ledger (localStorage demo).                                                                                 |

### Support & content (public)

| Route                                      | Purpose                                 |
| ------------------------------------------ | --------------------------------------- |
| `/track`                                   | Order tracking (demo 4-step tracker).   |
| `/custom`                                  | Custom/bulk order request form.         |
| `/contact`                                 | Contact form.                           |
| `/faq`, `/size-chart`, `/store-locator`    | FAQ, size guide, outlet list.           |
| `/about`, `/terms`, `/privacy`, `/returns` | Static legal/info pages (`SimplePage`). |

### Admin panel (requires `admin`/`superadmin` — `AuthRequired allowedRoles`)

| Route                       | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| `/admin`                    | Overview — store stats, quick actions.                    |
| `/admin/products`           | Product catalog CRUD; **image upload** via `ProductForm`. |
| `/admin/products/approvals` | Pending-product approval queue.                           |
| `/admin/categories`         | Category CRUD.                                            |
| `/admin/hero-slides`        | Homepage hero-slide CRUD.                                 |
| `/admin/outlets`            | Store-outlet CRUD.                                        |
| `/admin/orders`             | All orders + status updates.                              |
| `/admin/users`              | User management — roles, ban, sessions (superadmin only). |

### System

| Route               | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `app/[...slug]`     | Catch-all → `redirect("/shop")` for any unmatched URL. |
| `app/not-found.tsx` | Branded 404 for genuine server errors.                 |

---

## 7. Components — purpose of each

### `components/home/` — homepage sections

| Component         | Purpose                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `HeroCarousel`    | Auto-playing hero slider (arrows, dots, pause on hover).                                                       |
| `CategoryGrid`    | "Featured Categories" 12-card grid.                                                                            |
| `Highlights`      | Bento-style highlight cards.                                                                                   |
| `Inspire`         | 4-image lifestyle band.                                                                                        |
| `ProductCarousel` | Horizontal snap-scrolling product rail with left/right arrows + "Explore More" link (used 5× on the homepage). |
| `ProductCard`     | Single product card — image, title, price, wishlist heart, quick view.                                         |
| `SeeNewIn`        | Tabbed "SEE / NEW IN" product grid.                                                                            |
| `SectionHeading`  | Shared section title/subtitle heading.                                                                         |

### `components/shop/`

| Component  | Purpose                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------- |
| `ShopPage` | Product grid + search filter + sort dropdown; used by every catalog route.                |
| `SlugPage` | 404-safe wrapper — redirects to `/shop` when a slug has no data, else renders `ShopPage`. |

### `components/product/`

| Component     | Purpose                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| `ProductPage` | Product detail — gallery, size/qty selector, add-to-cart, related products. |

### `components/cart/`, `checkout/`, `wishlist/`

| Component      | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| `CartPage`     | Shopping-cart line items, quantity controls, order summary. |
| `CheckoutPage` | Checkout form (address, payment method) + place order.      |
| `WishlistPage` | Wishlist grid with "add to cart".                           |

### `components/pages/` — feature pages

| Component            | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `AccountPage`        | Login/Register tabs, email+password and Google sign-in.                       |
| `ProfilePage`        | Edit name + **profile-picture upload** (uses `ImageUploader` + `updateUser`). |
| `OrdersPage`         | Order-history table.                                                          |
| `OrderDetailPage`    | Single-order view (items, totals, address, status).                           |
| `BillingAddressPage` | Manage saved billing addresses.                                               |
| `WalletPage`         | Wallet balance, top-up form, transaction history.                             |
| `TrackOrderPage`     | Order-tracking UI (demo steps).                                               |
| `ContactPage`        | Contact form.                                                                 |
| `CustomPage`         | Custom/bulk order request form.                                               |
| `FaqPage`            | Accordion FAQ.                                                                |
| `StoreLocatorPage`   | Outlet list.                                                                  |
| `SimplePage`         | Generic static-content page (about/terms/privacy/returns/size-chart).         |

### `components/pages/` — admin pages

| Component             | Purpose                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `AdminShell`          | Layout for all `/admin/*` pages — breadcrumb + role-aware sidebar (uses `DashboardSidebar`). |
| `AdminOverviewPage`   | `/admin` stats dashboard.                                                                    |
| `AdminProductsPage`   | Product list table + create/edit/delete; opens `ProductForm`.                                |
| `admin/ProductForm`   | Add/edit product form with **image upload** (uses `ImageUploader`).                          |
| `AdminCategoriesPage` | Category CRUD.                                                                               |
| `AdminHeroSlidesPage` | Hero-slide CRUD.                                                                             |
| `AdminOutletsPage`    | Outlet CRUD.                                                                                 |
| `AdminOrdersPage`     | Order list + status management.                                                              |
| `AdminApprovalsPage`  | Product approval queue.                                                                      |
| `AdminUsersPage`      | User management (superadmin) — change roles, ban, revoke sessions.                           |

### `components/shared/`

| Component          | Purpose                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `Navigation`       | Sticky storefront header — announcement bar, logo, desktop mega menu, search, account/wishlist/cart (live badge), mobile drawer. |
| `Footer`           | Dark footer — link columns, socials, payment hints.                                                                              |
| `UserMenu`         | Header account dropdown — session-aware links, role badge, sign-out.                                                             |
| `AuthRequired`     | Route guard — shows loading, "please sign in", or "access denied" based on session + `allowedRoles`.                             |
| `DashboardSidebar` | Responsive dashboard sidebar shell — **fixed** on `lg+`, **right-side drawer** on tablet/mobile (floating Menu button).          |
| `useBackClose`     | Hook — closes a modal/drawer on browser-back.                                                                                    |

### `components/store/`

| Component       | Purpose                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `StoreProvider` | Cart + wishlist external store (`useSyncExternalStore` + `localStorage`), exposed via `useStore()`. |

### `components/ads/`

| Component   | Purpose                                             |
| ----------- | --------------------------------------------------- |
| `AdSlot`    | Single Google AdSense slot.                         |
| `AdBanners` | Top/footer banner ads (mounted in the root layout). |
| `AdScript`  | Loads the AdSense script.                           |

### `components/ui/` — reusable primitives

| Component         | Purpose                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `button`          | shadcn-style button (`cva` variants).                                                             |
| `navigation-menu` | Mega-menu primitives used by `Navigation`.                                                        |
| `SmartImage`      | `next/image` wrapper that falls back to `FALLBACK_IMAGE` on error.                                |
| `ImageUploader`   | Reusable image-upload control — preview + upload + remove, talks to `/api/uploads`.               |
| `HistoryNav`      | Floating **back/forward** history buttons (bottom-right), with real history-aware enable/disable. |
| `Breadcrumb`      | Breadcrumb trail.                                                                                 |
| `BackButton`      | History-aware back link (falls back to a href).                                                   |
| `QuickViewModal`  | Product quick-view dialog (size/qty/add-to-cart).                                                 |
| `NewsletterModal` | Newsletter signup popup.                                                                          |

---

## 8. Lib — purpose of each module

| Module                                   | Purpose                                                                                                                                                                                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data.ts`                                | **Single source of truth** for storefront demo data — currency, Unsplash images, hero slides, categories, the 5 product seed sets (`vibeProducts`, `mostWanted`, `newIn`, `bestDeal`, `deshiTalk`), page maps, navigation links, sizes, FAQs, outlets. |
| `api.ts`                                 | Low-level `fetch` wrapper for JSON backend endpoints (adds base URL + `credentials: include`).                                                                                                                                                         |
| `admin-api.ts`                           | Typed client for the admin catalog API (products, categories, hero slides, outlets, orders) — mirrors the backend Mongoose schemas.                                                                                                                    |
| `upload.ts`                              | Multipart upload helpers (`uploadFile`, `uploadFiles`) for `/api/uploads`; returns relative `/uploads/...` paths.                                                                                                                                      |
| `auth-client.ts`                         | Better Auth browser client — `useSession`, `signIn`, `signUp`, `signOut`, `updateUser`, `admin`.                                                                                                                                                       |
| `auth.ts`                                | **Legacy** server-side Better Auth instance (auth now runs in the backend; kept for reference).                                                                                                                                                        |
| `rbac.ts`                                | Better Auth access-control definitions (`user` / `admin` / `superadmin` roles + permissions).                                                                                                                                                          |
| `permissions.ts`                         | Role helpers — `hasRole`, `isAdmin`, `isSuperAdmin`, `roleLabel`, role ranks.                                                                                                                                                                          |
| `data.ts` (storefront) ↔ `admin-data.ts` | `admin-data.ts` holds **demo** admin orders/products used for stats on the dashboard.                                                                                                                                                                  |
| `order-data.ts`                          | Demo customer orders (`userOrders`) + status styles + totals helpers, shared by orders/dashboard.                                                                                                                                                      |
| `orders.ts`                              | Order-id helpers (`createOrderId`, `stripOrderHash`).                                                                                                                                                                                                  |
| `transactions.ts`                        | Wallet **ledger** domain logic — append-only transactions, idempotency keys, balance derived from the ledger.                                                                                                                                          |
| `use-ledger.ts`                          | `useWalletLedger()` — React hook syncing the wallet ledger to `localStorage` (cross-tab via `storage` events).                                                                                                                                         |
| `ads.ts`                                 | AdSense client/slot ids from env.                                                                                                                                                                                                                      |
| `utils.ts`                               | `cn()` — `clsx` + `tailwind-merge`.                                                                                                                                                                                                                    |

---

## 9. Auth, Roles & Route Guards

- **Provider:** Better Auth, cookie sessions, MongoDB adapter (runs in the backend). Email+password and Google OAuth.
- **Roles:** `user` (1) < `admin` (2) < `superadmin` (3), defined in `lib/rbac.ts` + `lib/permissions.ts`.
- **Client guard:** wrap a page in `components/shared/AuthRequired.tsx`:
  - No session → "Please sign in" + link to `/account`.
  - `allowedRoles={["admin","superadmin"]}` → 403 "Access Denied" for insufficient role.
- **Where used:** `/dashboard`, `/profile`, `/orders`, `/wallet`, `/billing-address` (any signed-in user) and all `/admin/*` (admin+), `/admin/users` (superadmin).

---

## 10. File Uploads

The backend exposes `POST /api/uploads` (single, field `file`) and `POST /api/uploads/multiple` (field `files`), both behind auth.

- `lib/upload.ts` posts `multipart/form-data` with the session cookie and returns a relative `/uploads/<filename>` path.
- `components/ui/ImageUploader.tsx` is the reusable control (preview / upload / remove / validation).
- Wired into:
  - **`components/pages/admin/ProductForm.tsx`** — admin uploads the product image.
  - **`components/pages/ProfilePage.tsx`** — user changes their profile picture.
- `next.config.ts` rewrites `/uploads/*` → backend, so uploaded images render same-origin through `next/image`.

---

## 11. Recent Work (this session)

Changes made most recently:

1. **File-upload service** — added `lib/upload.ts`, the `/uploads` rewrite in `next.config.ts`, and the reusable `components/ui/ImageUploader.tsx`.
2. **Admin product image upload** — wired `ImageUploader` into `components/pages/admin/ProductForm.tsx` (main image field accepts an uploaded file or a URL).
3. **Profile picture upload** — wired `ImageUploader` into `components/pages/ProfilePage.tsx` so users can change their avatar from their device.
4. **Responsive dashboard sidebar** — new `components/shared/DashboardSidebar.tsx`: fixed full-height sidebar on large screens, right-side slide-in drawer (floating Menu button) on tablet/mobile. Applied to `app/dashboard/Dashboard.tsx` and `components/pages/AdminShell.tsx`.
5. **Back/forward buttons** — kept the global `HistoryNav` floating control bottom-right and moved the dashboard Menu button to bottom-left so the two never overlap.
6. **Homepage sections** — removed `Influencers` and kept/restored `ProductCarousel` (5 product rails) on `app/page.tsx`.

---

## 12. Conventions & Gotchas

- **Currency:** format with `` `${CURRENCY}${n.toLocaleString("en-BD")}` `` (`CURRENCY = "৳"`).
- **Images:** use `SmartImage` (auto-fallback). External hosts must be added to `images.remotePatterns` in `next.config.ts`; `/uploads/*` works via the rewrite.
- **`params` is a Promise** in dynamic routes — `await` it.
- **Client boundary:** interactive components (store consumers, forms, carousels) need `"use client"`.
- **Hydration:** never read `localStorage` / `Date.now()` / `Math.random()` during the first render — use `useSyncExternalStore` with a `getServerSnapshot` (see `StoreProvider`, `use-ledger`).
- **No 404s in normal use:** unknown product ids/slugs/URLs redirect to `/shop`.
- **Backend coupling:** the frontend expects the backend at `NEXT_PUBLIC_URL` (or the dev proxy). Auth, catalog, orders, uploads and payments all live there.

---

## 13. Scripts

| Command         | What it does                 |
| --------------- | ---------------------------- |
| `npm run dev`   | Start dev server (`:3000`)   |
| `npm run build` | Typecheck + production build |
| `npm start`     | Serve the production build   |
| `npm run lint`  | ESLint                       |

create a ui where watch ads to earn point where user click he can watch ads and earn point.now make it on my walet and user can seen how many points he earn with this points he can buy any thing from our web site
