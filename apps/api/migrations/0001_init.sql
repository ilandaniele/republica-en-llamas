-- Better Auth core tables (generated for better-auth 1.7.18 with the anonymous plugin and database rate limits).
create table "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" integer not null, "image" text, "createdAt" date not null, "updatedAt" date not null, "isAnonymous" integer);
create table "session" ("id" text not null primary key, "expiresAt" date not null, "token" text not null unique, "createdAt" date not null, "updatedAt" date not null, "ipAddress" text, "userAgent" text, "userId" text not null references "user" ("id") on delete cascade);
create table "account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id") on delete cascade, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" date, "refreshTokenExpiresAt" date, "scope" text, "password" text, "createdAt" date not null, "updatedAt" date not null);
create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" date not null, "createdAt" date not null, "updatedAt" date not null);
create table "rateLimit" ("id" text not null primary key, "key" text not null unique, "count" integer not null, "lastRequest" bigint not null);
create index "session_userId_idx" on "session" ("userId");
create index "account_userId_idx" on "account" ("userId");
create index "verification_identifier_idx" on "verification" ("identifier");

-- Public handles never derive from email or OAuth names; the API generates neutral ones.
create table profiles (
  id text primary key references "user" ("id") on delete cascade,
  username text not null unique check (length(trim(username)) between 1 and 64),
  avatar_url text check (avatar_url is null or length(avatar_url) <= 2048),
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create table run_tickets (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  seed integer not null,
  created_at text not null
);
create index run_tickets_user_created_idx on run_tickets (user_id, created_at desc);

create table game_runs (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  ticket_id text unique,
  difficulty text not null check (difficulty in ('easy', 'normal', 'hard', 'crisis')),
  seed integer not null,
  score integer not null default 0,
  turns_survived integer not null default 0,
  game_over_reason text,
  is_win integer not null default 0,
  final_state text,
  language text not null default 'es',
  crisis_express integer not null default 0,
  scenario_id text,
  decisions text not null,
  decisions_hash text not null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  completed_at text,
  unique (user_id, seed, decisions_hash)
);
create index game_runs_user_created_idx on game_runs (user_id, created_at desc);
create index game_runs_score_idx on game_runs (score desc) where completed_at is not null;
create index game_runs_difficulty_score_idx on game_runs (difficulty, score desc) where completed_at is not null;

create table run_events (
  id text primary key,
  run_id text not null references game_runs (id) on delete cascade,
  turn_number integer not null,
  card_id text not null,
  choice_index integer not null,
  negotiation text,
  effects_json text not null default '{}',
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  unique (run_id, turn_number)
);

create table user_entitlements (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  entitlement text not null,
  purchased_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  stripe_session_id text unique,
  platform text not null default 'web' check (platform in ('web', 'ios', 'android')),
  unique (user_id, entitlement)
);

create table api_rate_limits (
  bucket_key text primary key,
  window_start integer not null,
  request_count integer not null
);
