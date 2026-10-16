-- Guests play as Supabase anonymous users, so their runs get a server-issued seed too.
-- An anonymous user has no profile; after login, claim-run-ticket moves the guest's ticket
-- to the real account so the finished run can be saved.

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
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

alter table public.run_tickets drop constraint if exists run_tickets_user_id_fkey;
alter table public.run_tickets
  add constraint run_tickets_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

-- Moves one ticket from an anonymous user to the signed-in user, inside the target's daily cap.
create or replace function public.claim_run_ticket(
  p_ticket_id uuid,
  p_from_user uuid,
  p_to_user uuid,
  p_daily_limit int
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext(p_to_user::text));
  if (select count(*) from public.run_tickets t
      where t.user_id = p_to_user and t.created_at > now() - interval '1 day') >= p_daily_limit then
    return false;
  end if;
  update public.run_tickets set user_id = p_to_user
  where id = p_ticket_id and user_id = p_from_user;
  return found;
end;
$$;

revoke all on function public.claim_run_ticket(uuid, uuid, uuid, int) from public, anon, authenticated;
grant execute on function public.claim_run_ticket(uuid, uuid, uuid, int) to service_role;
