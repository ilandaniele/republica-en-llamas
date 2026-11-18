import { describe, expect, it } from 'vitest';
import type { TurnDecision } from '@republica/game-engine';
import { ApiClient, finishedRun, signUp, startTicket } from './client.js';

interface RunList {
  runs: { id: string; score: number; run_events: unknown[] }[];
  total: number;
}

interface SavedRun {
  id: string;
  score: number;
}

async function submitValidRun(client: ApiClient): Promise<SavedRun> {
  const { ticketId, seed } = await startTicket(client);
  const run = finishedRun({ seed, difficulty: 'normal' });
  const { status, body } = await client.json<SavedRun>('/api/submit-run', { body: { ticketId, ...run } });
  expect(status).toBe(200);
  return body;
}

describe('start-run and submit-run', () => {
  it('accepts a replay produced by the game engine and dedupes a resubmission', async () => {
    const client = await signUp();
    const { ticketId, seed } = await startTicket(client);
    const run = finishedRun({ seed, difficulty: 'normal' });

    const first = await client.json<SavedRun>('/api/submit-run', { body: { ticketId, ...run } });
    expect(first.status).toBe(200);
    expect(first.body.score).toEqual(expect.any(Number));

    const again = await client.json('/api/submit-run', { body: { ticketId, ...run } });
    expect(again).toEqual({ status: 200, body: { ...first.body, duplicate: true } });
  });

  it('rejects tampered replays', async () => {
    const client = await signUp();
    const { ticketId, seed } = await startTicket(client);
    const run = finishedRun({ seed, difficulty: 'normal' });
    const forged: TurnDecision[] = run.decisions.map((decision, index) =>
      index === 0 ? { ...decision, cardId: 'forged-card' } : decision,
    );
    const submit = (body: unknown) => client.request('/api/submit-run', { body });

    expect(
      (await submit({ ticketId, config: run.config, decisions: run.decisions.slice(0, -1) })).status,
    ).toBe(422);
    expect((await submit({ ticketId, config: run.config, decisions: forged })).status).toBe(422);
    const otherSeed = finishedRun({ seed: (seed + 1) % 1_000_000, difficulty: 'normal' });
    expect((await submit({ ticketId, ...otherSeed })).status).toBe(403);
    expect((await submit({ ticketId, config: run.config })).status).toBe(400);

    expect((await client.json<RunList>('/api/runs')).body.total).toBe(0);
  });

  it('enforces the free daily run cap', async () => {
    const client = await signUp();
    for (let i = 0; i < 3; i++) await startTicket(client);
    const capped = await client.request('/api/start-run', { body: {} });
    expect(capped.status).toBe(429);
    expect(await capped.json()).toEqual({ error: 'Daily run limit reached' });
  });

  it('rejects a ticket issued to another user', async () => {
    const owner = await signUp();
    const thief = await signUp();
    const { ticketId, seed } = await startTicket(owner);
    const response = await thief.request('/api/submit-run', {
      body: { ticketId, ...finishedRun({ seed, difficulty: 'normal' }) },
    });
    expect(response.status).toBe(403);
  });
});

describe('leaderboard and history', () => {
  it('shows saved runs on the leaderboard and scopes history to the session user', async () => {
    const alice = await signUp();
    const bob = await signUp();
    const saved = await submitValidRun(alice);

    const board = await new ApiClient().json<{ id: string; username: string; score: number }[]>(
      '/api/leaderboard?difficulty=normal',
    );
    expect(board.status).toBe(200);
    expect(board.body.find((row) => row.id === saved.id)).toMatchObject({
      score: saved.score,
      username: expect.stringMatching(/^jugador_/),
    });
    expect((await new ApiClient().request('/api/leaderboard?difficulty=impossible')).status).toBe(400);

    const aliceRuns = await alice.json<RunList>('/api/runs');
    expect(aliceRuns.body.total).toBe(1);
    expect(aliceRuns.body.runs[0]).toMatchObject({ id: saved.id, score: saved.score });
    expect(aliceRuns.body.runs[0]?.run_events.length).toBeGreaterThan(0);

    expect(await bob.json<RunList>('/api/runs')).toEqual({ status: 200, body: { runs: [], total: 0 } });
  });
});
