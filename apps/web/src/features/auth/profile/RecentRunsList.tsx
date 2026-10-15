import type { RecentRun } from '../useProfile.js';

function RecentRunRow({ run }: { run: RecentRun }) {
  return (
    <div className="pixel-border flex items-center justify-between bg-navy-900/60 px-3 py-2">
      <div>
        <span
          className={`font-mono text-xs font-bold ${run.is_win ? 'text-emerald-400' : 'text-crimson-400'}`}
        >
          {run.is_win ? '✓' : '✗'}
        </span>
        <span className="ml-2 font-mono text-xs capitalize text-smoke-400">{run.difficulty}</span>
        <span className="ml-2 font-mono text-xs text-smoke-600">T{run.turns_survived}</span>
      </div>
      <span className="font-mono text-xs font-bold text-gold-400">{run.score.toLocaleString()}</span>
    </div>
  );
}

function RecentRunsBody({ runs, loading }: { runs: RecentRun[]; loading: boolean }) {
  if (loading) {
    return <p className="text-smoke-500 animate-pulse font-mono text-xs">Cargando historial...</p>;
  }
  if (runs.length === 0) {
    return <p className="text-smoke-500 font-mono text-xs">Sin partidas registradas aún.</p>;
  }
  return (
    <div className="space-y-2">
      {runs.map((run) => (
        <RecentRunRow key={run.id} run={run} />
      ))}
    </div>
  );
}

export function RecentRunsList({ runs, loading }: { runs: RecentRun[]; loading: boolean }) {
  return (
    <div className="pixel-border bg-navy-800 p-4">
      <h3
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '7px',
          color: 'var(--gold)',
          letterSpacing: '0.1em',
          marginBottom: '16px',
          textTransform: 'uppercase',
        }}
      >
        Últimas Partidas
      </h3>
      <RecentRunsBody runs={runs} loading={loading} />
    </div>
  );
}
