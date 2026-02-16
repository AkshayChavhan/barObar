# barObar

Multi-tenant SaaS platform for restaurant/hotel management with QR-based ordering.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **MongoDB** + Prisma ORM
- **NextAuth.js v5** (credentials-based, role-aware)
- **Zustand** + TanStack React Query
- **SSE** for real-time updates

## Getting Started

```bash
# Use Node 20+
nvm use 20

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

## Project Structure

See `documents/architecture/ARCHITECTURE.md` for full system architecture.

## Documentation

All documentation lives in the `documents/` directory:
- `architecture/` — System architecture
- `features/` — Feature specifications
- `claude-conversation/` — Development conversation logs
- `realtime-conversation/` — Exact conversation logs and summaries per feature
- `tech-stack/` — Technology documentation
- `layman-flow/` — Simple feature explanations
- `tech-flow/` — Technical flow diagrams
