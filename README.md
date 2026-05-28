# CampusIQ — College Discovery Platform

A full-stack college discovery platform built with Next.js, TypeScript, TailwindCSS, Prisma, and PostgreSQL.

## Features

- **College Listing + Search** — search by name/location, filter by category, type, state; paginated grid
- **College Detail Page** — overview, courses, placements, recruiters (tabbed UI)
- **Compare Colleges** — side-by-side comparison of 2–3 colleges with best-value highlights

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **Deployment**: Vercel + Neon

---

## Local Setup

### 1. Clone & install

```bash
git clone <your-repo-url>
cd college-discovery
npm install
```

### 2. Set up PostgreSQL

Create `.env` file in root:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

### 3. Push schema & seed data

```bash
npm run db:push       # creates tables
npm run db:seed       # inserts 12 colleges
```

### 4. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---


```


---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List colleges with search & filters |
| GET | `/api/colleges?search=iit&category=Engineering&state=Delhi&page=1` | Filtered search |
| GET | `/api/colleges/:id` | Get college by ID |
| GET | `/api/colleges/compare?ids=1,2,3` | Compare 2-3 colleges |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── colleges/
│   │   ├── page.tsx          # Listing + search
│   │   └── [id]/page.tsx     # Detail page
│   ├── compare/
│   │   └── page.tsx          # Compare page
│   └── api/
│       └── colleges/
│           ├── route.ts           # GET /api/colleges
│           ├── [id]/route.ts      # GET /api/colleges/:id
│           └── compare/route.ts   # GET /api/colleges/compare
├── components/
│   ├── Navbar.tsx
│   └── CollegeCard.tsx
├── lib/
│   └── prisma.ts             # Prisma singleton
└── types/
    └── college.ts            # TypeScript interfaces
prisma/
├── schema.prisma
└── seed.ts
```
