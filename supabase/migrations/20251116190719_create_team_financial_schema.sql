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

