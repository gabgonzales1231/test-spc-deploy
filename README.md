# San Pablo City Government Website - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Environment Configuration](#environment-configuration)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Deployment](#deployment)
10. [Development Guidelines](#development-guidelines)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is the official government website for **San Pablo City, Laguna, Philippines** (also known as the "City of Seven Lakes"). The platform provides:

- Public access to city news, articles, and announcements
- Full Disclosure Portal for transparency compliance
- eGovernment services information
- City government structure and department information
- Media gallery and banner management
- Category-based content organization

**Current Version:** 0.1.0  
**Production URL:** https://sanpablocity.gov.ph

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16.0.1 (React 19.2.0)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 with @tailwindcss/typography
- **UI Components:** 
  - Radix UI primitives (@radix-ui/react-*)
  - shadcn/ui (New York style)
  - Lucide React icons
  - Tabler Icons
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **Theme:** next-themes for dark/light mode support
- **Carousel:** Embla Carousel React
- **Markdown:** react-markdown with remark-gfm for GitHub Flavored Markdown

### Backend
- **API Framework:** Elysia 1.4.15 (Bun-native framework)
- **Runtime:** Bun (recommended) or Node.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** @elysiajs/jwt for token-based auth
- **Validation:** Zod 4.1.12 for schema validation
- **CORS:** @elysiajs/cors for cross-origin requests
- **Static Files:** @elysiajs/static for serving public assets

### Development Tools
- **Linter:** ESLint 9 with Next.js config
- **Package Manager:** Bun (primary) / npm / yarn / pnpm
- **Build Tool:** Next.js with Turbopack (--turbopack flag)
- **Container:** Docker support included

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  │ (App Router) │  │   (UI/Lib)   │  │   (useApi)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Elysia)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │   Schemas    │  │    Utils     │     │
│  │ (REST APIs)  │  │    (Zod)     │  │  (Helpers)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (Supabase)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Categories  │  │   Articles   │  │    Media     │     │
│  │   Banners    │  │    Users     │  │   (Tables)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

1. **API Layer Pattern**: Custom `useApi` hook wraps all API calls with loading/error states
2. **Response Standardization**: All API responses follow consistent structure
3. **Error Handling**: Centralized error handler with custom `AppError` class
4. **Schema Validation**: Zod schemas for request/response validation
5. **Separation of Concerns**: Clear separation between routes, schemas, and utilities

---

## Project Structure

```
my-app/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── about-us/                 # About Us pages
│   │   ├── disclosure-portal/        # Full Disclosure Portal
│   │   ├── news/                     # News listing and detail pages
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   │
│   ├── backend/                      # Backend API (Elysia)
│   │   ├── config/
│   │   │   └── database.ts           # Supabase client configuration
│   │   ├── routes/                   # API route handlers
│   │   │   ├── articles.ts           # Article CRUD operations
│   │   │   ├── categories.ts         # Category management
│   │   │   ├── media.ts              # Media/file operations
│   │   │   └── banners.ts            # Banner management
│   │   ├── schemas/                  # Zod validation schemas
│   │   │   ├── articles.ts
│   │   │   ├── categories.ts
│   │   │   └── responses.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── error.ts              # Error handling
│   │   │   ├── response.ts           # Response formatters
│   │   │   └── helpers.ts            # General helpers
│   │   └── elysia.ts                 # Main Elysia app configuration
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── client/                   # Client-side components
│   │   └── city-government/          # Specific feature components
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useApi.ts                 # API integration hook
│   │
│   ├── lib/                          # Utility libraries
│   │   └── utils.ts                  # Helper functions
│   │
│   └── styles/                       # Global styles
│       └── global.css                # Tailwind directives
│
├── public/                           # Static assets
│   ├── images/                       # Images
│   └── ...                           # Other static files
│
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── next.config.js                    # Next.js configuration
├── components.json                   # shadcn/ui configuration
├── Dockerfile                        # Docker container setup
├── .gitignore                        # Git ignore rules
└── README.md                         # Basic readme
```

### Key Directories Explained

