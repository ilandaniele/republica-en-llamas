-- user_entitlements table
create table if not exists public.user_entitlements (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  entitlement        text not null,
  purchased_at       timestamptz not null default now(),
  stripe_session_id  text unique,
  platform           text not null default 'web' check (platform in ('web', 'ios', 'android')),
  constraint user_entitlements_unique unique (user_id, entitlement)
);
create index if not exists user_entitlements_user_id_idx on public.user_entitlements (user_id);
alter table public.user_entitlements enable row level security;
create policy "Users read own entitlements" on public.user_entitlements for select using (auth.uid() = user_id);
create policy "Service role insert entitlements" on public.user_entitlements for insert with check (true);
