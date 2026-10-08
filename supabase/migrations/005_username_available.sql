-- Profiles are only readable by their owner, so a client-side lookup can never
-- see another user's username. Expose existence only, through a definer function.
create or replace function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.profiles where username = name);
$$;

revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;
