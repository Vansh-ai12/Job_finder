# TechPulse — High-Signal Tech Jobs & News Aggregator

TechPulse is a production-ready, minimal job-opportunity and tech news aggregator built using **Next.js 15 (App Router, TypeScript)** and **Tailwind CSS**.

- **Zero Database** • **Zero Auth** • **Zero Paid APIs** • **Zero Environment Variables**
- Deploys on **Vercel** with out-of-the-box zero configuration.
- Next.js ISR (Incremental Static Regeneration) caches job data for 1 hour (`revalidate: 3600`) and tech news for 15 minutes (`revalidate: 900`).

---

## Features

1. **Multi-Source Job Aggregator**:
   - **Greenhouse Public ATS**: Stripe, Databricks, OpenAI, Scale AI, Cloudflare, Figma, Datadog, Coinbase, Discord, Reddit, Pinterest, Dropbox, Instacart, Snowflake.
   - **Ashby Public ATS**: Anthropic, Notion, Mistral AI, Perplexity.
   - **Lever Public ATS**: Cohere, Palantir.
   - **Workday Public CXS**: NVIDIA, Adobe, Salesforce.
   - **Unofficial Big-Tech Portals**: Amazon, Google, Microsoft.
2. **Normalized Job Data**:
   - Categorized into `SWE`, `AI/ML`, `Data`, `Infra`, `Security`, or `Other`.
   - Seniority level classified into `Intern`, `New Grad`, `Mid`, `Senior`, or `Unknown`.
   - Non-engineering roles (recruiting, sales, legal, marketing, office administration) are automatically filtered out.
   - Deduplicated by URL and sorted newest first.
3. **Interactive Client-Side Filtering**:
   - Instant search across job titles, companies, and locations.
   - Category chips, level chips, and company selector.
   - "Remote Only" toggle.
   - State synced seamlessly to URL search params (e.g. `/?category=AI%2FML&remote=true`) so filtered views are easily shareable.
   - "Load more" pagination (24 cards at a time).
4. **Curated Tech News**:
   - Hacker News front page & AI-specific searches (`hn.algolia.com`).
   - Dev.to top engineering articles (`dev.to/api`).
5. **Modern Design & UX**:
   - Dark-first aesthetic with a clean light mode toggle (stored in `localStorage`, respects `prefers-color-scheme`, zero FOUC).
   - Brand-tailored gradient avatars for each company (NVIDIA green, Google multi/blue, Microsoft blue, OpenAI emerald, Anthropic gold, etc.).
   - Full keyboard accessibility and WCAG AA contrast.
   - JSON API endpoints exposed at `/api/jobs` and `/api/news`.

---

## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── jobs/route.ts      # Cached JSON feed of normalized jobs
│   │   └── news/route.ts      # Cached JSON feed of tech news
│   ├── components/
│   │   ├── Badge.tsx          # Status, category, and level badges
│   │   ├── Filters.tsx        # Search bar, category chips, remote toggle
│   │   ├── Hero.tsx           # Headline & live metric counters
│   │   ├── JobCard.tsx        # High-contrast card with brand gradient
│   │   ├── JobList.tsx        # Client component with URL sync & pagination
│   │   ├── Navbar.tsx         # Sticky glassmorphism header with tabs
│   │   ├── NewsCard.tsx       # Hacker News & Dev.to article card
│   │   ├── NewsList.tsx       # News tabs (Top stories, AI & LLM)
│   │   ├── Skeleton.tsx       # Loading skeleton placeholders
│   │   └── ThemeToggle.tsx    # Light/Dark mode switcher
│   ├── news/
│   │   └── page.tsx           # Server component for news feed
│   ├── globals.css            # Tailwind directives & theme variables
│   ├── layout.tsx             # Root layout with FOUC prevention script
│   └── page.tsx               # Server component for jobs aggregator
├── lib/
│   ├── fetchers/
│   │   ├── amazon.ts          # Amazon jobs search adapter
│   │   ├── ashby.ts           # Ashby public API adapter
│   │   ├── devto.ts           # Dev.to articles adapter
│   │   ├── google.ts          # Google careers adapter / official portal
│   │   ├── greenhouse.ts      # Greenhouse public boards API adapter
│   │   ├── hackernews.ts      # Hacker News Algolia search adapter
│   │   ├── lever.ts           # Lever public postings API adapter
│   │   ├── microsoft.ts       # Microsoft careers adapter / official portal
│   │   └── workday.ts         # Workday CXS public API adapter (NVIDIA, etc.)
│   ├── companies.ts           # Single source of truth for company configurations
│   ├── jobs.ts                # Parallel orchestrator with Promise.allSettled
│   ├── news.ts                # News orchestrator
│   ├── normalize.ts           # Category, level & role classifier
│   ├── timeago.ts             # Human-readable relative time formatter
│   └── types.ts               # TypeScript data definitions
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## How to Add a Company

All company configurations live in `lib/companies.ts`. Adding a company is a single entry in the `COMPANIES` array:

### 1. Adding a Greenhouse Company
```ts
{
  name: "GitHub",
  source: "greenhouse",
  slug: "github",
  careersUrl: "https://github.com/about/careers",
  colorFrom: "from-purple-600",
  colorTo: "to-zinc-900",
}
```

### 2. Adding an Ashby Company
```ts
{
  name: "Ramp",
  source: "ashby",
  slug: "ramp",
  careersUrl: "https://ramp.com/careers",
  colorFrom: "from-lime-500",
  colorTo: "to-emerald-700",
}
```

### 3. Adding a Lever Company
```ts
{
  name: "Palantir",
  source: "lever",
  slug: "palantir",
  careersUrl: "https://www.palantir.com/careers",
  colorFrom: "from-neutral-700",
  colorTo: "to-zinc-950",
}
```

### 4. Adding a Workday Company
```ts
{
  name: "NVIDIA",
  source: "workday",
  tenant: "nvidia",
  wdN: "wd5",
  site: "NVIDIAExternalCareerSite",
  careersUrl: "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite",
  colorFrom: "from-green-500",
  colorTo: "to-emerald-800",
}
```

Any endpoint failure is safely isolated by `Promise.allSettled` and an 8-second `AbortController` timeout, so invalid or offline boards will never break the rest of the application.

---

## Unofficial Adapters Notice

The adapters for **Google**, **Microsoft**, **Amazon**, and **Workday** use public search endpoints or official deep-link search portals. Because these companies do not offer guaranteed static public APIs, their endpoints are:
1. Wrapped in isolated `try / catch` blocks.
2. Protected with an 8-second `AbortController` timeout.
3. Configured to fall back gracefully to verified official career portal deep-links pre-filtered for Software Engineering and AI roles. No fake jobs are ever invented.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel

This repository is optimized for immediate zero-config deployment on Vercel:

### Via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Via GitHub
1. Push your repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Click **Deploy** (no environment variables required).
