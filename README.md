# MVP Assessment - Team Financial Dashboard

A Next.js dashboard application for viewing team financial data including revenue and EBITDA metrics with year-over-year (YoY) analysis.

## Features

- **Team Selection**: Select from available teams to view their financial data
- **Revenue Chart**: Interactive area chart showing revenue trends over time
- **Financial Metrics Table**: Detailed table with revenue, EBITDA, and YoY calculations
- **Sortable Columns**: Sort by season year, revenue, EBITDA, or YoY metrics
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account (for database)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd mvp-assessment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
```

**Important**: Never commit `.env.local` or any environment files containing secrets. The `.gitignore` file is configured to exclude these files.

### 4. Set up the database

#### Option A: Using Supabase CLI (Local Development)

```bash
# Start Supabase locally
supabase start

# Run migrations
supabase db reset

# This will run migrations and seed data
```

#### Option B: Using Supabase Dashboard

1. Create a new Supabase project
2. Run the migration file: `supabase/migrations/20251116190719_create_team_financial_schema.sql`
3. Run the seed file: `supabase/seed.sql`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

- **teams**: Stores team information

  - `id` (uuid, primary key)
  - `name` (text, unique)

- **financials**: Stores financial data per team per season
  - `team_id` (uuid, foreign key to teams)
  - `season_year` (int)
  - `revenue` (numeric)
  - `ebitda` (numeric)
  - Primary key: (`team_id`, `season_year`)

### Row Level Security (RLS)

**RLS Policy Approach**: This is a read-only dashboard application, so we've implemented minimal RLS policies that allow public read access to both tables.

**Policies**:

- `teams` table: Public SELECT access (anyone can read team data)
- `financials` table: Public SELECT access (anyone can read financial data)

**Rationale**:

- The application is designed as a public dashboard with no authentication
- All data is intended to be publicly viewable
- No write operations are exposed through the API routes
- This minimal approach ensures the dashboard works without requiring user authentication while still enabling RLS (which is a Supabase best practice)

**Security Considerations**:

- The Supabase anon key is safe to expose in client-side code (it's designed for this)
- API routes use server-side Supabase client for additional security
- If authentication is needed in the future, policies can be updated to check `auth.uid()`

## API Routes

- `GET /api/teams` - Fetch all teams
- `GET /api/revenues?teamId=<uuid>` - Fetch financial data for a specific team

## Data Validation

- Each team has financial data for **3+ seasons** (2022, 2023, 2024)
- Year-over-year (YoY) calculations are computed client-side:
  - Revenue YoY: `((current_revenue - previous_revenue) / previous_revenue) * 100`
  - EBITDA YoY: `((current_ebitda - previous_ebitda) / previous_ebitda) * 100`
- First season for each team shows `—` for YoY metrics (no previous year to compare)

## Deployment

### Vercel Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
4. Deploy

The application will be available at your Vercel preview/production URL.

### Environment Variables for Production

Ensure these are set in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` - Your Supabase anon/public key

## Project Structure

```
mvp-assessment/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── providers/         # React Query provider
│   └── ui/                # shadcn/ui components
├── features/              # Feature-specific code
│   ├── components/        # Feature components
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── lib/                   # Library code
│   └── supabase/          # Supabase client setup
└── supabase/              # Database files
    ├── migrations/        # Database migrations
    └── seed.sql           # Seed data
```

## Acceptance Criteria Status

✅ **Data Correctness**: Each team displays 3 seasons (2022-2024); YoY calculations match financial data  
✅ **Chart Rendering**: Revenue chart updates when a different team is selected  
✅ **Deployment**: Ready for Vercel deployment (configure environment variables)  
✅ **RLS Note**: RLS policies documented above - minimal public read access  
✅ **Professionalism**: Clean UI, no secrets in repo, comprehensive README
