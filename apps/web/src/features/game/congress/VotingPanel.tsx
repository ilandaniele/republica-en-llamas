import { m } from 'framer-motion';
import { VISUAL_SEATS } from './congressData.js';
import type { Seat, VoteStatus } from './congressData.js';
import { Hemicycle } from './Hemicycle.js';

interface VotingPanelProps {
  title: string;
  seats: Seat[];
  seatVotes: VoteStatus[];
  required: number;
  total: number;
}

function LiveVoteBar({ seatVotes, required, total }: Omit<VotingPanelProps, 'title' | 'seats'>) {
  const toRealSeats = (status: VoteStatus) =>
    Math.round((seatVotes.filter((v) => v === status).length * total) / VISUAL_SEATS);
  const liveRealYes = toRealSeats('yes');
  const liveRealNo = toRealSeats('no');
  const markerPct = required / total;
  const noBarPct = Math.min(1, liveRealNo / total);
  const yesBarPct = Math.min(1, liveRealYes / total);

  return (
    <div className="px-2">
      <div className="mb-1 flex justify-between font-mono text-xs text-smoke-400">
        <span className="text-crimson-400">NO: {liveRealNo}</span>
        <span className="text-smoke-500">— {required} necesarios —</span>
        <span className="text-emerald-400">SÍ: {liveRealYes}</span>
      </div>
      <div
        className="relative h-4 overflow-hidden rounded-full border border-navy-600 bg-navy-800"
        style={{ width: '100%' }}
      >
        {/* NO fill from left */}
        <div
          className="absolute left-0 top-0 h-full bg-crimson-600 transition-all duration-100"
          style={{ width: `${noBarPct * 100}%` }}
        />
        {/* YES fill from right */}
        <div
          className="absolute right-0 top-0 h-full bg-emerald-600 transition-all duration-100"
          style={{ width: `${yesBarPct * 100}%` }}
        />
        {/* Required marker */}
        <div
          className="absolute bottom-0 top-0 z-10 w-0.5 bg-gold-400"
          style={{ left: `${markerPct * 100}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-xs text-smoke-600">
        <span>Oposición</span>
        <span className="text-gold-500">← mayoría →</span>
        <span>Oficialismo</span>
      </div>
    </div>
  );
}

function BlocLegend() {
  return (
    <div className="text-smoke-500 flex flex-wrap justify-center gap-3 font-mono text-xs">
      {(
        [
          ['#9C27B0', 'Oficialismo'],
          ['#1565C0', 'UxP'],
          ['#FFD600', 'PRO'],
          ['#78909C', 'Independientes'],
          ['#43A047', 'SÍ'],
          ['#E53935', 'NO'],
          ['#FFA726', 'Abstención'],
        ] as const
      ).map(([color, label]) => (
        <span key={label} className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

export function VotingPanel({ title, seats, seatVotes, required, total }: VotingPanelProps) {
  return (
    <m.div key="voting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="text-center">
        <p className="text-smoke-500 font-mono text-xs uppercase tracking-widest">{title}</p>
        <p className="mt-1 font-mono text-sm text-smoke-400">Hemiciclo en vivo</p>
      </div>
      <Hemicycle seats={seats} seatVotes={seatVotes} required={required} live />
      <LiveVoteBar seatVotes={seatVotes} required={required} total={total} />
      <BlocLegend />
    </m.div>
  );
}
