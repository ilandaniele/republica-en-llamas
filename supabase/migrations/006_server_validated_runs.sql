-- Runs are saved only by the submit-run edge function, which replays the
-- seed and decisions with the game engine and stores the score it computes.
-- Clients keep read access to their own runs but can no longer write them.

alter table public.game_runs
  add column if not exists crisis_express boolean not null default false,
  add column if not exists scenario_id text,
  add column if not exists decisions jsonb;

drop policy if exists "runs_insert_own" on public.game_runs;
drop policy if exists "runs_update_own" on public.game_runs;
drop policy if exists "events_insert_own" on public.run_events;

-- A run is identified by its player, seed and decisions, so resubmitting the
-- same game returns the stored run instead of saving a duplicate.
create unique index if not exists game_runs_submission_idx
  on public.game_runs (user_id, seed, md5(decisions::text))
  where decisions is not null;
