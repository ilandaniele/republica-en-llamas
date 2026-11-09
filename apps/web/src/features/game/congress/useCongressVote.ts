import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSounds } from '../../../hooks/useSounds.js';
import type { Seat, VoteStatus } from './congressData.js';

const VOTING_MS = 2400;
const RESULT_PAUSE_MS = 240;
const FRAME_MS = 32;
const SOUND_GAP_MS = 80;

interface ScheduledVote {
  seatIndex: number;
  status: VoteStatus;
  delay: number;
}

interface RunningVote {
  schedule: ScheduledVote[];
  votes: VoteStatus[];
  index: number;
  startedAt: number;
  lastSoundAt: number;
  onFinished: () => void;
}

function buildVoteSchedule(seats: Seat[], independentYesPercent: number): ScheduledVote[] {
  const opposition = seats.filter((seat) => seat.bloc === 'hardOpposition' || seat.bloc === 'proOpposition');
  const independents = seats.filter((seat) => seat.bloc === 'independent');
  const government = seats.filter((seat) => seat.bloc === 'government');
  const yesCount = Math.round(
    (independents.length * Math.max(0, Math.min(100, independentYesPercent))) / 100,
  );
  const statuses: VoteStatus[] = independents.map((_, index) => (index < yesCount ? 'yes' : 'no'));
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j]!, statuses[i]!];
  }
  const order = [...opposition, ...independents, ...government];
  let independentIndex = 0;
  return order.map((seat, index) => ({
    seatIndex: seat.index,
    status:
      seat.bloc === 'government' ? 'yes' : seat.bloc === 'independent' ? statuses[independentIndex++]! : 'no',
    delay: (index * VOTING_MS) / Math.max(1, order.length - 1),
  }));
}

export function useCongressVote(seats: Seat[], independentYesPercent: number) {
  const [seatVotes, setSeatVotes] = useState<VoteStatus[]>(() => seats.map(() => 'pending'));
  const runningRef = useRef<RunningVote | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { playVoteTick } = useSounds();
  const soundRef = useRef(playVoteTick);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    soundRef.current = playVoteTick;
  }, [playVoteTick]);

  const cancelVoting = useCallback(() => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = null;
    runningRef.current = null;
  }, []);

  useEffect(() => cancelVoting, [cancelVoting]);

  const finishVoting = useCallback(() => {
    const running = runningRef.current;
    if (!running) return;
    cancelVoting();
    for (const vote of running.schedule) running.votes[vote.seatIndex] = vote.status;
    setSeatVotes([...running.votes]);
    running.onFinished();
  }, [cancelVoting]);

  const startVoting = useCallback(
    (onFinished: () => void) => {
      if (runningRef.current) return;
      const running: RunningVote = {
        schedule: buildVoteSchedule(seats, independentYesPercent),
        votes: seats.map(() => 'pending'),
        index: 0,
        startedAt: performance.now(),
        lastSoundAt: 0,
        onFinished,
      };
      runningRef.current = running;
      setSeatVotes([...running.votes]);
      if (reducedMotion) {
        finishVoting();
        return;
      }
      intervalRef.current = setInterval(() => {
        if (runningRef.current !== running) return;
        const elapsed = performance.now() - running.startedAt;
        const previousIndex = running.index;
        while (running.index < running.schedule.length && running.schedule[running.index]!.delay <= elapsed) {
          const vote = running.schedule[running.index++]!;
          running.votes[vote.seatIndex] = vote.status;
        }
        if (running.index !== previousIndex) {
          setSeatVotes([...running.votes]);
          if (elapsed - running.lastSoundAt >= SOUND_GAP_MS) {
            running.lastSoundAt = elapsed;
            soundRef.current(running.schedule[running.index - 1]!.status === 'yes' ? 440 : 180);
          }
        }
        if (elapsed >= VOTING_MS + RESULT_PAUSE_MS) finishVoting();
      }, FRAME_MS);
    },
    [seats, independentYesPercent, reducedMotion, finishVoting],
  );

  return { seatVotes, startVoting, finishVoting };
}
