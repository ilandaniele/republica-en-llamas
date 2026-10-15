import { useCallback, useEffect, useRef, useState } from 'react';
import { VISUAL_SEATS } from './congressData.js';
import type { Seat, VoteStatus } from './congressData.js';

const WAVE_GAP_MS = 800;
const RESULT_PAUSE_MS = 600;

function playTick(freq = 220) {
  try {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    /* ignore */
  }
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

function independentVotes(count: number, yesPercent: number): VoteStatus[] {
  const yes = Math.round((count * Math.min(100, yesPercent)) / 100);
  const no = Math.max(0, Math.round(count * 0.6) - yes);
  const abstain = Math.max(0, count - yes - no);
  return shuffle<VoteStatus>([
    ...Array<VoteStatus>(yes).fill('yes'),
    ...Array<VoteStatus>(no).fill('no'),
    ...Array<VoteStatus>(abstain).fill('abstain'),
  ]);
}

function tickFrequency(status: VoteStatus): number {
  if (status === 'no') return 180;
  return status === 'yes' ? 440 : 200;
}

interface ScheduledVote {
  seatIndex: number;
  status: VoteStatus;
  delay: number;
  tick: number;
}

function buildVoteSchedule(seats: Seat[], independentYesPercent: number) {
  const opposition = seats.filter((s) => s.bloc === 'hardOpposition' || s.bloc === 'proOpposition');
  const independents = seats.filter((s) => s.bloc === 'independent');
  const government = seats.filter((s) => s.bloc === 'government');
  const independentStatuses = independentVotes(independents.length, independentYesPercent);

  const schedule: ScheduledVote[] = [];
  let delay = 0;
  const addWave = (wave: Seat[], statusOf: (i: number) => VoteStatus, step: number, tick?: number) => {
    wave.forEach((seat, i) => {
      const status = statusOf(i);
      schedule.push({ seatIndex: seat.index, status, delay, tick: tick ?? tickFrequency(status) });
      delay += step;
    });
  };

  addWave(opposition, () => 'no', 12);
  delay += WAVE_GAP_MS;
  addWave(independents, (i) => independentStatuses[i] ?? 'abstain', 55);
  delay += WAVE_GAP_MS;
  addWave(government, () => 'yes', 8);

  return { schedule, finishedAt: delay + RESULT_PAUSE_MS };
}

export function useCongressVote(seats: Seat[], independentYesPercent: number) {
  const [seatVotes, setSeatVotes] = useState<VoteStatus[]>(() => new Array(VISUAL_SEATS).fill('pending'));
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startVoting = useCallback(
    (onFinished: () => void) => {
      clearTimers();
      const { schedule, finishedAt } = buildVoteSchedule(seats, independentYesPercent);
      timeoutsRef.current = schedule.map(({ seatIndex, status, delay, tick }) =>
        setTimeout(() => {
          setSeatVotes((prev) => {
            const next = [...prev];
            next[seatIndex] = status;
            return next;
          });
          playTick(tick);
        }, delay),
      );
      timeoutsRef.current.push(setTimeout(onFinished, finishedAt));
    },
    [seats, independentYesPercent, clearTimers],
  );

  return { seatVotes, startVoting };
}
