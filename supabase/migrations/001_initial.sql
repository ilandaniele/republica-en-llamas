-- ─── República en Llamas — Initial Database Migration ──────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Links to auth.users, stores public display info
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ─── Game runs ────────────────────────────────────────────────────────────────
-- One row per complete playthrough
create table if not exists public.game_runs (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  difficulty      text not null check (difficulty in ('easy', 'normal', 'hard', 'crisis')),
  seed            bigint not null,
  score           integer not null default 0,
  turns_survived  integer not null default 0,
  game_over_reason text,
  is_win          boolean not null default false,
  final_state     jsonb,                      -- snapshot of GameState at game over
  language        text not null default 'es',
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists game_runs_user_id_idx on public.game_runs(user_id);
create index if not exists game_runs_score_idx on public.game_runs(score desc);
create index if not exists game_runs_created_at_idx on public.game_runs(created_at desc);
create index if not exists game_runs_difficulty_idx on public.game_runs(difficulty);

-- ─── Run events ───────────────────────────────────────────────────────────────
-- Per-turn event log for run replay and server-side score validation
create table if not exists public.run_events (
  id              uuid primary key default uuid_generate_v4(),
  run_id          uuid not null references public.game_runs(id) on delete cascade,
  turn_number     integer not null,
  card_id         text not null,
  choice_index    integer not null,
  negotiation     text,                       -- NegotiationType if used
  effects_json    jsonb not null,             -- ChoiceEffect applied
  state_snapshot  jsonb,                      -- optional: GameState before this choice
  created_at      timestamptz not null default now(),

  unique(run_id, turn_number)
);

create index if not exists run_events_run_id_idx on public.run_events(run_id);
create index if not exists run_events_turn_idx on public.run_events(run_id, turn_number);

-- ─── Leaderboard view ────────────────────────────────────────────────────────
-- Public top 100 runs ordered by score
create or replace view public.leaderboard as
  select
    gr.id,
    gr.user_id,
    p.username,
    p.avatar_url,
    gr.difficulty,
    gr.score,
    gr.turns_survived,
    gr.is_win,
    gr.game_over_reason,
    gr.language,
    gr.created_at
  from public.game_runs gr
  join public.profiles p on gr.user_id = p.id
  where gr.completed_at is not null
  order by gr.score desc
  limit 100;

-- ─── Row Level Security ───────────────────────────────────────────────────────

-- profiles: users can only see/edit their own profile
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- game_runs: users own their runs; leaderboard handled by view
alter table public.game_runs enable row level security;

create policy "runs_select_own"
  on public.game_runs for select
  using (auth.uid() = user_id);

create policy "runs_insert_own"
  on public.game_runs for insert
  with check (auth.uid() = user_id);

create policy "runs_update_own"
  on public.game_runs for update
  using (auth.uid() = user_id);

-- run_events: users own their events
alter table public.run_events enable row level security;

create policy "events_select_own"
  on public.run_events for select
  using (
    auth.uid() = (
      select user_id from public.game_runs where id = run_id
    )
  );

create policy "events_insert_own"
  on public.run_events for insert
  with check (
    auth.uid() = (
      select user_id from public.game_runs where id = run_id
    )
  );

-- Leaderboard view is publicly readable (no RLS needed on views in Supabase by default)
-- Grant public access to the view
grant select on public.leaderboard to anon, authenticated;

-- ─── Auto-create profile on signup ──────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
