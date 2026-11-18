import { applyD1Migrations, env } from 'cloudflare:test';
import { afterEach, beforeAll, beforeEach, expect, vi } from 'vitest';

export const outboundFetch = vi.fn(async (input: RequestInfo | URL) => {
  throw new Error(`Unexpected outbound fetch: ${String(input instanceof Request ? input.url : input)}`);
});

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

beforeEach(() => {
  outboundFetch.mockClear();
  vi.stubGlobal('fetch', outboundFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  expect(outboundFetch).not.toHaveBeenCalled();
});
