import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.PGLITE_MODULE;
const { PGlite } = modulePath
  ? await import(pathToFileURL(modulePath).href)
  : await import('@electric-sql/pglite');
const db = new PGlite();
await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema auth;
  create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}', is_anonymous boolean default false);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid;
  $$;
  create function public.uuid_generate_v4() returns uuid language sql as $$ select gen_random_uuid(); $$;
`);
for (const name of [
  '001_initial.sql',
  '003_entitlements.sql',
  '004_security_and_indexes.sql',
  '005_username_available.sql',
  '006_server_validated_runs.sql',
  '007_run_tickets.sql',
  '008_run_ticket_daily_limit.sql',
  '009_anonymous_guests.sql',
  '010_api_security.sql',
]) {
  const migration = (await readFile(`supabase/migrations/${name}`, 'utf8'))
    .replace(/^\uFEFF/, '')
    .replace('create extension if not exists "uuid-ossp";', '');
  await db.exec(migration);
}
await db.exec(
  'grant usage on schema public, auth to authenticated, anon; grant select,insert,update,delete on all tables in schema public to authenticated, anon',
);
after(async () => {
  await db.close();
});

const USER = '11111111-1111-4111-8111-111111111111';
const OTHER = '33333333-3333-4333-8333-333333333333';
const TICKET = '22222222-2222-4222-8222-222222222222';
const SECOND = '44444444-4444-4444-8444-444444444444';
await db.query(
  "insert into auth.users(id,email) values ($1,'owner@example.test'),($2,'other@example.test')",
  [USER, OTHER],
);
await db.query('insert into public.run_tickets values ($1,$2,42),($3,$2,42)', [TICKET, USER, SECOND]);

function args(ticket = TICKET) {
  const config = { seed: 42, difficulty: 'normal' };
  const state = {
    isGameOver: true,
    seed: 42,
    difficulty: 'normal',
    score: 100,
    turn: 2,
    gameOverReason: 'bankrupt',
    language: 'es',
    history: [{ turn: 1, cardId: 'card', choiceIndex: 0, effectsApplied: {} }],
  };
  return [USER, ticket, config, state, [{ kind: 'choice', cardId: 'card', choiceIndex: 0 }]];
}
const save = (values) => db.query('select public.save_validated_run($1,$2,$3,$4,$5) as result', values);

test('SQL migration compiles and bounded counter resets after the window', async () => {
  const consume = () => db.query('select public.consume_api_rate_limit($1,2,60) as allowed', ['test:user']);
  assert.equal((await consume()).rows[0].allowed, true);
  assert.equal((await consume()).rows[0].allowed, true);
  assert.equal((await consume()).rows[0].allowed, false);
  await db.exec("update public.api_rate_limits set window_start = now() - interval '61 seconds'");
  assert.equal((await consume()).rows[0].allowed, true);
});

test('SQL functions reject anon/authenticated roles and rate table has RLS', async () => {
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`set role ${role}`);
    await assert.rejects(
      db.query("select public.consume_api_rate_limit('forbidden',10,60)"),
      /permission denied/,
    );
    await assert.rejects(save(args()), /permission denied/);
    await db.exec('reset role');
  }
  const { rows } = await db.query(
    "select relrowsecurity from pg_class where oid='public.api_rate_limits'::regclass",
  );
  assert.equal(rows[0].relrowsecurity, true);
});

test('SQL save rejects another owner ticket and rolls back malformed event inserts', async () => {
  const otherOwner = args();
  otherOwner[0] = OTHER;
  await assert.rejects(save(otherOwner), /Invalid run ticket/);
  const invalid = args();
  delete invalid[3].history[0].effectsApplied;
  await assert.rejects(save(invalid), /null value/);
  assert.equal((await db.query('select count(*)::integer as count from public.game_runs')).rows[0].count, 0);
});

test('SQL save persists events atomically and idempotent retries return the stored score', async () => {
  const result = (await save(args())).rows[0].result;
  assert.equal(result.score, 100);
  assert.ok(result.id);
  const altered = args();
  altered[3].score = 999;
  const duplicate = (await save(altered)).rows[0].result;
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.score, 100);
  assert.equal(duplicate.id, result.id);
  assert.equal((await db.query('select count(*)::integer as count from public.run_events')).rows[0].count, 1);
  const anotherTicket = (await save(args(SECOND))).rows[0].result;
  assert.equal(anotherTicket.duplicate, true);
  assert.equal(anotherTicket.id, result.id);
});

test('existing RLS isolates profiles, runs, events and purchases and forbids client score grants', async () => {
  const otherRun = await db.query(
    "insert into public.game_runs(user_id,difficulty,seed) values ($1,'normal',7) returning id",
    [OTHER],
  );
  await db.query(
    "insert into public.run_events(run_id,turn_number,card_id,choice_index,effects_json) values ($1,1,'other',0,'{}')",
    [otherRun.rows[0].id],
  );
  await db.query(
    "insert into public.user_entitlements(user_id,entitlement) values ($1,'full_access'),($2,'presidents_pack')",
    [USER, OTHER],
  );
  await db.exec(`set role authenticated; set request.jwt.claim.sub = '${USER}'`);
  for (const [table, expected] of [
    ['profiles', 1],
    ['game_runs', 1],
    ['run_events', 1],
    ['user_entitlements', 1],
    ['run_tickets', 0],
    ['api_rate_limits', 0],
  ]) {
    const { rows } = await db.query(`select count(*)::integer as count from public.${table}`);
    assert.equal(rows[0].count, expected, table);
  }
  await assert.rejects(
    db.query("insert into public.game_runs(user_id,difficulty,seed) values ($1,'normal',7)", [USER]),
    /row-level security/,
  );
  await assert.rejects(
    db.query("insert into public.user_entitlements(user_id,entitlement) values ($1,'remove_ads')", [USER]),
    /row-level security/,
  );
  assert.equal((await db.query('update public.game_runs set score=999 returning id')).rows.length, 0);
  assert.equal(
    (await db.query('update public.profiles set username=$1 where id=$2 returning id', ['hijacked', OTHER]))
      .rows.length,
    0,
  );
  await db.exec('reset role');
});

test('profile payload bounds remain enforced for direct authenticated database calls', async () => {
  await db.exec(`set role authenticated; set request.jwt.claim.sub = '${USER}'`);
  await assert.rejects(
    db.query('update public.profiles set username=$1 where id=$2', ['x'.repeat(65), USER]),
    /profiles_username_length/,
  );
  await assert.rejects(
    db.query('update public.profiles set avatar_url=$1 where id=$2', ['x'.repeat(2049), USER]),
    /profiles_avatar_url_length/,
  );
  assert.equal(
    (await db.query('select public.username_available($1) as available', ['x'.repeat(65)])).rows[0].available,
    false,
  );
  await db.exec('reset role');
});

test('rate retention only deletes expired buckets and is not callable by clients', async () => {
  await db.exec("insert into public.api_rate_limits values ('expired',now()-interval '2 days',1)");
  assert.equal((await db.query('select public.prune_api_rate_limits() as count')).rows[0].count, 1);
  assert.equal(
    (await db.query('select count(*)::integer as count from public.api_rate_limits')).rows[0].count,
    1,
  );
  await db.exec('set role authenticated');
  await assert.rejects(db.query('select public.prune_api_rate_limits()'), /permission denied/);
  await db.exec('reset role');
});
