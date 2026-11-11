const DAY_MS = 86_400_000;
const FREE_DAILY_RUNS = 3;
const FULL_ACCESS_DAILY_RUNS = 30;

const DAILY_CAP_SQL = `(case when exists(select 1 from user_entitlements where user_id = ?1 and entitlement = 'full_access')
  then ${FULL_ACCESS_DAILY_RUNS} else ${FREE_DAILY_RUNS} end)`;

function dayAgo(): string {
  return new Date(Date.now() - DAY_MS).toISOString();
}

export async function issueRunTicket(db: D1Database, userId: string): Promise<{ id: string; seed: number } | null> {
  const seed = crypto.getRandomValues(new Uint32Array(1))[0]! % 1_000_000;
  return db
    .prepare(
      `insert into run_tickets (id, user_id, seed, created_at)
       select ?2, ?1, ?3, ?4
       where (select count(*) from run_tickets where user_id = ?1 and created_at > ?5) < ${DAILY_CAP_SQL}
       returning id, seed`,
    )
    .bind(userId, crypto.randomUUID(), seed, new Date().toISOString(), dayAgo())
    .first<{ id: string; seed: number }>();
}

export function transferGuestTickets(db: D1Database, guestId: string, userId: string): Promise<D1Result> {
  return db
    .prepare(
      `update run_tickets set user_id = ?1, created_at = ?3
       where id in (
         select id from run_tickets where user_id = ?2 and created_at > ?4
         order by created_at desc
         limit max(0, ${DAILY_CAP_SQL} - (select count(*) from run_tickets where user_id = ?1 and created_at > ?4))
       )`,
    )
    .bind(userId, guestId, new Date().toISOString(), dayAgo())
    .run();
}
