-- Cap how many run tickets a user gets per day, so abandoning runs to shop for a seed has a bound.
-- start-run calls issue_run_ticket; it returns no row once the user reached the cap.

create index if not exists run_tickets_user_created_idx on public.run_tickets (user_id, created_at desc);
drop index if exists public.run_tickets_user_id_idx;

create or replace function public.issue_run_ticket(p_user_id uuid, p_seed bigint, p_daily_limit int)
returns table (id uuid, seed bigint)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));
  if (select count(*) from public.run_tickets t
      where t.user_id = p_user_id and t.created_at > now() - interval '1 day') >= p_daily_limit then
    return;
  end if;
  return query
    insert into public.run_tickets (user_id, seed) values (p_user_id, p_seed)
    returning run_tickets.id, run_tickets.seed;
end;
$$;

revoke all on function public.issue_run_ticket(uuid, bigint, int) from public, anon, authenticated;
grant execute on function public.issue_run_ticket(uuid, bigint, int) to service_role;
