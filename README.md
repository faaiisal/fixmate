# FixMate
### Smart Device & Home Appliance Repair Service Platform

FixMate is an online repair service platform that connects customers with skilled technicians. Customers can explore repair services, request a repair, track their booking status, and pay securely after the repair is completed.

## Live Website
**Live URLs (example, update with your actual Vercel deployment):**
- Frontend: `https://fixmate-psi.vercel.app`
- Backend API: `https://fixmate-server-snowy.vercel.app/api`

Local:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000/api`

## Getting Started

```bash
# Frontend
cd fixmate
npm install
npm run dev # http://localhost:3000

# Backend
cd fixmate-server
npm install
npm run dev # http://localhost:8000
```

## Environment Variables

**Frontend `.env.example` required vars (names only, never commit real values):**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
MONGODB_URI=mongodb+srv://...
MONGODB_DB=fixmatedb
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Backend `.env.example` required vars:**
```
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
DB_NAME=fixmatedb
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=same-as-frontend
BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd
IMGBB_API_KEY=your_imgbb_key
ALLOW_USERID_BEARER=false
```

## Admin Login
- **Current Admin (production DB):** `admin@epyra.com` — role `admin`, manually provisioned in MongoDB `user` collection, credential in `account` collection. Password is privately configured in the database and is **not** a published default credential.
- **Technician (seeded, default password `Password123!` hashed via BetterAuth scrypt, safe to run seed again):** `technician.seed1@fixmate.dev` / `technician.seed2@fixmate.dev` / `mobarak@epyra.com`
- **Customer (seeded, default password `Password123!`):** `customer.seed1@fixmate.dev` / `customer.seed2@fixmate.dev` / `robart@epyra.com`

Deleted Admin accounts: `admin1@epyra.com` and `smithadmin@epyra.com` are no longer present in MongoDB.

Public signup only allows `customer` or `technician` — even crafted `role:admin` request is forced to customer via server `databaseHooks`. Admin role remains valid for manually provisioned accounts like `admin@epyra.com`.

## Key Features Implemented (Phase 1-6)
- BetterAuth + MongoDB adapter, session cookie `better-auth.session_token`, 7 days expiry, databaseHooks role sanitization, watcher downgrades admin inserts.
- Backend auth: `authMiddleware` verifies session collection token + expiresAt, strict dev bypass `NODE_ENV=development && ALLOW_USERID_BEARER=true`, production blocks Bearer userId, cookie fallback for `credentials:include`.
- Role middlewares `verifyToken, verifyCustomer, verifyTechnician, verifyAdmin` per Challenge 2 table: 401 without token, 403 wrong role, ownership enforced via customerId/technicianId filters.
- Frontend middleware `src/middleware.ts` protects `/dashboard/*` redirect to `/sign-in`, dashboard layout role-based redirect to own dashboard.
- Security: `escapeRegExp` fixes ReDoS for 9 search regex, `/api/status` admin-only 401/403, health minimal, CORS prod-only trusted origins (comma-separated CLIENT_URL), security headers nosniff/DENY/CSP, rate limit 100/15min general 20/15min sensitive (upload, checkout), body limit 100kb JSON separate from 5MB multer image, sanitized error messages.
- Data compatibility: `user` collection singular reuse BetterAuth, serviceMode mapping `Home Visit→doorstep`, `Shop Drop-off→workshop`, `both` inclusive filter, category alias `AC→Air Conditioner`, `TV→Television`, `Laptop→Laptop & PC`, paymentStatus `unpaid→pending` alias, additive snapshots `technicianName/Email` on service create, `serviceTitle/serviceImage/category/technicianName/Email/customerName/Email/Phone` on booking, `stripeSessionId` alias `sessionId` + snapshots on payment, no collection rename.
- Image upload: Next `images.remotePatterns` for `i.ibb.co`, `*.imgbb.com`, `images.unsplash.com`, ServiceCard renders remote with fallback local WebP, file upload via `uploadApi.image` FormData, preview, ImgBB triple validation MIME/ext/magic numbers backend, 5MB limit.
- Booking detail: `/dashboard/customer/bookings/[id]` timeline requested→accepted→in-progress→completed, escrow, technician, invoice, cancel only requested, Pay Now only completed unpaid.
- Service edit: `my-services` edit pre-filled form, update calls `PUT /api/services/:id` which resets `approvalStatus pending` per spec.
- Search/filter/sort: Server-side via MongoDB regex escaped + category/serviceMode filters + sort `basePrice`/`createdAt`, URL persistence via `useSearchParams` + `router.push ?category=&search=&serviceMode=&sort=`, Home category cards link `/services?category=Air%20Conditioner` etc pre-filtered.
- Payment: Amount from DB `finalAmount ?? basePrice`, Stripe Checkout Session `success_url` contains `{CHECKOUT_SESSION_ID}`, verify via server `stripe.checkout.sessions.retrieve` checks `payment_status=paid`, updates booking `paymentStatus paid` only after verified, duplicate prevented via unique `bookingId` + `sessionId` indexes + `already_paid` check + webhook idempotency, webhook signature `stripe.webhooks.constructEvent`, mock fail-closed in production 503.

## Technologies & Packages
- Next.js 16.4.6, React 19.3, TypeScript 5
- Tailwind 4, shadcn/ui base-nova, @base-ui/react, lucide-react, sonner
- BetterAuth 1.7.26 + @better-auth/mongo-adapter, mongodb 7.9.1
- Express 5.3, Zod 4.6, Stripe 23.2, Multer 2.5, cookie-parser, cors, dotenv
- Custom rate-limit in-memory + security-headers manual (helmet/express-rate-limit recommended for prod)

## Project Purpose
FixMate makes device and home appliance repair easier by bringing customers and technicians together in one platform. It provides a simple way to find repair services, manage repair requests, track progress, and complete payments securely with escrow protection.

## Deployment Notes
- Frontend Vercel env: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`
- Backend Vercel env: `MONGODB_URI`, `DB_NAME`, `CLIENT_URL` (comma-separated trusted origins), `BETTER_AUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `IMGBB_API_KEY`, `ALLOW_USERID_BEARER=false`, `NODE_ENV=production`
- Health: `/api/health` public minimal for uptime, `/api/status` admin-only diagnostics.
- Seed: `npm run seed` repeatable upsert, preserves existing, 2 technicians 2 customers 12+ approved services across 7 categories, bookings different statuses, payments consistent.
