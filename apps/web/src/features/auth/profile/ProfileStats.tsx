import type { PersonalBest } from '../../../stores/gameStore.js';
import type { RecentRun } from '../useProfile.js';

interface ProfileStatsProps {
  recentRuns: RecentRun[];
  totalRuns: number;
  personalBest: PersonalBest | null;
}

export function ProfileStats({ recentRuns, totalRuns, personalBest }: ProfileStatsProps) {
  const bestRecentScore = recentRuns.reduce((max, r) => Math.max(max, r.score), 0);
  const stats = [
    { label: 'Partidas', value: totalRuns.toString() },
    { label: 'Mejor Score', value: (personalBest?.score ?? bestRecentScore).toLocaleString() },
    { label: 'Mejor Turno', value: personalBest ? `T${personalBest.turns}` : '—' },
  ];

  return (
    <div className="mb-6 grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="pixel-border bg-navy-800 p-4 text-center">
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '6px',
              color: 'var(--peso-grey)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {stat.label}
          </p>
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '14px',
              color: 'var(--gold)',
              marginTop: '6px',
            }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
