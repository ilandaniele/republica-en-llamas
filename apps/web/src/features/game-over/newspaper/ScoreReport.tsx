import { getBestMomentTurn, getCounterfactual, getFatalDecision } from '@republica/game-engine';
import type { GameOverReason, GameState } from '@republica/game-engine';
import type { PersonalBest } from '../../../stores/gameStore.js';
import { DIFFICULTY_LABELS, getRunMedals } from '../gameOverCopy.js';
import type { Medal } from '../gameOverCopy.js';

type FatalDecision = ReturnType<typeof getFatalDecision>;

interface ScoreReportProps {
  gameState: GameState;
  reason: GameOverReason;
  isWin: boolean;
  personalBest: PersonalBest | null;
  isCrisisExpress: boolean;
  anibalLine: string;
}

function ScoreRow({
  label,
  value,
  color = 'text-smoke-700',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-smoke-200 py-1">
      <span className="text-smoke-500 text-sm" style={{ fontFamily: "'VT323', monospace" }}>
        {label}
      </span>
      <span className={`font-bold ${color}`} style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
        {value}
      </span>
    </div>
  );
}

function ScoreBreakdown({ gameState }: { gameState: GameState }) {
  const bestMomentTurn = getBestMomentTurn(gameState.history);
  return (
    <>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '6px',
          color: '#444',
          marginBottom: '8px',
          letterSpacing: '0.1em',
        }}
      >
        INFORME FINAL DEL MANDATO
      </div>
      <div className="space-y-1">
        <ScoreRow
          label="Dificultad"
          value={DIFFICULTY_LABELS[gameState.difficulty] ?? gameState.difficulty}
        />
        <ScoreRow
          label="Popularidad final"
          value={`${Math.round(gameState.political.popularity)}%`}
          color={gameState.political.popularity < 25 ? 'text-red-700' : 'text-smoke-700'}
        />
        <ScoreRow label="Estabilidad social" value={`${Math.round(gameState.political.socialStability)}%`} />
        <ScoreRow label="Déficit público" value={`${Math.round(gameState.economic.publicDeficit)}%`} />
        <ScoreRow
          label="Leyes aprobadas"
          value={String(gameState.congress.lawsPassedThisRun)}
          color="text-blue-700"
        />
        <ScoreRow
          label="Decretos de emergencia"
          value={String(gameState.political.emergencyDecreesUsed)}
          color={gameState.political.emergencyDecreesUsed > 2 ? 'text-red-700' : 'text-smoke-700'}
        />
        {bestMomentTurn && (
          <ScoreRow label="Mejor momento" value={`Turno ${bestMomentTurn}`} color="text-emerald-700" />
        )}
      </div>
    </>
  );
}

function FatalDecisionBlock({ fatalDecision }: { fatalDecision: NonNullable<FatalDecision> }) {
  const counterfactual = getCounterfactual(fatalDecision);
  return (
    <>
      <div className="pixel-border-crisis mt-4 p-3" style={{ background: '#fff0f0' }}>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '6px',
            color: '#8b0000',
            marginBottom: '4px',
          }}
        >
          ERROR FATAL
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: '#555' }}>
          Turno {fatalDecision.turn} &mdash; la decisión más dañina del mandato.
        </div>
        {counterfactual && (
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '14px',
              color: '#888',
              marginTop: '4px',
              fontStyle: 'italic',
            }}
          >
            Si hubieras... {counterfactual}
          </div>
        )}
      </div>
    </>
  );
}

function PersonalBestRow({
  personalBest,
  isNewRecord,
}: {
  personalBest: PersonalBest;
  isNewRecord: boolean;
}) {
  return (
    <>
      <div
        className="pixel-border mt-3 flex items-center justify-between p-2"
        style={{ background: '#e8e4d0' }}
      >
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666' }}>
          {isNewRecord ? '🏆 NUEVO RECORD' : 'TU RECORD'}
        </span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: '#444' }}>
          {personalBest.turns} turnos · {personalBest.score.toLocaleString()} pts
        </span>
      </div>
    </>
  );
}

function MedalsList({ medals }: { medals: Medal[] }) {
  return (
    <>
      <div className="mb-2 mt-3">
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '6px',
            color: '#444',
            marginBottom: '6px',
            letterSpacing: '0.1em',
          }}
        >
          LOGROS
        </div>
        <div className="flex flex-wrap gap-2">
          {medals.map((m) => (
            <div
              key={m.label}
              className="pixel-border-gold flex items-center gap-1 px-2 py-1"
              style={{ background: '#e8e4d0' }}
            >
              <span style={{ fontSize: '14px' }}>{m.icon}</span>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '5px',
                  color: '#5a4a00',
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function FinalScore({ score, isWin }: { score: number; isWin: boolean }) {
  return (
    <>
      <div
        className="pixel-border mt-3 flex items-center justify-between px-3 py-2"
        style={{ background: '#d4d0c0' }}
      >
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#444' }}>
          PUNTAJE FINAL
        </span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '12px',
            color: isWin ? '#2a6e00' : '#8b0000',
          }}
        >
          {score.toLocaleString()}
        </span>
      </div>
    </>
  );
}

function AnibalQuote({ anibalLine }: { anibalLine: string }) {
  return (
    <>
      <div
        className="mt-3"
        style={{
          fontFamily: "'VT323', monospace",
          fontSize: '16px',
          color: '#666',
          fontStyle: 'italic',
        }}
      >
        📻 &ldquo;{anibalLine}&rdquo; &mdash; Gordo Aníbal, AM1010
      </div>
    </>
  );
}

export function ScoreReport({
  gameState,
  reason,
  isWin,
  personalBest,
  isCrisisExpress,
  anibalLine,
}: ScoreReportProps) {
  const fatalDecision = getFatalDecision(gameState.history, reason);
  const medals = getRunMedals(gameState, isCrisisExpress);
  const isNewRecord = !isWin && (!personalBest || gameState.score > personalBest.score);

  return (
    <div className="px-6 pb-4">
      <ScoreBreakdown gameState={gameState} />
      {fatalDecision && !isWin && <FatalDecisionBlock fatalDecision={fatalDecision} />}
      {personalBest && !isWin && <PersonalBestRow personalBest={personalBest} isNewRecord={isNewRecord} />}
      {medals.length > 0 && <MedalsList medals={medals} />}
      <FinalScore score={gameState.score} isWin={isWin} />
      {anibalLine && <AnibalQuote anibalLine={anibalLine} />}
    </div>
  );
}
