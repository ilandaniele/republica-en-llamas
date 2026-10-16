-- The server picks each run's seed, so a player cannot choose a favorable one.
-- start-run issues a ticket with the seed; submit-run saves at most one run per ticket.

create table if not exists public.run_tickets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  seed       bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists run_tickets_user_id_idx on public.run_tickets (user_id);

-- No policies: only the edge functions (service role) read or write tickets.
alter table public.run_tickets enable row level security;

alter table public.game_runs
  add column if not exists ticket_id uuid references public.run_tickets(id) on delete set null;

create unique index if not exists game_runs_ticket_idx
  on public.game_runs (ticket_id)
  where ticket_id is not null;
