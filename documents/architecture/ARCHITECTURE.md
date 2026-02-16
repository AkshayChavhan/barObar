# barObar - System Architecture

## Overview

barObar is a multi-tenant SaaS platform for restaurant/hotel QR-based ordering. Each hotel operates as an isolated tenant with its own menu, orders, tables, and analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | MongoDB + Prisma 6 ORM |
| Auth | NextAuth.js v5 (credentials, role-aware) |
| Real-Time | SSE (Server-Sent Events) |
| State | Zustand (client) + TanStack React Query (server) |
| Forms | React Hook Form + Zod |
| QR Codes | qrcode (generation) + html5-qrcode (scanner) |
| Payments | Stripe (subscriptions + premium features) |
| Charts | Recharts |

## Multi-Tenant Architecture

### Data Isolation

Every data model is scoped by `hotelId`. Hotels never see each other's data.

```
SUPER_ADMIN dashboard → sees all hotels, platform stats
  └── Hotel A (ADMIN + MANAGER)
  │     ├── Hotel A's Menu
  │     ├── Hotel A's Orders
  │     ├── Hotel A's Tables
  │     └── Hotel A's Analytics
  └── Hotel B (ADMIN + MANAGER)
        ├── Hotel B's Menu
        ├── Hotel B's Orders
        └── ...completely separate
```

### Tenant Scoping Pattern

```typescript
const user = await getServerSession(authOptions);
const hotelId = user.hotelId; // null for SUPER_ADMIN

const orders = await prisma.order.findMany({
  where: { hotelId }
});
```

## Role-Based Access Control

| Role | Who | Scope |
|------|-----|-------|
| SUPER_ADMIN | Platform owner | All hotels, subscriptions, platform analytics |
| ADMIN | Hotel owner (1 per hotel) | Menu, prices, tables, QR codes, hotel settings |
| MANAGER | Hotel manager (per hotel) | View-only dashboard + order taking (shared with waiters) |

## QR Code Flow

### Two QR Codes

1. **Hotel Menu QR** — Printed at hotel, scanned by customer to browse menu
2. **Customer Order QR** — Generated on customer's phone, scanned by waiter to process order

### Flow

```
Customer scans Hotel QR → browses menu → selects items → "Ready to Order"
  → Order QR appears on customer's phone screen
  → Customer calls waiter
  → Waiter scans Customer Order QR
  → Waiter sees selected items → assigns table → adds add-ons → confirms
  → Order goes to kitchen (KDS) with real-time updates via SSE
```

## Subscription Plans

### Basic Plan
Menu, QR ordering, waiter dashboard, order management, KDS, real-time updates, feedback, analytics, multi-language, push notifications, PWA, menu modifiers.

### Premium Plan (Basic + extras)
Billing, Stripe payments, inventory, staff management, reservations, loyalty, dynamic pricing, wait time estimation, delivery/takeout, receipts, order history.

### Feature Gating

- `lib/constants/features.ts` — BASIC vs PREMIUM feature lists
- `lib/hooks/useSubscription.ts` — `{ plan, isPremium, checkFeature() }`
- `components/premium/PremiumGate.tsx` — Shows upgrade prompt for locked features
- API routes validate `subscription.plan` before premium operations

## Project Structure

```
app/
├── (public)/           # No auth: menu browsing, order tracking
├── (auth)/             # Sign-in, sign-up
├── (super-admin)/      # SUPER_ADMIN routes
├── (dashboard)/        # ADMIN + MANAGER hotel routes
└── api/                # All API endpoints

components/
├── ui/                 # shadcn/ui primitives
├── menu/               # Menu display components
├── order/              # Cart, order QR, summaries
├── waiter/             # QR scanner, order processing
├── kitchen/            # KDS board, order tickets
├── dashboard/          # Sidebar, stats, charts
├── super-admin/        # Platform management UI
├── premium/            # PremiumGate, UpgradeCard
└── common/             # Loading, errors, empty states

lib/
├── db.ts               # Prisma client singleton
├── auth.ts             # NextAuth config
├── constants/          # Roles, features, order statuses
├── middleware/          # withRole(), withHotelScope()
├── hooks/              # useSSE, useCart, useSubscription, useRole
├── validators/         # Zod schemas
├── utils/              # Helper functions
└── types/              # TypeScript types
```

## Database Schema

MongoDB with Prisma ORM. Key models:

- **User** — email, password (hashed), role, hotelId
- **Hotel** — name, slug, address, isActive, operating hours
- **Subscription** — plan (BASIC/PREMIUM), status, Stripe IDs
- **Menu / Category / MenuItem / MenuAddOn** — menu hierarchy
- **Table** — number, capacity, status
- **OrderSession** — customer's selected items before waiter confirms
- **Order / OrderItem** — confirmed orders with status tracking
- **Feedback** — star ratings + comments
- **TaxRate** — configurable per hotel

All hotel-scoped models include `hotelId` field for tenant isolation.

## Real-Time Architecture

Server-Sent Events (SSE) for live updates:
- Kitchen ↔ Waiter: order status changes
- Waiter ↔ Customer: order confirmation and progress
- Hotel-scoped SSE channels ensure data isolation

## Security

- Password hashing with bcrypt
- JWT-based sessions via NextAuth
- Role middleware on all API routes
- Hotel ID scoping on all data queries
- Environment variables for all secrets
