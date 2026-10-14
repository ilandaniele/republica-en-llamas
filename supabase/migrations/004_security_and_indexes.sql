-- ─── 004: close entitlement self-grant hole, RLS initplan, query-driven indexes ──

-- SECURITY: the old policy had no role clause, so any authenticated user could
-- insert their own paid entitlements. The Stripe webhook uses the service role,
-- which bypasses RLS, so no insert policy is needed at all.
drop policy if exists "Service role insert entitlements" on public.user_entitlements;

-- RLS: wrap auth.uid() in a subselect so Postgres evaluates it once per statement
-- (initPlan) instead of once per row, and scope every policy to `authenticated`.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "runs_select_own" on public.game_runs;
drop policy if exists "runs_insert_own" on public.game_runs;
drop policy if exists "runs_update_own" on public.game_runs;
create policy "runs_select_own" on public.game_runs for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "runs_insert_own" on public.game_runs for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "runs_update_own" on public.game_runs for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "events_select_own" on public.run_events;
drop policy if exists "events_insert_own" on public.run_events;
create policy "events_select_own" on public.run_events for select to authenticated
  using (exists (select 1 from public.game_runs r where r.id = run_id and r.user_id = (select auth.uid())));
create policy "events_insert_own" on public.run_events for insert to authenticated
  with check (exists (select 1 from public.game_runs r where r.id = run_id and r.user_id = (select auth.uid())));

drop policy if exists "Users read own entitlements" on public.user_entitlements;
create policy "Users read own entitlements" on public.user_entitlements for select to authenticated
  using ((select auth.uid()) = user_id);

-- ─── Indexes, designed from the actual query patterns ─────────────────────────
-- Profile + history screens: where user_id = ? order by created_at desc limit N
create index if not exists game_runs_user_created_idx on public.game_runs (user_id, created_at desc);
drop index if exists public.game_runs_user_id_idx;

-- Leaderboard: completed runs ordered by score, optionally filtered by difficulty.
create index if not exists game_runs_leaderboard_idx on public.game_runs (score desc)
  where completed_at is not null;
create index if not exists game_runs_leaderboard_difficulty_idx on public.game_runs (difficulty, score desc)
  where completed_at is not null;
drop index if exists public.game_runs_score_idx;
drop index if exists public.game_runs_difficulty_idx;
drop index if exists public.game_runs_created_at_idx;

-- Redundant with unique (run_id, turn_number) and unique (user_id, entitlement).
drop index if exists public.run_events_run_id_idx;
drop index if exists public.run_events_turn_idx;
drop index if exists public.user_entitlements_user_id_idx;

-- ─── Leaderboard view ──────────────────────────────────────────────────────────
-- The old view applied `order by ... limit 100` before the client's difficulty
-- filter, so per-difficulty boards came back short. Ordering/limit now live in
-- the query, which the partial indexes above serve.
create or replace view public.leaderboard as
  select
    gr.id, gr.user_id, p.username, p.avatar_url, gr.difficulty, gr.score,
    gr.turns_survived, gr.is_win, gr.game_over_reason, gr.language, gr.created_at
  from public.game_runs gr
  join public.profiles p on gr.user_id = p.id
  where gr.completed_at is not null;

grant select on public.leaderboard to anon, authenticated;

-- Pin search_path on the security definer trigger function.
alter function public.handle_new_user() set search_path = public;
