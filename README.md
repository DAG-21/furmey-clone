# Furmey — Luxury Pet Fashion E-Commerce

A production-ready full-stack luxury pet fashion e-commerce site built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Auth.js.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Auth | Auth.js v5 (next-auth@beta) |
| State | Zustand (cart + wishlist) |
| Forms | React Hook Form + Zod |

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/furmey?schema=public"
AUTH_SECRET="your-super-secret-at-least-32-chars"
```

### 3. Run all setup commands

```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run DB migrations
npm run db:seed       # Seed with sample data
npm run dev           # Start development server
```

Visit [http://localhost:3000](http://localhost:3000)

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@furmey.com | admin123 |
| Customer | user@furmey.com | user1234 |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run DB migrations (name: init) |
| `npm run db:push` | Push schema without migration file |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset DB and re-seed |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured products, collections, testimonials |
| `/shop` | Product listing with filters, search, sorting |
| `/shop/[slug]` | Product detail with gallery, variants, reviews |
| `/collections` | Collections grid |
| `/collections/[slug]` | Collection products |
| `/about` | Brand story, team, values |
| `/contact` | Contact form |
| `/login` | Sign in |
| `/register` | Create account |
| `/wishlist` | Saved products (Zustand-persisted) |
| `/cart` | Shopping cart |
| `/dashboard` | User orders, addresses, reviews |
| `/admin` | Admin dashboard (ADMIN role required) |

## Database Models

`User`, `Account`, `Session`, `Category`, `Collection`, `Product`, `CollectionProduct`, `ProductImage`, `Variant`, `Inventory`, `Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `Order`, `OrderItem`, `Address`, `Review`

## Project Structure

```
src/
├── app/                  # Next.js App Router pages + API routes
├── components/
│   ├── cart/             # CartSheet slide-over
│   ├── home/             # Hero, Featured*, Testimonials, Newsletter
│   ├── layout/           # Navbar, Footer
│   ├── products/         # ProductCard, Grid, Filters, Reviews
│   └── providers/        # SessionProvider + ThemeProvider
├── lib/
│   ├── auth.ts           # Auth.js config (JWT + Credentials)
│   ├── prisma.ts         # Prisma singleton
│   └── validations.ts    # Zod schemas
├── store/
│   ├── cart.ts           # Zustand cart (localStorage)
│   └── wishlist.ts       # Zustand wishlist (localStorage)
└── types/                # Shared TypeScript types + next-auth.d.ts
```

## Notes

- Product images use Unsplash placeholder URLs from seed data. Replace with real CDN images in production.
- Cart and wishlist use Zustand with localStorage persistence. The `/api/cart` and `/api/wishlist` routes provide server-side sync for authenticated users.
- This project uses shadcn/ui with `@base-ui/react` (not Radix UI). The `asChild` prop is unavailable — use `buttonVariants()` with `<Link>` for link-styled buttons.
- No payment integration — add Stripe to the checkout flow when ready.