- **`src/app/`**: Next.js 13+ App Router pages with file-based routing
- **`src/backend/`**: Complete backend API built with Elysia
- **`src/components/`**: Reusable React components (UI library + custom)
- **`src/hooks/`**: Custom React hooks for shared logic
- **`public/`**: Static assets served directly

---

## Setup & Installation

### Prerequisites

- **Node.js:** v20 or higher
- **Bun:** Latest version (recommended) OR npm/yarn/pnpm
- **Supabase Account:** For database access
- **Git:** For version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-app
```

#### 2. Install Dependencies

**Using Bun (Recommended):**
```bash
bun install
```

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm:**
```bash
pnpm install
```

#### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials (see [Environment Configuration](#environment-configuration) section).

#### 4. Run Development Server

**Using Bun:**
```bash
bun run dev
```

**Using npm:**
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

The API will be available at: **http://localhost:3000/api**

#### 5. Verify Installation

- Visit http://localhost:3000 - You should see the homepage
- Visit http://localhost:3000/api/health - Should return `{"status":"healthy"}`
- Visit http://localhost:3000/api/status - Should return API status

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_service_role_key

# ============================================
# API CONFIGURATION
# ============================================
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
JWT_SECRET=super-secret-jwt-key-change-this-in-production

# ============================================
# NODE ENVIRONMENT
# ============================================
NODE_ENV=development
```

### Environment Variable Details

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (for public access) | ✅ Yes | - |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase service role key (for admin operations) | ✅ Yes | - |
| `NEXT_PUBLIC_FRONTEND_URL` | Frontend URL for CORS | ✅ Yes | http://localhost:3000 |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ Yes | super-secret-jwt-key |
| `NODE_ENV` | Environment mode | No | development |

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

⚠️ **Security Warning:** Never commit `.env.local` to version control!



## Frontend Components

### Custom Hook: `useApi`

Located at: `src/hooks/useApi.ts`

A custom React hook for handling API calls with loading/error states.

#### Usage Example

```tsx
import { useGetArticles } from '@/hooks/useApi';

function ArticlesPage() {
  const { data, loading, error, execute } = useGetArticles();

  useEffect(() => {
    execute({ page: 1, limit: 10 });
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render articles */}</div>;
}
```

#### Hook Interface

```typescript
interface UseApiReturn<T, A extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  execute: (...args: A) => Promise<ApiResponse<T> | null>;
  reset: () => void;
}
```

---

### UI Components

The project uses **shadcn/ui** components with the "New York" style. Components are located in `src/components/ui/`.

#### Available Components

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- And more...

#### Adding New Components

```bash
npx shadcn@latest add button
```

---

### Page Components

#### Home Page (`src/app/page.tsx`)

- Server-side rendered with metadata for SEO
- Uses `HomePageClient` component for interactivity
- Includes OpenGraph and Twitter Card metadata

#### News Page (`src/app/news/page.tsx`)

- Client-side rendered
- Fetches articles using `useGetArticles` hook
- Implements search and filtering

#### About Pages (`src/app/about-us/`)

- Static content pages
- City government structure
- Department information

#### Disclosure Portal (`src/app/disclosure-portal/`)

- Full Disclosure Policy compliance
- Displays ordinances, resolutions, executive orders
- Bids & awards, financial aid information

---

## Deployment

### Build for Production

```bash
bun run build
# or
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
bun run start
# or
npm start
```

Server runs on port 3000 by default.

---

### Docker Deployment

The project includes a `Dockerfile` for containerization.

#### Build Docker Image

```bash
docker build -t san-pablo-city-website .
```

#### Run Container

```bash
docker run -p 3000:3000 --env-file .env.local san-pablo-city-website
```

#### Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

---

### Deployment Platforms

#### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

#### Other Platforms

- **Railway:** Connect GitHub repo, add env vars, deploy
- **Netlify:** Configure build command: `next build`, publish directory: `.next`
- **AWS/Azure/GCP:** Use Docker container or serverless options

---

## Development Guidelines

### Code Style

