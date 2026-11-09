-- Only edge functions may consume limits or persist a replayed run.
create table public.api_rate_limits (
  bucket_key text primary key check (length(bucket_key) between 1 and 200),
  window_start timestamptz not null,
  request_count integer not null check (request_count > 0)
);
alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from public, anon, authenticated;

create function public.consume_api_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
  v_now timestamptz := clock_timestamp();
begin
  if p_limit is null or p_window_seconds is null
    or p_limit not between 1 and 10000 or p_window_seconds not between 1 and 86400 then
    raise exception 'Invalid rate limit';
  end if;
  insert into public.api_rate_limits as limits (bucket_key, window_start, request_count)
  values (p_key, v_now, 1)
  on conflict (bucket_key) do update set
    window_start = case when limits.window_start <= v_now - make_interval(secs => p_window_seconds)
      then v_now else limits.window_start end,
    request_count = case when limits.window_start <= v_now - make_interval(secs => p_window_seconds)
      then 1 else least(limits.request_count + 1, p_limit + 1) end
  returning request_count into v_count;
  return v_count <= p_limit;
end;
$$;
revoke all on function public.consume_api_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer) to service_role;

create index api_rate_limits_window_start_idx on public.api_rate_limits(window_start);
create function public.prune_api_rate_limits()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted integer;
begin
  delete from public.api_rate_limits where bucket_key in (
    select bucket_key from public.api_rate_limits
    where window_start < now() - interval '1 day'
    order by window_start limit 10000
  );
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;
revoke all on function public.prune_api_rate_limits() from public, anon, authenticated;
grant execute on function public.prune_api_rate_limits() to service_role;

create function public.save_validated_run(
  p_user_id uuid,
  p_ticket_id uuid,
  p_config jsonb,
  p_state jsonb,
  p_decisions jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ticket public.run_tickets%rowtype;
  v_run public.game_runs%rowtype;
begin
  select * into v_ticket from public.run_tickets
    where id = p_ticket_id and user_id = p_user_id for update;
  if not found or v_ticket.seed is distinct from (p_config->>'seed')::bigint then
    raise exception 'Invalid run ticket';
  end if;
  if coalesce((p_state->>'isGameOver')::boolean, false) is not true
    or jsonb_typeof(p_decisions) is distinct from 'array'
    or jsonb_array_length(p_decisions) > 200
    or v_ticket.seed is distinct from (p_state->>'seed')::bigint
    or p_config ? 'careerStart' then
    raise exception 'Invalid validated run';
  end if;

  insert into public.game_runs (
    user_id, ticket_id, difficulty, seed, score, turns_survived, game_over_reason,
    is_win, final_state, language, crisis_express, scenario_id, decisions, completed_at
  ) values (
    p_user_id, p_ticket_id, p_state->>'difficulty', (p_state->>'seed')::bigint,
    (p_state->>'score')::integer, (p_state->>'turn')::integer, p_state->>'gameOverReason',
    p_state->>'gameOverReason' = 'term_complete', p_state, p_state->>'language',
    coalesce((p_config->>'crisisExpress')::boolean, false), p_config->>'scenarioId', p_decisions, now()
  ) on conflict do nothing returning * into v_run;

  if not found then
    select * into v_run from public.game_runs
    where user_id = p_user_id and (
      ticket_id = p_ticket_id or (seed = v_ticket.seed and decisions = p_decisions)
    ) order by created_at limit 1;
    if not found then raise exception 'Run conflict'; end if;
    return jsonb_build_object('id', v_run.id, 'score', v_run.score, 'duplicate', true);
  end if;

  insert into public.run_events (run_id, turn_number, card_id, choice_index, negotiation, effects_json)
  select v_run.id, (event->>'turn')::integer, event->>'cardId', (event->>'choiceIndex')::integer,
    event->>'negotiationUsed', event->'effectsApplied'
  from jsonb_array_elements(p_state->'history') as event;

  return jsonb_build_object('id', v_run.id, 'score', v_run.score);
end;
$$;
revoke all on function public.save_validated_run(uuid, uuid, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.save_validated_run(uuid, uuid, jsonb, jsonb, jsonb) to service_role;

-- Bound public profile payloads even when a caller bypasses the form.
alter table public.profiles add constraint profiles_username_length
  check (length(btrim(username)) between 1 and 64) not valid;
alter table public.profiles add constraint profiles_avatar_url_length
  check (avatar_url is null or length(avatar_url) <= 2048) not valid;

create or replace function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(length(btrim(name)) between 1 and 64, false)
    and not exists (select 1 from public.profiles where username = name);
$$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- The gateway also needs per-IP throttling for auth endpoints. Configure it in Supabase;
-- do not trust caller-supplied X-Forwarded-For as an application identity.
