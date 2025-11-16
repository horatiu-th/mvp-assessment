-- Minimal schema for revenue tracking per team
create table if not exists public.teams (
  id uuid primary key,
  name text not null unique
);

create table if not exists public.financials (
  team_id uuid not null references public.teams(id) on delete cascade,
  season_year int not null,
  revenue numeric not null default 0,
  ebitda numeric not null default 0,
  primary key (team_id, season_year)
);

-- Enable Row Level Security
alter table public.teams enable row level security;
alter table public.financials enable row level security;

-- RLS Policies: Allow public read access for dashboard
-- This is a read-only dashboard, so we allow SELECT operations for all users
create policy "Allow public read access to teams"
  on public.teams
  for select
  using (true);

create policy "Allow public read access to financials"
  on public.financials
  for select
  using (true);