- **TypeScript:** Strict mode enabled
- **ESLint:** Follow Next.js + TypeScript rules
- **File Naming:**
  - Components: PascalCase (`ArticleCard.tsx`)
  - Utilities: camelCase (`formatDate.ts`)
  - Pages: lowercase (`page.tsx`, `layout.tsx`)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/article-comments

# Make changes and commit
git add .
git commit -m "feat: add article comments functionality"

# Push and create PR
git push origin feature/article-comments
```

#### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build/config changes

---

### Adding New API Endpoints

1. **Create Schema** (in `src/backend/schemas/`)

```typescript
// src/backend/schemas/events.ts
import { z } from "zod";

export const EventSchema = z.object({
  event_id: z.number(),
  title: z.string(),
  date: z.coerce.date(),
  // ... other fields
});

export type Event = z.infer<typeof EventSchema>;
```

2. **Create Route Handler** (in `src/backend/routes/`)

```typescript
// src/backend/routes/events.ts
import { Elysia } from 'elysia';
import { supabase } from '@/backend/config/database';
import { successResponse } from '@/backend/utils/response';

export const eventRoutes = new Elysia({ prefix: '/events' })
  .get('/', async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*');
    
    if (error) throw new Error('Failed to fetch events');
    return successResponse(data);
  });
```

3. **Register in Main App** (`src/backend/elysia.ts`)

```typescript
import { eventRoutes } from '@/backend/routes/events';

export const app = new Elysia()
  // ... existing config
  .group('/api', (api) => {
    return api
      // ... existing routes
      .use(eventRoutes); // Add here
  });
```

4. **Create Frontend Hook** (in `src/hooks/useApi.ts`)

```typescript
export const useGetEvents = () => useApi<Event[]>(
  async () => apiClient('/events')
);
```

## Troubleshooting

### Common Issues

#### 1. **Port 3000 already in use**

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun run dev
```

---

#### 2. **Supabase Connection Error**

**Error:**
```
Failed to fetch articles: Invalid API key
```

**Solution:**
- Verify `.env.local` has correct Supabase credentials
- Check if Supabase project is active
- Ensure API keys haven't expired

---

#### 3. **Module Not Found**

**Error:**
```
Module not found: Can't resolve '@/components/ui/button'
```

**Solution:**
```bash
# Install shadcn component
npx shadcn@latest add button

# Or check tsconfig.json paths
```

---

#### 4. **Build Errors**

**Error:**
```
Type error: Property 'data' does not exist on type 'never'
```

**Solution:**
- Check TypeScript types match API response structure
- Run `bun run lint` to see all type errors
- Verify Zod schemas match database schema

---

#### 5. **CORS Errors**

**Error:**
```
Access to fetch at 'http://localhost:3000/api' has been blocked by CORS policy
```

**Solution:**
- Verify `NEXT_PUBLIC_FRONTEND_URL` in `.env.local`
- Check CORS configuration in `src/backend/elysia.ts`

---

### Debug Mode

Enable verbose logging:

```typescript
// src/backend/elysia.ts
export const app = new Elysia()
  .onError(({ code, error, set, path }) => {
    console.error('Error details:', { code, path, error }); // Add this
    // ... rest of error handler
  });
```

---

### Performance Monitoring

Check build size:

```bash
bun run build
# Look for output showing page sizes
```

Analyze bundle:

```bash
npm install -D @next/bundle-analyzer
# Configure in next.config.js
```
---

## Additional Resources

### Documentation Links

- **Next.js:** https://nextjs.org/docs
- **Elysia:** https://elysiajs.com/
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **Zod:** https://zod.dev/
- **TypeScript:** https://www.typescriptlang.org/docs

## Changelog

### Version 0.1.0 (Current)
- Initial project setup
- Categories, Articles, Media, Banners APIs
- Homepage, News, About Us pages
- Full Disclosure Portal
- Responsive design with Tailwind CSS
- SEO optimization

---

## License

This project is developed for the **City Government of San Pablo, Laguna, Philippines**.


**Last Updated:** November 14, 2025  

meow