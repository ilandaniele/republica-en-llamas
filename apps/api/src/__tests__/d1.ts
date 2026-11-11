import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

type Value = string | number | null;

class Statement {
  constructor(
    private readonly db: DatabaseSync,
    private readonly sql: string,
    private readonly params: Value[] = [],
  ) {}

  bind(...params: unknown[]): Statement {
    return new Statement(
      this.db,
      this.sql,
      params.map((value) => (value === undefined ? null : (value as Value))),
    );
  }

  private rows(): Record<string, unknown>[] {
    return this.db.prepare(this.sql).all(...this.params) as Record<string, unknown>[];
  }

  async first<T>(): Promise<T | null> {
    return (this.rows()[0] as T | undefined) ?? null;
  }

  async all<T>() {
    return { results: this.rows() as T[], success: true, meta: {} };
  }

  async run() {
    const before = this.changes();
    const results = this.rows();
    return { results, success: true, meta: { changes: this.changes() - before } };
  }

  private changes(): number {
    return (this.db.prepare('select total_changes() as total').get() as { total: number }).total;
  }
}

export function createTestDb(): D1Database {
  const db = new DatabaseSync(':memory:');
  db.exec('pragma foreign_keys = on');
  const dir = resolve(import.meta.dirname, '../../migrations');
  for (const file of readdirSync(dir).sort()) db.exec(readFileSync(resolve(dir, file), 'utf8'));

  const d1 = {
    prepare: (sql: string) => new Statement(db, sql),
    batch: async (statements: Statement[]) => {
      db.exec('begin');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        db.exec('commit');
        return results;
      } catch (error) {
        db.exec('rollback');
        throw error;
      }
    },
    exec: async (sql: string) => {
      db.exec(sql);
      return { count: 0, duration: 0 };
    },
  };
  return d1 as unknown as D1Database;
}
