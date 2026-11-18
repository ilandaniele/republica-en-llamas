import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { isRunConfig, isTurnDecision, normalizeDecision, replayRun } from '../../packages/game-engine/src/index.js';
import type { Difficulty } from '../../packages/game-engine/src/index.js';
import { playLongRun } from './play-run.js';

const WORKERS_FREE_CPU_MS = 10;
const ITERATIONS = Number(process.argv[2] ?? 200);

function submitCpuWork(body: string): number {
  const started = performance.now();
  const parsed = JSON.parse(body) as { config: unknown; decisions: unknown[] };
  if (!isRunConfig(parsed.config) || !parsed.decisions.every(isTurnDecision)) throw new Error('Invalid fixture');
  const decisions = parsed.decisions.map(normalizeDecision);
  const state = replayRun(parsed.config, decisions);
  const stateJson = JSON.stringify(state);
  createHash('sha256').update(JSON.stringify(decisions)).digest('hex');
  if (!state.isGameOver || stateJson.length === 0) throw new Error('Replay did not finish');
  return performance.now() - started;
}

function percentile(sorted: number[], p: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))]!;
}

const rows = (['easy', 'crisis'] as Difficulty[]).map((difficulty) => {
  const { decisions, state } = playLongRun({ seed: 424242, difficulty });
  const body = JSON.stringify({ config: { seed: 424242, difficulty }, decisions });
  const cold = submitCpuWork(body);
  const samples = Array.from({ length: ITERATIONS }, () => submitCpuWork(body)).sort((a, b) => a - b);
  return {
    difficulty,
    decisions: decisions.length,
    reason: state.gameOverReason,
    bodyBytes: body.length,
    stateBytes: JSON.stringify(state).length,
    coldMs: Number(cold.toFixed(2)),
    p50Ms: Number(percentile(samples, 50).toFixed(3)),
    p95Ms: Number(percentile(samples, 95).toFixed(3)),
    p99Ms: Number(percentile(samples, 99).toFixed(3)),
    maxMs: Number(samples.at(-1)!.toFixed(3)),
  };
});

console.log(JSON.stringify({ node: process.version, iterations: ITERATIONS, budgetMs: WORKERS_FREE_CPU_MS, rows }, null, 2));
