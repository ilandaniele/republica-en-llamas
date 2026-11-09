-- Public usernames must not reveal the email: OAuth signups get a neutral generated handle.
create or replace function public.generated_username()
returns text
language sql
volatile
set search_path = ''
as $$
  select 'jugador_' || substr(md5(gen_random_uuid()::text), 1, 10);
$$;
revoke all on function public.generated_username() from public, anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_anonymous then
    return new;
  end if;
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data->>'username'), ''), public.generated_username())
  );
  return new;
end;
$$;

update public.profiles p
set username = public.generated_username()
from auth.users u
where p.id = u.id
  and nullif(btrim(u.raw_user_meta_data->>'username'), '') is null
  and p.username = split_part(u.email, '@', 1);

-- Players without full_access get the free daily cap on the server, not only in localStorage.
create or replace function public.daily_ticket_limit(p_user_id uuid, p_daily_limit int, p_free_daily_limit int)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when exists (
      select 1 from public.user_entitlements e
      where e.user_id = p_user_id and e.entitlement = 'full_access'
    ) then p_daily_limit
    else p_free_daily_limit
  end;
$$;
revoke all on function public.daily_ticket_limit(uuid, int, int) from public, anon, authenticated;

drop function if exists public.issue_run_ticket(uuid, bigint, int);
create or replace function public.issue_run_ticket(
  p_user_id uuid,
  p_seed bigint,
  p_daily_limit int,
  p_free_daily_limit int
)
returns table (id uuid, seed bigint)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));
  if (select count(*) from public.run_tickets t
      where t.user_id = p_user_id and t.created_at > now() - interval '1 day')
      >= public.daily_ticket_limit(p_user_id, p_daily_limit, p_free_daily_limit) then
    return;
  end if;
  return query
    insert into public.run_tickets (user_id, seed) values (p_user_id, p_seed)
    returning run_tickets.id, run_tickets.seed;
end;
$$;
revoke all on function public.issue_run_ticket(uuid, bigint, int, int) from public, anon, authenticated;
grant execute on function public.issue_run_ticket(uuid, bigint, int, int) to service_role;

-- A claimed ticket counts against the target's cap from the claim time; stale guest tickets expire.
drop function if exists public.claim_run_ticket(uuid, uuid, uuid, int);
create or replace function public.claim_run_ticket(
  p_ticket_id uuid,
  p_from_user uuid,
  p_to_user uuid,
  p_daily_limit int,
  p_free_daily_limit int
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext(p_to_user::text));
  if (select count(*) from public.run_tickets t
      where t.user_id = p_to_user and t.created_at > now() - interval '1 day')
      >= public.daily_ticket_limit(p_to_user, p_daily_limit, p_free_daily_limit) then
    return false;
  end if;
  update public.run_tickets set user_id = p_to_user, created_at = now()
  where id = p_ticket_id
    and user_id = p_from_user
    and created_at > now() - interval '1 day';
  return found;
end;
$$;
revoke all on function public.claim_run_ticket(uuid, uuid, uuid, int, int) from public, anon, authenticated;
grant execute on function public.claim_run_ticket(uuid, uuid, uuid, int, int) to service_role;
