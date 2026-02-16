# CLAUDE.md - barObar

## Development Commands

```bash
nvm use 20                   # Use Node 20+
npm install                  # Install dependencies
npm run dev                  # Start dev server
npm run build                # Build for production
npm run lint                 # Run ESLint
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema to MongoDB
npx prisma studio            # Open Prisma Studio
```

## Architecture

Multi-tenant SaaS for restaurant/hotel QR-based ordering.

**Roles:** SUPER_ADMIN (platform owner), ADMIN (hotel owner), MANAGER (hotel manager, shares login with waiters)

**Plans:** BASIC (core features) and PREMIUM (advanced features gated by subscription)

**Data Isolation:** All data scoped by `hotelId`. Hotels never see each other's data.

## Key Patterns

- **API Routes:** All business data through `/app/api/` routes
- **Multi-Tenant:** Every query filters by `hotelId` from session
- **Feature Gating:** `useSubscription` hook + `PremiumGate` component
- **Role Middleware:** `withRole()` and `withHotelScope()` in `lib/middleware/`
- **MongoDB IDs:** `@id @default(auto()) @map("_id") @db.ObjectId`

## Git Workflow

Feature branch → PR → approval → merge to main.
Branch format: `feat/N_feature-name`

## Security

- NEVER hardcode credentials
- ALWAYS use environment variables
- .env is gitignored
